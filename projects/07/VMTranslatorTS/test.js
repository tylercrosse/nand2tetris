const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const translateDirOrFiles = require('./index');

const CPU_EMULATOR_PATH =
  "/Users/crossetx/Desktop/nand2tetris/tools/CPUEmulator.sh";

// compile VMTranslator (optional?)

function buildFileQueue(dir) {
  const vmRegExp = new RegExp(`\\.vm$`);
  const fileQueue = [];

  function traverse(currentDir) {
    const files = fs.readdirSync(currentDir);
    const vmFiles = files.filter(file => vmRegExp.test(file));
    // at least one vm file and none of the vm files are named the same as the directory
    if (vmFiles.length > 0 && !vmFiles.some(file => file.includes(currentDir))) {
      fileQueue.push(translateDirOrFiles(currentDir, false))
    } else if (vmFiles.length === 1){
      fileQueue.push(translateDirOrFiles(vmFiles[0], false))
    }
    
    files.forEach((file) => {
      const resolvedPath = path.resolve(currentDir, file);
      if (fs.lstatSync(resolvedPath).isDirectory()) {
        traverse(resolvedPath);
      }
    });
  }
  traverse(dir);

  return fileQueue;
}

function testASM(name, resolvedPath) {
  exec(`${CPU_EMULATOR_PATH} ${resolvedPath}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`❌`, name, `error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`❌`, name, `stderr: ${stderr}`);
      return;
    }
    console.log(`✅`, name, stdout);
  });
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const dir = args[0];
  if (!dir) {
    console.log("Missing a directory usage:");
    console.log("$ node test.js <dir>");
    return;
  }

  try {
    const asmFileQueue = buildFileQueue(dir);

    asmFileQueue.forEach((file) => {
      const tstPath = file.replace(".asm", ".tst");
      testASM(path.basename(file), tstPath);
    });
  } catch (e) {
    console.log("⚠️  Whoops something broke while testing:\n", e);
  }
}
