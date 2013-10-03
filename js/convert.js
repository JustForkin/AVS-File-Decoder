
var componentTable = builtinComponents.concat(dllComponents);

function convertPreset (presetFile) {
	var preset = {};
	//var blob32 = new Uint32Array(preset);
	var blob8 = new Uint8Array(presetFile);
	try {
		var clearFrame = decodePresetHeader(blob8.subarray(0, presetHeaderLength));
		preset['clearFrame'] = clearFrame;
		var components = convertComponents(blob8.subarray(presetHeaderLength));
		preset['components'] = components;
	} catch (e) {
		if(e instanceof ConvertException) {
			log("Error: "+e.message);
			return null;
		} else {
			throw e;
		}
	}
	return preset;
}

function convertComponents (blob) {
	var fp = 0;
	var components = [];
	while(fp < blob.length) {
		var code = getUInt32(blob, fp);
		var i = getComponentIndex(code, blob, fp);
		var isDll = code>builtinMax && code!==0xfffffffe;
		var size = getComponentSize(blob, fp+sizeInt+isDll*32);
		if(i<0) {
			var res = {'type': 'Unknown: ('+(-i)+')'};
		} else {
			var offset = fp+sizeInt*2+isDll*32;
			var res = window["decode_"+componentTable[i].func](
				blob,
				offset,
				componentTable[i].fields,
				componentTable[i].name,
				offset+size);
		}
		if(!res || typeof res !== "object") { // should not happen, decode functions should throw their own.
			throw new ConvertException("Unknown convert error");
		}
		components.push(res);
		fp += size + sizeInt*2 + isDll*32;
	}
	return components;
}

function getComponentIndex (code, blob, offset) {
	if(code<builtinMax || code===0xfffffffe) {
		for (var i = 0; i < componentTable.length; i++) {
			if(code === componentTable[i].code) {
				log("Found component: "+componentTable[i].name+" ("+code+")");
				return i;
			}
		};
	} else {
		for (var i = builtinComponents.length; i < componentTable.length; i++) {
			if(componentTable[i].code instanceof Array &&
					cmpBytes(blob, offset+sizeInt, componentTable[i].code)) {
				log("Found component: "+componentTable[i].name);
				return i;
			}
		};
	}
	log("Found unknown component (code: "+code+")");
	return -code;
}

function getComponentSize (blob, offset) {
	return getUInt32(blob, offset);
}

function decodePresetHeader(blob) {
	var presetHeader = [ // reads: "Nullsoft AVS Preset 0.2 \x1A"
			0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74,
			0x20, 0x41, 0x56, 0x53, 0x20, 0x50, 0x72, 0x65,
			0x73, 0x65, 0x74, 0x20, 0x30, 0x2E, 0x32, 0x1A,];
	if(!cmpBytes(blob, /*offset*/0, presetHeader)) {
		throw new ConvertException("Invalid preset header.");
	}
	return blob[presetHeaderLength-1]===1; // "Clear Every Frame"
}

//// component decode functions

function decode_effectList (blob, offset) {
	var size = getUInt32(blob, offset-sizeInt);
	var comp = {
		'type': 'EffectList',
		'enabled': getBit(blob, offset, 1)[0]!==1,
		'clearFrame': getBit(blob, offset, 0)[0]===1,
		'input': getBlendmodeIn(blob, offset+2, 1)[0],
		'output': getBlendmodeOut(blob, offset+3, 1)[0],
		//ignore constant el config size of 36 bytes (9 x int32)
		'inAdjustBlend': getUInt32(blob, offset+5),
		'outAdjustBlend': getUInt32(blob, offset+9),
		'inBuffer': getUInt32(blob, offset+13),
		'outBuffer': getUInt32(blob, offset+17),
		'inBufferInvert': getUInt32(blob, offset+21)===1,
		'outBufferInvert': getUInt32(blob, offset+25)===1,
		'enableOnBeat': getUInt32(blob, offset+29)===1,
		'onBeatFrames': getUInt32(blob, offset+33),
	};
	var effectList28plusHeader = [ // reads: .$..AVS 2.8+ Effect List Config....
			0x00, 0x40, 0x00, 0x00, 0x41, 0x56, 0x53, 0x20,
			0x32, 0x2E, 0x38, 0x2B, 0x20, 0x45, 0x66, 0x66,
			0x65, 0x63, 0x74, 0x20, 0x4C, 0x69, 0x73, 0x74,
			0x20, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00,
			0x00, 0x00, 0x00, 0x00];
	var extOffset = offset+37;
	var contSize = size-37;
	var contOffset = extOffset;
	if(cmpBytes(blob, extOffset, effectList28plusHeader)) {
		extOffset += effectList28plusHeader.length;
		var extSize = getUInt32(blob, extOffset);
		contOffset += effectList28plusHeader.length+sizeInt+extSize;
		contSize = size-37-effectList28plusHeader.length-sizeInt-extSize;
		comp['codeEnabled'] = getUInt32(blob, extOffset+sizeInt)===1;
		var initSize = getUInt32(blob, extOffset+sizeInt*2);
		comp['init'] = getSizeString(blob, extOffset+sizeInt*2)[0];
		comp['frame'] = getSizeString(blob, extOffset+sizeInt*3+initSize)[0];
	} //else: old Effect List format, inside components just start
	var content = convertComponents(blob.subarray(contOffset, contOffset+contSize));
	comp['components'] = content;
	return comp;
}

