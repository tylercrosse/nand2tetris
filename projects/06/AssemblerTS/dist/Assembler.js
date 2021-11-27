"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
/**
 *
 */
class Assembler {
    constructor(file) {
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
            ["SP", "0"],
            ["LCL", "1"],
            ["ARG", "2"],
            ["THIS", "3"],
            ["THAT", "4"],
            ["SCREEN", "16384"],
            ["KBD", "24576"],
        ]);
        this.inputFile = file;
        this.outputFile = [];
        this.parser = new Parser_1.default(this.inputFile.split("\n"));
        this.variableAddress = 16;
    }
    firstPass() {
        // scan the entire program
        // for each "instruction" of the form (xxx):
        // add the pair (xxx, address) to the symbol table,
        // where address is the number of the instruction following (xxx)
        while (this.parser.hasMoreLines()) {
            this.parser.advance();
            const { currentInstruction, currentInstructionNumber } = this.parser;
            const currentInstructionType = this.parser.instructionType(currentInstruction);
            if (currentInstructionType === Parser_1.default.L_INSTRUCTION) {
                this.symbolTable.set(this.parser.symbol(currentInstruction), currentInstructionNumber.toString());
            }
        }
    }
    secondPass() {
        // reset parser
        this.parser = new Parser_1.default(this.inputFile.split("\n"));
        // set n to 16
        // scan the entire program again; for each instruction:
        // if the instruction is @symbol, look up symbol in the symbol table;
        // if (symbol, value) is found, use value to complete the instructions translation;
        while (this.parser.hasMoreLines()) {
            this.parser.advance();
            if (!this.parser.hasMoreLines())
                break;
            const { currentInstruction, currentInstructionNumber } = this.parser;
            const currentInstructionType = this.parser.instructionType(currentInstruction);
            if (currentInstructionType === Parser_1.default.A_INSTRUCTION) {
                const currentSymbol = this.parser.symbol(currentInstruction);
                const isSymbolNumber = !isNaN(parseInt(currentSymbol));
                if (!isSymbolNumber && !this.symbolTable.has(currentSymbol)) {
                    // if not found:
                    // add (symbol, n) to the symbol table,
                    // use n to complete the instruction's translation,
                    // n++
                    this.symbolTable.set(currentSymbol, this.variableAddress.toString());
                    this.variableAddress += 1;
                }
                const currentAddress = isSymbolNumber
                    ? currentSymbol
                    : this.symbolTable.get(currentSymbol);
                if (!isNaN(parseInt(currentAddress))) {
                    this.outputFile.push(this.parser.aInstruction(currentAddress));
                }
                else {
                    throw new Error(`Unable to process current address on input line ${this.parser.currentLineNumber}:
            ${this.parser.currentInstruction}`);
                }
            }
            if (currentInstructionType === Parser_1.default.C_INSTRUCTION) {
                this.outputFile.push(this.parser.cInstruction(currentInstruction));
            }
        }
    }
    static main(file) {
        const assembler = new Assembler(file);
        assembler.firstPass();
        assembler.secondPass();
        return assembler.outputFile.join("\n");
    }
}
exports.default = Assembler;
//# sourceMappingURL=Assembler.js.map