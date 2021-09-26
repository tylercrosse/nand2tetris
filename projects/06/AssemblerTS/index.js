#!/usr/bin/env node

const fs = require("fs");
const Assembler = require("./dist/Assembler").default;

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const filename = args[0];
  if (!filename) {
    console.log("Missing a filename, useage:");
    console.log("$ node index.js <filename>");
    return;
  }
  try {
    console.log("👓 Parsing", filename);
    const file = fs.readFileSync(filename).toString();
    const outFilename = filename.replace(".asm", ".hack");
    console.log("✨ Success!", outFilename);
    fs.writeFileSync(outFilename, Assembler.main(file));
  } catch (e) {
    console.log("⚠️  Whoops something broke:\n", e);
  }
}
