#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const VMTranslator = require("./dist/VMTranslator").default;

function translateDirOrFiles(filename, shouldLog = true) {
  const isDir = fs.lstatSync(filename).isDirectory();
  const vmRegExp = new RegExp(`\\.vm$`);

  if (isDir) {
    shouldLog && console.log("📝 Translating Dir", filename);
    const files = fs.readdirSync(filename);
    const inputFiles = files.filter((file) => vmRegExp.test(file));
    const inputFileContents = inputFiles.map((file) =>
      fs.readFileSync(path.join(filename, file)).toString()
    );
    const outFilename = path.join(filename, `${path.basename(filename)}.asm`);
    fs.writeFileSync(outFilename, VMTranslator.main(inputFileContents, inputFiles));
    shouldLog && console.log("✨ Success!", outFilename);
    return outFilename;
  } else {
    shouldLog && console.log("📝 Translating File", filename);
    const inputFileContents = fs.readFileSync(filename).toString();
    const outFilename = filename.replace(".vm", ".asm");
    fs.writeFileSync(outFilename, VMTranslator.main([inputFileContents], [path.basename(filename)]));
    shouldLog && console.log("✨ Success!", outFilename);
    return outFilename;
  }
}

module.exports = translateDirOrFiles;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const filename = args[0];
  if (!filename) {
    console.log("Missing a filename or directory, usage:");
    console.log("$ node index.js <filename|directory>");
    return;
  }
  try {
    translateDirOrFiles(filename);
  } catch (e) {
    console.log("⚠️  Whoops something broke:\n", e);
  }
}
