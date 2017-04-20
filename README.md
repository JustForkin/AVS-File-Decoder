# AVS File Decoder [![Build Status](https://secure.travis-ci.org/grandchild/AVS-File-Decoder.png)](http://travis-ci.org/grandchild/AVS-File-Decoder)

## Description

This little Javascript reads out the file format of Nullsoft's _Advanced Visualization Studio_ and rewrites it as JSON readable by [Webvs](https://github.com/azeem/webvs).

[Live Demo](http://grandchild.github.io/AVS-File-Decoder/)

## Installation

### GitHub

Clone the repository `git clone https://github.com/grandchild/AVS-File-Decoder.git`

### Download

Use the '[zip download](https://github.com/grandchild/AVS-File-Decoder/archive/master.zip)' option and extract its content

### Prerequisites

Make sure you already have [Node](https://nodejs.org) installed and in you [PATH environmental variable](https://superuser.com/questions/284342/what-are-path-and-other-environment-variables-and-how-can-i-set-or-use-them/284351#284351). [Yarn](https://yarnpkg.com/) is recommended, but entirely optional.

Next, install dependencies:

```sh
$ cd AVS-File-Decoder
$ yarn || npm install
```

### CLI

Once setup, you can run `node bin/cli` to list available options.

```sh
$ node bin/cli

  Usage: cli [options] <file(s)>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -d, --debug    Prints in-depth information
    -m, --minify   Minify generated JSON
    -s, --silent   Prints errors only
```

Commonly, you would run `node bin/cli "avs/**/.avs"` to convert a bunch of presets, or just one.

### Building

**Note:** The following does not apply to this branch!

We're using [gulp](http://gulpjs.com) to uglify JavaScript and to minify CSS.

1. Install dependencies using `npm install` (first time only)
2. Run the gulp watch task using `gulp watch`
3. Edit the source-files

Whenever changes are made to the source-files `app/*`, the files in the `dist/` directory will be generated. Alternatively, you can uglify the JavaScript using `gulp js` or minify the CSS files using `gulp css`.

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
- `Multi Filter`
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
- `Texer`
- `Texer II`
- `Text`
- `Timescope`
- `Triangle`


## Authors

* [grandchild](https://github.com/grandchild)
* [idleberg](https://github.com/idleberg)

## License

All code is licensed under [The MIT License](http://opensource.org/licenses/MIT)
