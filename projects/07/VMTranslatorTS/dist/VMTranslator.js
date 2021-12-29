"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
const CodeWriter_1 = require("./CodeWriter");
const constants_1 = require("./constants");
class VMTranslator {
    constructor(files, fileNames) {
        this.inputFiles = files;
        this.inputFileNames = fileNames;
        this.parsers = files.map((file) => new Parser_1.default(file.split("\n")));
        this.codeWriter = new CodeWriter_1.default();
    }
    translate() {
        this.codeWriter.writeInit();
        for (let i = 0; i < this.inputFiles.length; i += 1) {
            const parser = this.parsers[i];
            this.codeWriter.setFileName(this.inputFileNames[i]);
            try {
                while (parser.hasMoreLines()) {
                    parser.advance();
                    // handle empty lines at the end of the file
                    if (!parser.hasMoreLines())
                        break;
                    const { currentCommand } = parser;
                    const currentCommandType = parser.commandType(currentCommand);
                    // add comment of vm command to asm file for readability & debugging
                    this.codeWriter.writeCommandComment(currentCommand.trim());
                    // write command
                    switch (currentCommandType) {
                        case constants_1.C_ARITHMETIC:
                            this.codeWriter.writeArithmetic(parser.arg1());
                            break;
                        case constants_1.C_PUSH:
                            this.codeWriter.writePush(parser.arg1(), parser.arg2());
                            break;
                        case constants_1.C_POP:
                            this.codeWriter.writePop(parser.arg1(), parser.arg2());
                            break;
                        case constants_1.C_LABEL:
                            this.codeWriter.writeLabel(parser.arg1());
                            break;
                        case constants_1.C_GOTO:
                            this.codeWriter.writeGoto(parser.arg1());
                            break;
                        case constants_1.C_IF:
                            this.codeWriter.writeIf(parser.arg1());
                            break;
                        case constants_1.C_FUNCTION:
                            this.codeWriter.writeFunction(parser.arg1(), parser.arg2());
                            break;
                        case constants_1.C_RETURN:
                            this.codeWriter.writeReturn();
                            break;
                        case constants_1.C_CALL:
                            this.codeWriter.writeCall(parser.arg1(), parser.arg2());
                            break;
                        default:
                            console.warn("Unable to parse command!", currentCommand);
                            break;
                    }
                }
            }
            catch (e) {
                console.error("❌", "line", parser.currentLineNumber, e.message, e.stack);
            }
        }
        return this.codeWriter.outputFile.join("\n") + "\n";
    }
    static main(fileContents, fileNames) {
        const vmTranslator = new VMTranslator(fileContents, fileNames);
        return vmTranslator.translate();
    }
}
exports.default = VMTranslator;
//# sourceMappingURL=VMTranslator.js.map