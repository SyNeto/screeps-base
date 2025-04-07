/**
 * Author: Ernesto Jiménez Villaseñor
 * Date: 2025-04-06
 * Version: 0.1.0
 * LICENSE: MIT
 * 
 * This Rollup plugin patches the generated code to replace
 * `exports.loop` with `module.exports.loop` to ensure
 * compatibility with Screeps.
 */

/**
 * @returns {import('rollup').Plugin}
 */
function patchExportsLoop() {
  return {
    name: 'patch-exports-loop',
    generateBundle(_, bundle) {
      for(const [fileName, chunkOrAsset] of Object.entries(bundle)) {
        if(chunkOrAsset.type === 'chunk' && chunkOrAsset.code){
          const originalCode = chunkOrAsset.code;
          const patchedCode =  originalCode.replace(/exports\.loop\s*=\s*/g, 'module.exports.loop = ');
          chunkOrAsset.code = patchedCode;
          console.log(`🩹 Patched ${fileName} exports.loop to module.exports.loop`);
        }
      }
    }
  }
}

module.exports = patchExportsLoop;
