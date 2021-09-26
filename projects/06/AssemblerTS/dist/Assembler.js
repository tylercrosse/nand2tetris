"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Parser_1 = require("./Parser");
/**
 *
 */
class Assembler {
    constructor(inputFilename) {
        // construct an empty symbol table
        // add the pre-defined symbols to the symbol table
        this.symbolTable = new Map([
            ["R0", "0"],
            ["R1", "1"],
            ["R2", "2"],
            ["R3", "3"],
            ["R4", "4"],
            ["R5", "5"],
            ["R6", "6"],
            ["R7", "7"],
            ["R8", "8"],
            ["R9", "9"],
            ["R10", "10"],
            ["R11", "11"],
            ["R12", "12"],
            ["R13", "13"],
            ["R14", "14"],
            ["R15", "15"],
        ]);
        this.inputFile = fs.readFileSync(inputFilename).toString();
        this.parser = new Parser_1.default(this.inputFile.split("\n"));
    }
    firstPass() {
        // scan the entire program
        // for each "instruction" of the form (xxx):
        // add the pair (xxx, address) to the symbol table,
        // where address is the number of the instruction following (xxx)
    }
    secondPass() {
        // set n to 16
        // scan the entire program again; for each instruction:
        // if the instruction is @symbol, look up symbol in the symbol table;
        // if (symbol, value) is found, use value to complete the instructions translation;
        // if not found:
        // add (symbol, n) to the symbol table,
        // use n to complete the instruction's translation,
        // n++
        // if the instruction is a c-instruction, complete the instruction's translation
        // write the translated instruction to the output file.
    }
    static main() { }
}
exports.default = Assembler;
// CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    console.log(args);
}
//# sourceMappingURL=Assembler.js.map