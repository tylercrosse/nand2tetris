#!/usr/bin/env node

const fs = require("fs");
const VMTranslator = require("./dist/VMTranslator").default;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const filename = args[0];
  if (!filename) {
    console.log("Missing a filename, usage:");
    console.log("$ node index.js <filename>");
    return;
  }
  try {
    console.log("👓 Parsing", filename);
    const file = fs.readFileSync(filename).toString();
    const outFilename = filename.replace(".vm", ".asm");
    fs.writeFileSync(outFilename, VMTranslator.main(file));
    console.log("✨ Success!", outFilename);
  } catch (e) {
    console.log("⚠️  Whoops something broke:\n", e);
  }
}
