const path = require('path');
const { MSICreator } = require('electron-wix-msi');
const build_info = require('../package.json');

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: path.resolve(__dirname, '..', 'dist', 'electron', 'ForBetter-win32-x64'),
  description: 'Cross Platform virtual assistance app',
  exe: build_info.productName,
  name: build_info.productName,
  manufacturer: build_info.author,
  version: build_info.version,
  outputDirectory: path.resolve(__dirname, '..', 'desktopbuild', 'package'),
  appIconPath: path.resolve(__dirname, '..', 'public', 'favicon.ico')
});

async function build() {
  // Step 2: Create a .wxs template file
  try {
    console.log(path.resolve(__dirname, '..', 'desktopbuild', 'package'));
    await msiCreator.create();
    console.log('Created');
  } catch (err) {
    console.error(err);
  }

  // Step 3: Compile the template to a .msi file
  try {
    console.log('compile start');
    await msiCreator.compile();
    console.log('done');
  } catch (err) {
    console.error(err);
  }
}

build();
