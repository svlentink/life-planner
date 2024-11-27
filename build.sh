#!/bin/sh
set -e
curl --output package.json https://raw.githubusercontent.com/svlentink/www/refs/heads/master/cdn.lent.ink/js/npm/package.json
curl --output mods/storage.mjs https://raw.githubusercontent.com/svlentink/www/refs/heads/master/cdn.lent.ink/js/mod/storage.js

for f in main.mjs mods/*.mjs; do
	sed -i 's_\ //WEBPACK__' $f;
done

npm install
npm run build
npm list