// generic field decoding function that, until now, all components use.
function decode_generic (blob, offset, fields, name, end) {
	var comp = {
		'type': removeSpaces(name)
	};
	var keys = Object.keys(fields);
	var lastWasABitField = false;
	for(var i=0; i<keys.length; i++) {
		if(offset >= end) {
			break;
		}
		var k = keys[i];
		var f = fields[k];
		if(k.match(/^null[_0-9]*$/)) {
			offset += f;
			// [null, 0] resets bitfield continuity to allow several consecutive bitfields
			lastWasABitField = false;
			continue;
		}
		var size = 0;
		var value, result;
		var number = typeof f === "number";
		var other = typeof f === "string";
		var array = f instanceof Array;
		if(number) {
			switch(f) {
				case 1:
					size = 1;
					value = blob[offset];
					break;
				case sizeInt:
					size = sizeInt;
					value = getUInt32(blob, offset);
					break;
				default:
					throw new ConvertException("Invalid field size: "+f+".");
			}
			lastWasABitField = false;
		} else if(other) {
			try {
				result = window["get"+f](blob, offset);
			} catch (e) {
				if (e.message.search(/has no method '[^']*'/)) {
					throw new ConvertException("Method '"+f+"' was not found. (correct capitalization?)");
				}
			}
			value = result[0];
			size = result[1];
			lastWasABitField = false;
		} else if(f && f.length>=2) {
			if(f[0]==="Bit") {
				if(lastWasABitField) {
					offset -= 1; // compensate to stay in same bitfield
				}
				lastWasABitField = true;
			} else {
				lastWasABitField = false;
			}
			try {
				result = window["get"+f[0]](blob, offset, f[1]);
				value = result[0];
				if(f[2]) { // further processing if wanted
					value = window["get"+f[2]](value);
				}
			} catch (e) {
				if (e.message.search(/has no method '[^']*'/)) {
					throw new ConvertException("Method '"+f+"' was not found. (correct capitalization?)");
				}
			}
			size = result[1];
		}
		
		// save value or function result of value in field
		comp[k] = value;
		offset += size;
	};
	return comp;
}

function decode_colorMap (blob, offset) {
	return {
		'type': 'ColorMap',
	};
}

/**
 * blank decode function

function decode_ (blob, offset) {
	return {
		'type': '',
	};
}

*/

//// decode helpers

// generic mapping function (in 1 and 4 byte flavor) to map a value to one of a set of strings
function getMapByte (blob, offset, map) { return [getMapping(blob, offset, map, blob[offset]), 1]; }
function getMapInt (blob, offset, map) { return [getMapping(blob, offset, map, getUInt32(blob, offset)), sizeInt]; }
function getMapping (blob, offset, map, key) {
	var value = map[key];
	if (value === undefined) {
		throw new ConvertException("Map: A value for key '"+key+"' does not exist.");
	} else {
		return value;
	}
}

