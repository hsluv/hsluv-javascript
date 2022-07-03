#!/usr/bin/env sh

set -e

rm -rf dist
mkdir -p dist

# First build ESM version that is used for testing
npx tsc src/hsluv.ts --outDir dist/esm --module es6 --target es6
echo '{"type": "module"}' >dist/esm/package.json

# Test against snapshot before continuing
node test/test.mjs

# Build CommonJS version
npx tsc src/hsluv.ts --outDir dist/cjs --module commonjs --target es6
echo '{"type": "commonjs"}' >dist/cjs/package.json

# Build d.ts file
npx tsc src/hsluv.ts --outDir dist --declaration --emitDeclarationOnly

# Build hsluv.min.js
echo 'import {Hsluv} from "./esm/hsluv.js";window.Hsluv = Hsluv;' >dist/browser-entry.js
npx esbuild dist/browser-entry.js --bundle --minify --outfile=dist/hsluv.min.js

# Build npm package
TARBALL=$(cd dist && npm pack ../)

# Test that both commonjs and esm imports work
rm -rf test/tmp
mkdir test/tmp
echo "{}" >test/tmp/package.json
(cd test/tmp && npm install "../../dist/${TARBALL}")
(cd test/tmp && node --input-type=module -e 'import {Hsluv} from "hsluv"; console.log("ESM OK")')
(cd test/tmp && node --input-type=commonjs -e 'const {Hsluv} = require("hsluv"); console.log("CommonJS OK")')
