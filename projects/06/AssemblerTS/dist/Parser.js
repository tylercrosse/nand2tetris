"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Code_1 = require("./Code");
/**
 * Encapsulates access to the input assembly code.
 * It provides a convenient means for advancing through the source code, skipping comments and whitespace, and breaking each symbolic instruction into its underlying components.
 */
class Parser {
    constructor(lines) {
        this.whitespaceRegExp = new RegExp(/\s/, "g");
        this.commentRegExp = new RegExp(/\/\/.*/, "g");
        this.destRegExp = new RegExp(/=.*/, "g");
        this.leftHandRegExp = new RegExp(/.*=/, "g");
        this.rightHandRegExp = new RegExp(/;.*/, "g");
        this.jumpRegExp = new RegExp(/.*;/, "g");
        this.labelRegExp = new RegExp(/(?!\()(.*)(?<!\))/);
        this.code = new Code_1.default();
        this.lineStack = lines;
        this.currentLineNumber = 0;
        this.currentInstruction = "";
        this.currentInstructionNumber = 0;
    }
    hasMoreLines() {
        return this.lineStack.length > 0;
    }
    advance() {
        if (!this.hasMoreLines())
            return;
        const line = this.lineStack
            .shift()
            .replace(this.whitespaceRegExp, "")
            .replace(this.commentRegExp, "");
        this.currentLineNumber += 1;
        if (line.length === 0) {
            this.advance();
        }
        else {
            this.currentInstruction = line;
            if (this.instructionType(this.currentInstruction) !== Parser.L_INSTRUCTION) {
                this.currentInstructionNumber += 1;
            }
        }
    }
    instructionType(instruction) {
        // @xxx, where xxx is either a decimal number or a symbol
        if (instruction.charAt(0) === "@") {
            return Parser.A_INSTRUCTION;
        }
        // (xxx), where xxx is a symbol
        if (instruction.charAt(0) === "(") {
            return Parser.L_INSTRUCTION;
        }
        // dest=comp;jump
        return Parser.C_INSTRUCTION;
    }
    symbol(instruction) {
        const instructionType = this.instructionType(instruction);
        if (instructionType === Parser.A_INSTRUCTION) {
            // @xxx -> return xxx
            return instruction.slice(1);
        }
        if (instructionType === Parser.L_INSTRUCTION) {
            // (xxx) -> return xxx
            return instruction.match(this.labelRegExp)[0];
        }
    }
    aInstruction(address) {
        const binaryAddress = parseInt(address).toString(2);
        return "0000000000000000".substr(binaryAddress.length) + binaryAddress;
    }
    cInstruction(instruction) {
        return ("111" +
            this.comp(instruction) +
            this.dest(instruction) +
            this.jump(instruction));
    }
    dest(instruction) {
        // dest=comp;jump
        if (instruction.indexOf("=") === -1)
            return "000";
        const destCode = instruction.replace(this.destRegExp, "");
        return this.code.dest(destCode);
    }
    comp(instruction) {
        // dest=comp;jump
        const compCode = instruction
            .replace(this.leftHandRegExp, "")
            .replace(this.rightHandRegExp, "");
        return this.code.comp(compCode);
    }
    jump(instruction) {
        // dest=comp;jump
        if (instruction.indexOf(";") === -1)
            return "000";
        const jumpCode = instruction.replace(this.jumpRegExp, "");
        return this.code.jump(jumpCode);
    }
}
exports.default = Parser;
Parser.A_INSTRUCTION = 0;
Parser.C_INSTRUCTION = 1;
Parser.L_INSTRUCTION = 2;
//# sourceMappingURL=Parser.js.map