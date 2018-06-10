// Constants
const sizeInt = 4;

const builtin: ComponentDefinition[] = [
    {
        'name': 'Effect List', // builtin and r_list.cpp for extended Effect Lists
        'code': 0xfffffffe,
        'group': '',
        'func': 'effectList'
    },
    {
        'name': 'Simple', // r_simple.cpp
        'code': 0x00,
        'group': 'Render',
        'func': 'simple'
    }, // ironically, this save format is too complicated for the generic decoder.
    {
        'name': 'Dot Plane', // r_dotpln.cpp
        'code': 0x01,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'rotationSpeed': 'Int32', // -50 to 50
            'colorTop': 'Color',
            'colorHigh': 'Color',
            'colorMid': 'Color',
            'colorLow': 'Color',
            'colorBottom': 'Color',
            'angle': 'Int32',
            null0: sizeInt, // [see comment on dot fountan]
        }
    },
    {
        'name': 'Oscilliscope Star', // r_oscstar.cpp
        'code': 0x02,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'audioChannel': ['Bit', [2, 3], 'AudioChannel'],
            'positionX': ['Bit', [4, 5], 'PositionX'],
            null0: sizeInt - 1,
            'colors': 'ColorList',
            'size': sizeInt,
            'rotation': sizeInt,
        }
    },
    {
        'name': 'FadeOut', // r_fadeout.cpp
        'code': 0x03,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'speed': sizeInt,  // 0-92, channelwise integer steps per frame towards target color
            'color': 'Color',
        }
    },
    {
        'name': 'Blitter Feedback', // r_blit.cpp
        'code': 0x04,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'zoom': sizeInt, // [position]: [factor] -> 0x00: 2, 0x20: 1, 0xA0: 0.5, 0x100: ~1/3
            'onBeatZoom': sizeInt,
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
            'onBeat': ['Bool', sizeInt],
            'bilinear': ['Bool', sizeInt],
        }
    },
    {
        'name': 'OnBeat Clear', // r_nfclr.cpp
        'code': 0x05,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'color': 'Color',
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
            'clearBeats': sizeInt,
        }
    },
    {
        'name': 'Blur', // r_blur.cpp
        'code': 0x06,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'blur': ['Map4', { 0: 'NONE', 1: 'MEDIUM', 2: 'LIGHT', 3: 'HEAVY' }],
            'round': ['Map4', { 0: 'DOWN', 1: 'UP' }],
        }
    },
    {
        'name': 'Bass Spin', // r_bspin.cpp
        'code': 0x07,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabledLeft': ['Bit', 0, 'Boolified'],
            'enabledRight': ['Bit', 1, 'Boolified'],
            null0: sizeInt - 1, // fill up bitfield
            'colorLeft': 'Color',
            'colorRight': 'Color',
            'mode': ['Map4', { 0: 'LINES', 1: 'TRIANGLES' }],
        }
    },
    {
        'name': 'Moving Particle', // r_parts.cpp
        'code': 0x08,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bit', 0, 'Boolified'],
            'onBeatSizeChange': ['Bit', 1, 'Boolified'],
            null0: sizeInt - 1, // fill up bitfield
            'color': 'Color',
            'distance': sizeInt, // 1-32: min(h/2,w*(3/8))*distance/32.0
            'particleSize': sizeInt, // 1-128
            'onBeatParticleSize': sizeInt, // 1-128
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }],
        }
    },
    {
        'name': 'Roto Blitter',
        'code': 0x09,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'zoom': sizeInt,
            'rotate': sizeInt,
            'blendMode': ['Map4', { '0': 'REPLACE', '1': 'FIFTY_FIFTY' }],
            'onBeatReverse': ['Bool', sizeInt],
            'reversalSpeed': sizeInt, // inverted - 0: fastest, 8: slowest
            'onBeatZoom': sizeInt,
            'onBeat': ['Bool', sizeInt],
            'bilinear': ['Bool', sizeInt],
        }
    },
    {
        'name': 'SVP', // r_svp.cpp
        'code': 0x0A,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'library': ['SizeString', 260],
        }
    },
    {
        'name': 'Colorfade', // r_colorfade.cpp
        'code': 0x0B,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bit', 0, 'Boolified'],
            'onBeat': ['Bit', 2, 'Boolified'], // i changed the order a bit here
            'onBeatRandom': ['Bit', 1, 'Boolified'],
            null0: sizeInt - 1, // fill up bitfield
            'fader1': 'Int32', // all faders go from -32 to 32
            'fader2': 'Int32',
            'fader3': 'Int32',
            'beatFader1': 'Int32',
            'beatFader2': 'Int32',
            'beatFader3': 'Int32',
        }
    },
    {
        'name': 'Color Clip', // r_contrast.cpp
        'code': 0x0C,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'mode': ['Map4', { 0: 'OFF', 1: 'BELOW', 2: 'ABOVE', 3: 'NEAR' }],
            'color': 'Color',
            'outColor': 'Color',
            'level': sizeInt,  // 0-64: (d_r^2 + d_g^2 + d_b^2) <= (level*2)^2
        }
    },
    {
        'name': 'Rotating Stars', // r_rotstar.cpp
        'code': 0x0D,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'colors': 'ColorList',
        }
    },
    {
        'name': 'Ring', // r_oscring.cpp
        'code': 0x0E,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'audioChannel': ['Bit', [2, 3], 'AudioChannel'],
            'positionX': ['Bit', [4, 5], 'PositionX'],
            null0: sizeInt - 1,
            'colors': 'ColorList',
            'size': sizeInt,
            'audioSource': ['UInt32', sizeInt, 'AudioSource'],
        }
    },
    {
        'name': 'Movement', // r_trans.cpp
        'code': 0x0F,
        'group': 'Trans',
        'func': 'movement'
    },
    {
        'name': 'Scatter', // r_scat.cpp
        'code': 0x10,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Dot Grid', // r_dotgrid.cpp
        'code': 0x11,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'colors': 'ColorList',
            'spacing': sizeInt,
            'speedX': 'Int32', // -512 to 544
            'speedY': 'Int32',
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'Additive', 2: 'FIFTY_FIFTY', 3: 'DEFAULT' }],
        }
    },
    {
        'name': 'Buffer Save', // r_stack.cpp
        'code': 0x12,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'action': ['BufferMode', sizeInt],
            'bufferId': ['BufferNum', sizeInt],
            'blendMode': ['BlendmodeBuffer', sizeInt],
            'adjustBlend': sizeInt,
        }
    },
    {
        'name': 'Dot Fountain', // r_dotfnt.cpp
        'code': 0x13,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'rotationSpeed': 'Int32', // -50 to 50
            'colorTop': 'Color',
            'colorHigh': 'Color',
            'colorMid': 'Color',
            'colorLow': 'Color',
            'colorBottom': 'Color',
            'angle': 'Int32',
            null0: sizeInt, // most likely current rotation, has some huge value, has no ui, is basically arbitrary depending on time of save, not converted
        }
    },
    {
        'name': 'Water', // r_water.cpp
        'code': 0x14,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Comment', // r_comment.cpp
        'code': 0x15,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'text': 'SizeString'
        }
    },
    {
        'name': 'Brightness', // r_bright.cpp
        'code': 0x16,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'red': 'Int32', // \
            'green': 'Int32', //  > -4096 to 4096
            'blue': 'Int32', // /
            'separate': ['Bool', sizeInt],
            'excludeColor': 'Color',
            'exclude': ['Bool', sizeInt],
            'distance': sizeInt, // 0 to 255
        }
    },
    {
        'name': 'Interleave', // r_interleave.cpp
        'code': 0x17,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'x': sizeInt,
            'y': sizeInt,
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onbeat': ['Bool', sizeInt],
            'x2': sizeInt,
            'y2': sizeInt,
            'beatDuration': sizeInt,
        }
    },
    {
        'name': 'Grain', // r_grain.cpp
        'code': 0x18,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'amount': sizeInt, // 0-100
            'static': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Clear Screen', // r_clear.cpp
        'code': 0x19,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }],
            'onlyFirst': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Mirror', // r_mirror.cpp
        'code': 0x1A,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'topToBottom': ['Bit', 0, 'Boolified'],
            'bottomToTop': ['Bit', 1, 'Boolified'],
            'leftToRight': ['Bit', 2, 'Boolified'],
            'rightToLeft': ['Bit', 3, 'Boolified'],
            null0: sizeInt - 1, // fill up bitfield space
            'onBeatRandom': ['Bool', sizeInt],
            'smoothTransition': ['Bool', sizeInt],
            'transitionDuration': sizeInt,
        }
    },
    {
        'name': 'Starfield', // r_stars.cpp
        'code': 0x1B,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': sizeInt,
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'WarpSpeed': 'Float',
            'MaxStars_set': sizeInt,
            'onbeat': sizeInt,
            'spdBeat': 'Float',
            'durFrames': sizeInt,
        }
    },
    {
        'name': 'Text', // r_text.cpp
        'code': 0x1C,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onBeat': ['Bool', sizeInt],
            'insertBlanks': ['Bool', sizeInt],
            'randomPosition': ['Bool', sizeInt],
            'verticalAlign': ['Map4', { '0': 'TOP', '4': 'CENTER', '8': 'BOTTOM', }],
            'horizontalAlign': ['Map4', { '0': 'LEFT', '1': 'CENTER', '2': 'RIGHT', }],
            'onBeatSpeed': sizeInt,
            'normSpeed': sizeInt,
            null0: 60, // Win CHOOSEFONT structure, little relevance afaics
            // Win LOGFONT structure, 60bytes, this is more interesting:
            null1: sizeInt * 4, // LONG  lfHeight;
            // LONG  lfWidth;
            // LONG  lfEscapement;
            // LONG  lfOrientation;
            // LONG  lfWeight;
            'weight': ['Map4', { '0': 'DONTCARE', '100': 'THIN', '200': 'EXTRALIGHT', '300': 'LIGHT', '400': 'REGULAR', '500': 'MEDIUM', '600': 'SEMIBOLD', '700': 'BOLD', '800': 'EXTRABOLD', '900': 'BLACK' }],
            'italic': ['Bool', 1], // BYTE  lfItalic;
            'underline': ['Bool', 1], // BYTE  lfUnderline;
            'strikeOut': ['Bool', 1], // BYTE  lfStrikeOut;
            'charSet': 1, // too lazy, FIXME: 'charSet': ['Map4', {'0': 'Western', /*...*/}], // BYTE  lfCharSet;
            null2: 4, // BYTE  lfOutPrecision;
            // BYTE  lfClipPrecision;
            // BYTE  lfQuality;
            // BYTE  lfPitchAndFamily;
            'fontName': ['SizeString', 32], // TCHAR lfFaceName[LF_FACESIZE];
            'text': ['SizeString', 0 /*==var length*/ , 'SemiColSplit'],
            'outline': ['Bool', sizeInt],
            'outlineColor': 'Color',
            'shiftX': sizeInt,
            'shiftY': sizeInt,
            'outlineShadowSize': sizeInt,
            'randomWord': ['Bool', sizeInt],
            'shadow': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Bump', // r_bump.cpp
        'code': 0x1D,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'onBeat': ['Bool', sizeInt],
            'duration': sizeInt, // 0-100
            'depth': sizeInt, // 0-100
            'onBeatDepth': sizeInt, // 0-100
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'code': 'CodeFBI',
            'showDot': ['Bool', sizeInt],
            'invertDepth': ['Bool', sizeInt],
            null0: sizeInt,
            'depthBuffer': ['BufferNum', sizeInt]
        }
    },
    {
        'name': 'Mosaic', // r_mosaic.cpp
        'code': 0x1E,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'squareSize': sizeInt,
            'onBeatSquareSize': sizeInt,
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onBeatSizeChange': ['Bool', sizeInt],
            'onBeatSizeDuration': sizeInt,
        }
    },
    {
        'name': 'Water Bump', // r_waterbump.cpp
        'code': 0x1F,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'density': sizeInt,
            'depth': sizeInt,
            'random': ['Bool', sizeInt],
            'dropPositionX': sizeInt,
            'dropPositionY': sizeInt,
            'dropRadius': sizeInt,
            'method': sizeInt,
        }
    },
    {
        'name': 'AVI', // r_avi.cpp
        'code': 0x20,
        'group': 'Trans',
        'func': 'avi'
    },
    {
        'name': 'Custom BPM', // r_bpm.cpp
        'code': 0x21,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'mode': ['RadioButton', { 0: 'ARBITRARY', 1: 'SKIP', 2: 'REVERSE' }],
            'arbitraryValue': sizeInt,
            'skipValue': sizeInt,
            'skipFirstBeats': sizeInt, // setting this to n>0 also prevents arbitrary mode from running on load of preset until n beats have passed.
        }
    },
    {
        'name': 'Picture', // r_picture.cpp
        'code': 0x22,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'adapt': sizeInt,
            'onBeatPersist': sizeInt, // 0 to 32
            'file': 'NtString',
            'ratio': sizeInt,
            'aspectRatioAxis': ['Map4', { 0: 'X', 1: 'Y' }],
        }
    },
    {
        'name': 'Dynamic Distance Modifier', // r_ddm.cpp
        'code': 0x23,
        'group': 'Trans',
        'func': 'versioned_generic',
        'fields': {
            'new_version': ['Bool', 1],
            'code': 'CodePFBI',
            'blendMode': ['Map4', { 0: 'REPLACE', 1: 'FIFTY_FIFTY' }],
            'bilinear': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Super Scope', // r_sscope.cpp
        'code': 0x24,
        'group': 'Render',
        'func': 'versioned_generic',
        'fields': {
            'new_version': ['Bool', 1],
            'code': 'CodePFBI',
            'audioChannel': ['Bit', [0, 1], 'AudioChannel'],
            'audioSource': ['Bit', 2, 'AudioSource'],
            null0: 3, // padding, bitfield before is actually 32 bit
            'colors': 'ColorList',
            'drawMode': ['DrawMode', sizeInt],
        }
    },
    {
        'name': 'Invert', // r_invert.cpp
        'code': 0x25,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Unique Tone', // r_onetone.cpp
        'code': 0x26,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'invert': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Timescope', // r_timescope.cpp
        'code': 0x27,
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY', 2: 'DEFAULT' }],
            'audioChannel': ['UInt32', sizeInt, 'AudioChannel'],
            'bands': sizeInt,
        }
    },
    {
        'name': 'Set Render Mode', // r_linemode.cpp
        'code': 0x28,
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'blend': ['BlendmodeRender', 1],
            'adjustBlend': 1,
            'lineSize': 1,
            'enabled': ['Bit', 7, 'Boolified'],
        }
    },
    {
        'name': 'Interferences', // r_interf.cpp
        'code': 0x29,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'numberOfLayers': sizeInt,
            null0: sizeInt, // current rotation, is virtually arbitrary - not converted
            'distance': sizeInt, // 1 to 64
            'alpha': sizeInt, // 1 to 255
            'rotation': 'Int32', // 32 to -32 (ui has inverted range)
            'blendMode': ['Map8', { 0: 'REPLACE', 1: 'ADDITIVE', 0x100000000: 'FIFTY_FIFTY' }],
            'onBeatDistance': sizeInt,
            'onBeatAlpha': sizeInt,
            'onBeatRotation': sizeInt,
            'separateRGB': ['Bool', sizeInt],
            'onBeat': ['Bool', sizeInt],
            'speed': 'Float', // 0.01 to 1.28
        }
    },
    {
        'name': 'Dynamic Shift', // r_shift.cpp
        'code': 0x2A,
        'group': 'Trans',
        'func': 'versioned_generic',
        'fields': {
            'new_version': ['Bool', 1],
            'code': 'CodeIFB',
            'blendMode': ['Map4', { 0: 'Replace', 1: 'FIFTY_FIFTY' }],
            'bilinear': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Dynamic Movement', // r_dmove.cpp
        'code': 0x2B,
        'group': 'Trans',
        'func': 'versioned_generic',
        'fields': {
            'new_version': ['Bool', 1],
            'code': 'CodePFBI',
            'bFilter': ['Bool', sizeInt],
            'coord': ['Coordinates', sizeInt],
            'gridW': sizeInt,
            'gridH': sizeInt,
            'blend': ['Bool', sizeInt],
            'wrap': ['Bool', sizeInt],
            'buffer': ['BufferNum', sizeInt],
            'alphaOnly': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Fast Brightness', // r_fastbright.cpp
        'code': 0x2C,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'factor': ['Map4', { 0: 2, 1: 0.5, 2: 1 }],
        }
    },
    {
        'name': 'Color Modifier', // r_dcolormod.cpp
        'code': 0x2D,
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'recomputeEveryFrame': ['Bool', 1],
            'code': 'CodePFBI',
        }
    },
];


