"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
const CodeWriter_1 = require("./CodeWriter");
const constants_1 = require("./constants");
class VMTranslator {
    constructor(file) {
        this.inputFile = file;
        this.parser = new Parser_1.default(this.inputFile.split("\n"));
        this.codeWriter = new CodeWriter_1.default();
    }
    translate() {
        while (this.parser.hasMoreLines()) {
            this.parser.advance();
            // handle empty lines at the end of the file
            if (!this.parser.hasMoreLines())
                break;
            const { currentCommand } = this.parser;
            const currentCommandType = this.parser.commandType(currentCommand);
            // add comment of vm command to asm file for readability & debugging
            this.codeWriter.writeCommandComment(currentCommand);
            // write command
            switch (currentCommandType) {
                case constants_1.C_ARITHMETIC:
                    this.codeWriter.writeArithmetic(currentCommand);
                    break;
                case constants_1.C_PUSH:
                    this.codeWriter.writePush(this.parser.arg1(), this.parser.arg2());
                    break;
                case constants_1.C_POP:
                    this.codeWriter.writePop(this.parser.arg1(), this.parser.arg2());
                    break;
                case constants_1.C_LABEL:
                    this.codeWriter.writeLabel(this.parser.arg1());
                    break;
                case constants_1.C_GOTO:
                    this.codeWriter.writeGoto(this.parser.arg1());
                    break;
                case constants_1.C_IF:
                    this.codeWriter.writeIf(this.parser.arg1());
                    break;
                case constants_1.C_FUNCTION:
                    this.codeWriter.writeFunction(this.parser.arg1(), this.parser.arg2());
                    break;
                case constants_1.C_RETURN:
                    this.codeWriter.writeReturn();
                    break;
                case constants_1.C_CALL:
                    this.codeWriter.writeCall(this.parser.arg1(), this.parser.arg2());
                    break;
                default:
                    console.warn("Unable to parse command!", currentCommand);
                    break;
            }
        }
        return this.codeWriter.outputFile.join("\n") + "\n";
    }
    static main(file) {
        const vmTranslator = new VMTranslator(file);
        return vmTranslator.translate();
    }
}
exports.default = VMTranslator;
//# sourceMappingURL=VMTranslator.js.map