// Pixel, Frame, Beat, Init code fields - reorder to I,F,B,P order.
function getCodePFBI (blob, offset) {
	var map = [ // this is the sort map, lines are 'need'-sorted with 'is'-index.
		["init", 3],
		["perFrame", 1],
		["onBeat", 2],
		["perPoint", 0],
	];
	return getCodeSection (blob, offset, map);
}

// Frame, Beat, Init code fields - reorder to I,F,B order.
function getCodeFBI (blob, offset) {
	var map = [
		["init", 2]
		["onBeat", 0],
		["perFrame", 1],
	];
	return getCodeSection (blob, offset, map);
}

function getCodeIFBP (blob, offset) {
	var map = [ // in this case the mapping is pretty redundant. the fields are already in order.
		["init", 0],
		["perFrame", 1],
		["onBeat", 2],
		["perPoint", 3],
	];
	return getCodeSection (blob, offset, map);
}

function getCodeSection (blob, offset, map) {
	var strings = new Array(map.length);
	var totalSize = 0;
	for (var i = 0, p = offset; i < map.length; i++, p += strAndSize[1]) {
		var strAndSize = getSizeString(blob, p);
		totalSize += strAndSize[1];
		strings[i] = strAndSize[0];
	};
	var code = {};
	for (var i = 0; i < strings.length; i++) {
		code[map[i][0]] = strings[map[i][1]];
	};
	return [code, totalSize];
}

function getColorList (blob, offset) {
	var colors = [];
	var num = getUInt32(blob, offset);
	var size = sizeInt+num*sizeInt;
	while(num>0) {
		offset += sizeInt;
		colors.push(getColor(blob, offset)[0]);
		num--;
	}
	return [colors, size];
}

function getColorMap (blob, offset){
	var num = getUInt32(blob, offset);
	var size = num;
	var colorMap = [];
	offset += sizeInt;
	for (var i = 0; i < num; i++) {
		var pos = getUInt32(blob, offset);
		var color = getColor(blob, offset+sizeInt);
		offset += sizeInt*2 + sizeInt; // there's 4bytes of random foo following each entry...
		colorMap[i] = {"color": color, "position": pos};
	};
	return colorMap;
}

function getColor (blob, offset) {
	// Colors in AVS are saved as (A)RGB (where A is always 0).
	// Maybe one should use an alpha channel right away and set
	// that to 0xff? For now, no 4th byte means full alpha.
	var color = getUInt32(blob, offset).toString(16);
	var padding = "";
	for (var i = color.length; i < 6; i++) {
		padding += "0";
	};
	return ["#"+padding+color, sizeInt];
}

function getConvoFilter (blob, offset, dimensions) {
	if(!(dimensions instanceof Array) && dimensions.length!==2) {
		throw new ConvertException("ConvoFilter: Size must be array with x and y dimensions in dwords.");
	}
	var size = dimensions[0]*dimensions[1];
	var data = new Array(size);
	for (var i = 0; i < size; i++, offset+=sizeInt) {
		data[i] = getInt32(blob, offset);
	};
	var matrix = {"width": dimensions[0], "height": dimensions[1], "data": data};
	return [matrix, size*sizeInt];
}

function getBlendmodeIn (blob, offset, size) {
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [blendmodesIn[code], size];
}

function getBlendmodeOut (blob, offset, size) {
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [blendmodesOut[code], size];
}

function getBlendmodeBuffer (blob, offset, size) {
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [blendmodesBuffer[code], size];
}

function getBlendmodeRender (blob, offset, size) {
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [blendmodesRender[code], size];
}

// Buffer modes
function getBufferMode (blob, offset, size) {
	var code = size===1?blob[offset]:getUInt32(blob, offset);
	return [buffermodes[code], size];
}

function getBufferNum (blob, offset, size) {
	var code = size===1 ? blob[offset] : getUInt32(blob, offset);
	if(code===0) return ["Current", size];
	else return [getUInt32(blob, offset), size];
}

function getCoordinates (blob, offset, size) {
	var code = size===1 ? blob[offset] : getUInt32(blob, offset);
	return [coordinates[code], size];
}

function getDrawMode (blob, offset, size) {
	var code = size===1 ? blob[offset] : getUInt32(blob, offset);
	return drawModes[code];
}

function getAudioChannel (code) {
	return audioChannels[code];
}

function getAudioRepresent (code) {
	return audioRepresentations[code];
}