//// APEs
const dll: ComponentDefinition[] = [
    {
        'name': 'AVS Trans Automation',
        'code': // Misc: AVSTrans Automation.......
            [0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x41, 0x56, 0x53, 0x54, 0x72, 0x61, 0x6E, 0x73, 0x20, 0x41, 0x75, 0x74, 0x6F, 0x6D, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'logging': ['Bool', sizeInt],
            'translateFirstLevel': ['Bool', sizeInt],
            'readCommentCodes': ['Bool', sizeInt],
            'code': 'NtString',
        }
    },
    {
        'name': 'Texer',
        'code': // Texer...........................
            [0x54, 0x65, 0x78, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            null0: sizeInt * 4,
            'image': ['SizeString', 260],
            'input': ['Bit', 0, 'BlendmodeIn'],
            'blendMode': ['Bit', 2, 'BlendmodeTexer'],
            null1: 3, // fill up bitfield
            'particles': sizeInt,
            null2: 4
        }
    },
    {
        'name': 'Texer II',
        'code': // Acko.net: Texer II..............
            [0x41, 0x63, 0x6B, 0x6F, 0x2E, 0x6E, 0x65, 0x74, 0x3A, 0x20, 0x54, 0x65, 0x78, 0x65, 0x72, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Render',
        'func': 'generic',
        'fields': {
            null0: sizeInt,
            'imageSrc': ['SizeString', 260],
            'resizing': ['Bool', sizeInt],
            'wrapAround': ['Bool', sizeInt],
            'colorFiltering': ['Bool', sizeInt],
            null1: sizeInt,
            'code': 'CodeIFBP',
        }
    },
    {
        'name': 'Color Map',
        'code': // Color Map.......................
            [0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x4D, 0x61, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'key': ['ColorMapKey', sizeInt],
            'blendMode': ['BlendmodeColorMap', sizeInt],
            'mapCycleMode': ['ColorMapCycleMode', sizeInt],
            'adjustBlend': 1,
            null0: 1,
            'dontSkipFastBeats': ['Bool', 1],
            'cycleSpeed': 1, // 1 to 64
            'maps': 'ColorMaps',
        }
    },
    {
        'name': 'Framerate Limiter',
        'code': // VFX FRAMERATE LIMITER...........
            [0x56, 0x46, 0x58, 0x20, 0x46, 0x52, 0x41, 0x4D, 0x45, 0x52, 0x41, 0x54, 0x45, 0x20, 0x4C, 0x49, 0x4D, 0x49, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'limit': sizeInt
        }
    },
    {
        'name': 'Convolution Filter',
        'code': // Holden03: Convolution Filter....
            [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x33, 0x3A, 0x20, 0x43, 0x6F, 0x6E, 0x76, 0x6F, 0x6C, 0x75, 0x74, 0x69, 0x6F, 0x6E, 0x20, 0x46, 0x69, 0x6C, 0x74, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'edgeMode': ['UInt32', sizeInt, 'convolutionEdgeMode'], // note that edgeMode==WRAP and absolute are mutually exclusive.
            'absolute': ['Bool', sizeInt], // they can however both be false/zero
            'twoPass': ['Bool', sizeInt],
            'kernel': ['ConvoFilter', [7, 7]],
            'bias': 'Int32',
            'scale': 'Int32',
        }
    },
    {
        'name': 'Triangle',
        'code': // Render: Triangle................
            [0x52, 0x65, 0x6E, 0x64, 0x65, 0x72, 0x3A, 0x20, 0x54, 0x72, 0x69, 0x61, 0x6E, 0x67, 0x6C, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'code': 'NtCodeIFBP',
        }
    },
    {
        'name': 'Channel Shift', // AVS's (Unconed's) channel shift is buggy in that RGB cannot be selected. but you can turn on 'onBeatRandom' and save in a lucky moment.
        'code': // Channel Shift...................
            [0x43, 0x68, 0x61, 0x6E, 0x6E, 0x65, 0x6C, 0x20, 0x53, 0x68, 0x69, 0x66, 0x74, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            // some keys seeem to have changed between versions.
            'mode': ['Map4', { 0: 'RGB', 1023: 'RGB', 1144: 'RGB', 1020: 'RBG', 1019: 'BRG', 1021: 'BGR', 1018: 'GBR', 1022: 'GRB', 1183: 'RGB'/*1183 (probably from an old APE version?) presents as if nothing is selected, so set to RGB*/ }],
            'onBeatRandom': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Normalize',
        'code': // Trans: Normalise................
            [0x54, 0x72, 0x61, 0x6E, 0x73, 0x3A, 0x20, 0x4E, 0x6F, 0x72, 0x6D, 0x61, 0x6C, 0x69, 0x73, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Video Delay',
        'code': // Holden04: Video Delay...........
            [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x34, 0x3A, 0x20, 0x56, 0x69, 0x64, 0x65, 0x6F, 0x20, 0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'useBeats': ['Bool', sizeInt],
            'delay': sizeInt,
        }
    },
    {
        'name': 'Multiplier', // r_multiplier.cpp
        'code': // Multiplier......................
            [0x4D, 0x75, 0x6C, 0x74, 0x69, 0x70, 0x6C, 0x69, 0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'multiply': ['Map4', { 0: 'INFINITE_ROOT', 1: 8, 2: 4, 3: 2, 4: 0.5, 5: 0.25, 6: 0.125, 7: 'INFINITE_SQUARE' }],
        }
    },
    {
        'name': 'Color Reduction', // r_colorreduction.cpp
        'code': // Color Reduction.................
            [0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x52, 0x65, 0x64, 0x75, 0x63, 0x74, 0x69, 0x6F, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            null0: 260, // MAX_PATH - space for a file path, unused
            'colors': ['Map4', { 1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128, 8: 256 }],
        }
    },
    {
        'name': 'Multi Delay', // r_multidelay.cpp
        'code': // Holden05: Multi Delay...........
            [0x48, 0x6F, 0x6C, 0x64, 0x65, 0x6E, 0x30, 0x35, 0x3A, 0x20, 0x4D, 0x75, 0x6C, 0x74, 0x69, 0x20, 0x44, 0x65, 0x6C, 0x61, 0x79, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Trans',
        'func': 'generic',
        'fields': {
            'mode': ['Map4', { 0: 'DISABLED', 1: 'INPUT', 2: 'OUTPUT' }],
            'activeBuffer': sizeInt,
            'useBeats0': ['Bool', sizeInt],
            'delay0': sizeInt,
            'useBeats1': ['Bool', sizeInt],
            'delay1': sizeInt,
            'useBeats2': ['Bool', sizeInt],
            'delay2': sizeInt,
            'useBeats3': ['Bool', sizeInt],
            'delay3': sizeInt,
            'useBeats4': ['Bool', sizeInt],
            'delay4': sizeInt,
            'useBeats5': ['Bool', sizeInt],
            'delay5': sizeInt,
        }
    },
    {
        'name': 'Buffer Blend',
        'code': // Misc: Buffer blend..............
            [0x4D, 0x69, 0x73, 0x63, 0x3A, 0x20, 0x42, 0x75, 0x66, 0x66, 0x65, 0x72, 0x20, 0x62, 0x6C, 0x65, 0x6E, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'bufferB': ['BufferBlendBuffer', sizeInt],
            'bufferA': ['BufferBlendBuffer', sizeInt],
            'mode': ['BufferBlendMode', sizeInt],
        }
    },
    {
        'name': 'MIDI Trace',
        'code': // Nullsoft Pixelcorps: MIDItrace .
            [0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74, 0x20, 0x50, 0x69, 0x78, 0x65, 0x6C, 0x63, 0x6F, 0x72, 0x70, 0x73, 0x3A, 0x20, 0x4D, 0x49, 0x44, 0x49, 0x74, 0x72, 0x61, 0x63, 0x65, 0x20, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'channel': sizeInt,
            'mode': ['Map4', { 1: 'CURRENT', 2: 'TRIGGER' }],
            'allChannels': ['Bool', sizeInt],
            'printEvents': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Add Borders',
        'code': // Virtual Effect: Addborders......
            [0x56, 0x69, 0x72, 0x74, 0x75, 0x61, 0x6C, 0x20, 0x45, 0x66, 0x66, 0x65, 0x63, 0x74, 0x3A, 0x20, 0x41, 0x64, 0x64, 0x62, 0x6F, 0x72, 0x64, 0x65, 0x72, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'color': 'Color',
            'size': sizeInt,
        }
    },
    {
        'name': 'AVI Player', // Goebish avi player - incomplete! Many many options, supposedly very unstable APE (i.e. no one used this) - until now to lazy to implement
        'code': // VFX AVI PLAYER..................
            [0x56, 0x46, 0x58, 0x20, 0x41, 0x56, 0x49, 0x20, 0x50, 0x4C, 0x41, 0x59, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'filePath': ['SizeString', 256],
            'enabled': ['Bool', sizeInt],
            // more...
        }
    },
    {
        'name': 'FyrewurX',
        'code': // FunkyFX FyrewurX v1.............
            [0x46, 0x75, 0x6E, 0x6B, 0x79, 0x46, 0x58, 0x20, 0x46, 0x79, 0x72, 0x65, 0x77, 0x75, 0x72, 0x58, 0x20, 0x76, 0x31, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
        }
    },
    {
        'name': 'Global Variables',
        'code': // Jheriko: Global.................
            [0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x3A, 0x20, 0x47, 0x6C, 0x6F, 0x62, 0x61, 0x6C, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'load': ['Map4', { 0: 'NONE', 1: 'ONCE', 2: 'CODE_CONTROL', 3: 'EVERY_FRAME' }],
            null0: sizeInt * 6,
            'code': 'NtCodeIFB',
            'file': 'NtString',
            'saveRegRange': 'NtString',
            'saveBufRange': 'NtString',
        }
    },
    {
        'name': 'Fluid',
        'code': // GeissFluid......................
            [0x47, 0x65, 0x69, 0x73, 0x73, 0x46, 0x6C, 0x75, 0x69, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            null0: sizeInt, // Fluid saves its parameter globally somewhere, not in the preset file - great... :/
        }
    },
    {
        'name': 'Picture II',
        'code': // Picture II......................
            [0x50, 0x69, 0x63, 0x74, 0x75, 0x72, 0x65, 0x20, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'image': ['NtString', 260],
            'blendMode': ['BlendmodePicture2', sizeInt],
            'onBeatOutput': ['BlendmodePicture2', sizeInt],
            'bilinear': ['Bool', sizeInt],
            'onBeatBilinear': ['Bool', sizeInt],
            'adjustBlend': sizeInt, // 0 to 255
            'onBeatAdjustBlend': sizeInt, // 0 to 255
        }
    },
    {
        'name': 'MultiFilter',
        'code': // Jheriko : MULTIFILTER...........
            [0x4A, 0x68, 0x65, 0x72, 0x69, 0x6B, 0x6F, 0x20, 0x3A, 0x20, 0x4D, 0x55, 0x4C, 0x54, 0x49, 0x46, 0x49, 0x4C, 0x54, 0x45, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Misc',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', sizeInt],
            'effect': ['MultiFilterEffect', sizeInt],
            'onBeat': ['Bool', sizeInt],
            null0: ['Bool', sizeInt]
        }
    },
    {
        'name': 'Particle System',
        'code': // ParticleSystem..................
            [0x50, 0x61, 0x72, 0x74, 0x69, 0x63, 0x6C, 0x65, 0x53, 0x79, 0x73, 0x74, 0x65, 0x6D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        'group': 'Render',
        'func': 'generic',
        'fields': {
            'enabled': ['Bool', 1],
            'bigParticles': ['Bool', 1],
            null0: 2,
            'particles': sizeInt,
            'particles+/-': sizeInt,
            'lifetime': sizeInt,
            'lifetime+/-': sizeInt,
            null1: 32,
            'spread': 'Float', // 0 to 1
            'initialSpeed': 'Float',
            'initialSpeed+/-': 'Float',
            'acceleration': 'Float',
            'accelerationType': ['ParticleSystemAccelerationType', sizeInt],
            'color': 'Color',
            'color+/-': 'Color',
            'colorChange3': 1,
            'colorChange2': 1,
            'colorChange1': 1,
            null2: 1,
            'colorChange+/-3': 1,
            'colorChange+/-2': 1,
            'colorChange+/-1': 1,
            null3: 1,
            'colorBounce': ['ParticleSystemColorBounce', sizeInt]
        }
    }
    /*
    {
        'name': '',
        'code': //
            [],
        'group': '',
        'func': 'generic',
        'fields': {

        }
    },
    */
];

export { builtin, dll };
