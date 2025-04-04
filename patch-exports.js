const fs = require('fs');
const path = require('path');

/**
 * This script is used to patch the Screeps main.js file to replace
 * `exports.loop` with `module.exports.loop`.
 * 
 * This is necessary because Screeps uses CommonJS modules and
 * `exports.loop` is not recognized by the Screeps engine.
 * 
 * The output file export is correct but the Screeps engine
 * does not recognize it as it simplifies the import/export process.
 */

const filePath = './dist/main.js';

let fileContent = fs.readFileSync(filePath, 'utf-8');

content = fileContent.replace(/exports\.loop\s*=\s*/g, 'module.exports.loop = ');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('🩹 Patched exports.loop -> module.exports.loop');
