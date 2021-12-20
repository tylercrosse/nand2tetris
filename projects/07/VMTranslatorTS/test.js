const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const VMTranslator = require("./dist/VMTranslator").default;
const { Console } = require("console");

const CPU_EMULATOR_PATH =
  "/Users/crossetx/Desktop/nand2tetris/tools/CPUEmulator.sh";

// compile VMTranslator (optional?)

function buildFileStack(dir, filetype) {
  const extRegExp = new RegExp(`\\.${filetype}$`);
  const fileStack = [];

  function traverse(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach((file) => {
      const resolvedPath = path.resolve(currentDir, file);
      if (fs.lstatSync(resolvedPath).isDirectory()) {
        traverse(resolvedPath);
      } else if (extRegExp.test(file)) {
        fileStack.push({
          name: file,
          resolvedPath,
        });
      }
    });
  }
  traverse(dir);

  return fileStack;
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
    // traversal of directory & find .vm files
    const vmFileStack = buildFileStack(dir, "vm");

    vmFileStack.forEach((file) => {
      const fileContents = fs.readFileSync(file.resolvedPath).toString();
      const outPath = file.resolvedPath.replace(".vm", ".asm");
      const tstPath = file.resolvedPath.replace(".vm", ".tst");
      fs.writeFileSync(outPath, VMTranslator.main(fileContents));

      testASM(file.name, tstPath);
    });
  } catch (e) {
    console.log("⚠️  Whoops something broke while testing:\n", e);
  }
}
