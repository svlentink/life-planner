#!/bin/sh
set -e
wget https://raw.githubusercontent.com/svlentink/www/refs/heads/master/cdn.lent.ink/js/npm/package.json

for f in mods/*.js; do
	sed -i 's_\ //WEBPACK__';
done

npm install
npm run build
npm list

