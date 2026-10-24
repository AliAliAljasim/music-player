"use strict";
// electron-builder afterPack hook: put the b·side icon and name into the
// Windows app exe. electron-builder's own resource editing needs Wine on
// Linux, so it is turned off (signAndEditExecutable: false) and rcedit runs
// here instead: natively on Windows, or through WSL's Windows interop.
const { execFileSync } = require('child_process');
const path = require('path');

const winPath = (p) => (process.platform === 'win32' ? p : execFileSync('wslpath', ['-w', p]).toString().trim());

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return;
  const exe = path.join(context.appOutDir, context.packager.appInfo.productFilename + '.exe');
  const icon = path.join(context.packager.projectDir, 'build', 'icon.ico');
  const rcedit = path.join(context.packager.projectDir, 'node_modules', 'rcedit', 'bin', 'rcedit-x64.exe');
  const { version } = context.packager.appInfo;
  try {
    execFileSync(rcedit, [
      winPath(exe),
      '--set-icon', winPath(icon),
      '--set-version-string', 'FileDescription', 'b·side',
      '--set-version-string', 'ProductName', 'b·side',
      '--set-file-version', version,
      '--set-product-version', version
    ], { stdio: 'inherit' });
  } catch (err) {
    throw new Error('Could not set the exe icon with rcedit (needs Windows or WSL interop): ' + err.message);
  }
};
