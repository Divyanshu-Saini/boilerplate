const path = require('path');
const { MSICreator } = require('electron-wix-msi');
const build_info = require('../package.json');

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: path.resolve(__dirname, '..', 'dist', 'electron', 'ForBetter-win32-x64'),
  description: 'Cross Platform virtual assistance app',
  exe: 'ForBetter',
  name: 'ForBetter',
  manufacturer: 'NDS Global Cloud Solutions',
  version: build_info.version,
  outputDirectory: path.resolve(__dirname, '..', 'build', 'package'),
  appIconPath: path.resolve(__dirname, '..', 'public', 'favicon.ico')
});

async function build() {
  // Step 2: Create a .wxs template file
  try {
    await msiCreator.create();
  } catch (err) {
    console.error(err);
  }

  // Step 3: Compile the template to a .msi file
  try {
    await msiCreator.compile();
  } catch (err) {
    console.error(err);
  }
}

build();
