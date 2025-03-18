#!/usr/bin/env sh

set -e

rm -rf dist
mkdir -p dist

npm run build

node test/test.js

# Sanity check hsluv.min.js window export
echo "const window = {};" >dist/browser-test.js
cat "dist/hsluv.min.js" >>dist/browser-test.js
echo "if (window.Hsluv) { console.log('Browser OK') } else { throw new Error('browser build broken') }" >>dist/browser-test.js
node dist/browser-test.js

# Make sure npm package is importable
(cd test/tmp && npm install)
node test/tmp/test-esm.mjs
echo "ESM import OK"
node test/tmp/test-commonjs.cjs
echo "CommonJS import OK"

# Test that TypeScript can discover types with various configurations
for opts in "--module NodeNext --moduleResolution NodeNext" "--module es2015 --moduleResolution bundler"; do
  (cd test/tmp && npx tsc --strict true --noEmit true $opts test-types.ts)
  echo "tsc (--moduleResolution $opts) OK"
done
