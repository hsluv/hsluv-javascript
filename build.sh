#!/usr/bin/env sh

set -e

rm -rf dist assets test/tmp
mkdir -p dist assets test/tmp

# Store package version
PACKAGE_VERSION=$(node -p -e 'require("./package.json").version')
echo "${PACKAGE_VERSION}" >assets/VERSION

# First build ESM version that is used for testing
npx tsc src/hsluv.ts --outDir dist --module es6 --target es6
mv dist/hsluv.js dist/hsluv.mjs

# Test against snapshot before continuing
node test/test.mjs

# Build CommonJS version
npx tsc src/hsluv.ts --outDir dist --module commonjs --target es6
mv dist/hsluv.js dist/hsluv.cjs

# Build d.ts file
npx tsc src/hsluv.ts --outDir dist --declaration --emitDeclarationOnly

# Build hsluv.min.js
echo 'import {Hsluv} from "./hsluv.mjs";window.Hsluv = Hsluv;' >dist/browser-entry.js
npx esbuild dist/browser-entry.js --bundle --minify --outfile="assets/hsluv-${PACKAGE_VERSION}.min.js"

# Sanity check hsluv.min.js window export
echo "const window = {};" >dist/browser-test.js
cat "assets/hsluv-${PACKAGE_VERSION}.min.js" >>dist/browser-test.js
echo "if (window.Hsluv) { console.log('Browser OK') } else { throw new Error('browser build broken') }" >>dist/browser-test.js
node dist/browser-test.js

# Build npm package
TARBALL=$(cd assets && npm pack ../)

# Test that both commonjs and esm imports work
echo "{}" >test/tmp/package.json
echo 'import {Hsluv} from "hsluv";' >test/tmp/test.ts
echo 'import {Hsluv} from "hsluv";' >test/tmp/test.mjs
echo 'const {Hsluv} = require("hsluv");' >test/tmp/test.cjs

(cd test/tmp && npm install "../../assets/${TARBALL}")
node test/tmp/test.mjs
echo "ESM import OK"
node test/tmp/test.cjs
echo "CommonJS require OK"

# Test that TypeScript can discover types with various configurations
# Discussion: https://github.com/hsluv/hsluv-javascript/pull/4
for m in "node10" "node16" "bundler"; do
  (cd test/tmp && npx tsc --strict true --module es2020 --moduleResolution "$m" test.ts)
  echo "tsc (--moduleResolution $m) OK"
done
