# AVS File Decoder

## Description

This little Javascript reads out the file format of Nullsoft's _Advanced Visualization Studio_ and rewrites it as JSON readable by [WebVS](https://github.com/azeem/webvs).

[Live Demo](grandchild.github.io/AVS-File-Decoder/)

## Installation

### GitHub

Clone the repository `git clone https://github.com/grandchild/AVS-File-Decoder.git`

### Download

Use the '[zip download](https://github.com/grandchild/AVS-File-Decoder/archive/master.zip)' option and extract its content

### Dependencies

By default, JQuery and Bootstrap are loaded from a CDN. Using [Bower](http://bower.io/), you can install JQuery and Bootstrap locally - an experimental fallback method is already implemented in the application. Bootstrap fallback is not working correctly at this time.

### Building

We're using [Grunt](http://gruntjs.com) to lint HTML, uglify JavaScript and to minify CSS.

1. Install dependencies using `npm install` (first time only)
2. Run the Grunt task using `grunt`
3. Edit the source-files

Whenever changes are made to the source-files (`index.html` or `src/*`), the files in the `build/` directory will be updated. Alternatively, you can uglify the JavaScript using `grunt uglify` or minify the CSS files using `grunt cssmin`.

## Component Checklist:

- `Effect List`

### Misc
- `AVS Trans Automation`
- `Buffer Save`
- `Comment`
- `Custom BPM`
- `Framerate Limiter`
- `Global Variables`
- `MIDI Trace`
- `Set Render Mode`

### Trans
- `Blitter Feedback`
- `Blur`
- `Brightness`
- `Bump`
- `Channel Shift`
- `Color Clip`
- `Color Map`
- `Color Modifier`
- `Color Reduction`
- `Colorfade`
- `Convolution Filter`
- `Dynamic Distance Modifier`
- `Dynamic Movement`
- `Dynamic Shift`
- `FadeOut`
- `Fast Brightness`
- `Grain`
- `Interference`
- `Interleave`
- `Invert`
- `Mirror`
- `Mosaic`
- `Movement`
- `Multi Delay`
- ~~`Multi Filter`~~
- `Multiplier`
- `Normalize`
- `Roto Blitter`
- `Scatter`
- `Unique Tone`
- `Video Delay`
- `Water Bump`
- `Water`

### Render
- `AVI`
- `Bass Spin`
- `Clear Screen`
- `Dot Fountain`
- `Dot Grid`
- `Dot Plane`
- `Fluid`
- `FyrewurX`
- `Moving Particle`
- `OnBeat Clear`
- `Oscilliscope Star`
- `Picture`
- `Picture II`
- `Ring`
- `Rotating Stars`
- `Simple`
- `Starfield`
- `Super Scope`
- `SVP`
- ~~`Texer`~~
- `Texer II`
- `Text`
- `Timescope`
- `Triangle`


## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
