# HSLuv - Human-friendly HSL

[![CI](https://github.com/hsluv/hsluv-javascript/actions/workflows/nodeci.yml/badge.svg)](https://github.com/hsluv/hsluv-javascript/actions/workflows/nodeci.yml)
[![npm](https://img.shields.io/npm/v/hsluv)](https://www.npmjs.com/package/hsluv)

## Installation

Install from NPM package repository:

```bash
npm install hsluv
```

ES modules:

```javascript
import {Hsluv} from "hsluv";
```

CommonJS:

```javascript
const {Hsluv} = require("hsluv");
```

HTML include:

- Download [the latest hsluv.min.js](https://github.com/hsluv/hsluv-javascript/releases)
- Add `<script src="hsluv-x.x.x.min.js"></script>` to your HTML
- Access it via the global `window.Hsluv`

## Usage

The API is designed to avoid heap allocation. The `HSLuv` class defines the following public fields:

- RGB: `hex:String`, `rgb_r:Float` [0;1], `rgb_g:Float` [0;1], `rgb_r:Float` [0;1]
- CIE XYZ: `xyz_x:Float`, `xyz_y:Float`, `xyz_z:Float`
- CIE LUV: `luv_l:Float`, `luv_u:Float`, `luv_v:Float`
- CIE LUV LCh: `lch_l:Float`, `lch_c:Float`, `lch_h:Float`
- HSLuv: `hsluv_h:Float` [0;360], `hsluv_s:Float` [0;100], `hsluv_l:Float` [0;100]
- HPLuv: `hpluv_h:Float` [0;360], `hpluv_p:Float` [0;100], `hpluv_l:Float` [0;100]

To convert between color spaces, simply set the properties of the source color space, run the
conversion methods, then read the properties of the target color space.

Use the following methods to convert to and from RGB:

- HSLuv: `hsluvToRgb()`, `hsluvToHex()`, `rgbToHsluv()`, `hexToHsluv()`
- HPLuv: `hpluvToRgb()`, `hpluvToHex()`, `rgbToHpluv()`, `hexToHpluv()`

Use the following methods to do step-by-step conversion:

- Forward: `hsluvToLch()` (or `hpluvToLch()`), `lchToLuv()`, `luvToXyz()`, `xyzToRgb()`, `rgbToHex()`
- Backward: `hexToRgb()`, `rgbToXyz()`, `xyzToLuv()`, `luvToLch()`, `lchToHsluv()` (or `lchToHpluv()`)

For advanced usage, we also export the [bounding lines](https://www.hsluv.org/math/) in slope-intercept
format, two for each RGB channel representing the limit of the gamut.

- R < 0: `r0s`, `r0i`
- R > 1: `r1s`, `r1i`
- G < 0: `g0s`, `g0i`
- G > 1: `g1s`, `g1i`
- B < 0: `b0s`, `b0i`
- B > 1: `b1s`, `b1i`

Example:

```javascript
var conv = new Hsluv();
conv.hsluv_h = 10;
conv.hsluv_s = 75;
conv.hsluv_l = 65;
conv.hsluvToHex();
console.log(conv.hex); // Will print "#ec7d82"
```

Also available for [Stylus](http://stylus-lang.com/). See [here](https://github.com/hsluv/hsluv-stylus).

## Development

Our [GitHub Actions workflow](https://github.com/hsluv/hsluv-javascript/blob/main/.github/workflows/nodeci.yml)
will build and test every push and PR to the `main` branch. When a `main` branch receives a commit that
updates the project version in `package.json`, the workflow will tag the commit, create a draft release
on GitHub and publish the npm package. Mark your versions with the `-rc` suffix to create pre-releases.

## Changelog

### 1.0.0

- New API to avoid heap allocation.
- Transpiled from [hsluv-haxe](https://github.com/hsluv/hsluv-haxe) and converted manually to TypeScript.
- New GitHub Actions CI for build, test and publishing automation

### 0.1.0

- Provide Typescript definitions in the NPM package.

### 0.0.3

- Expose intermediate functions in the public API.

### 0.0.2

- Improve packaging and minification.

### 0.0.1

- Initial release under the name HSLuv. Old releases can be found [here](https://www.npmjs.com/package/husl).
