"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Code Writer implementation for the Hack assembly language
 */
class CodeWriter {
    constructor() {
        this.outputFile = [];
        this.logicJumpCounter = 0;
        this.labelCounter = 0;
    }
    writeInit() {
        this.outputFile.push(`// System Init`);
        this.outputFile.push(`@256`);
        this.outputFile.push(`D=A`);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`M=D`);
        this.writeCall(`Sys.init`, 0);
    }
    /**
     * Adds a comment to the out asm file for vm command for readability & debugging
     * @param command
     */
    writeCommandComment(command) {
        this.outputFile.push(``);
        this.outputFile.push(`// ${command}`);
    }
    /** @override */
    writeArithmetic(command) {
        switch (command) {
            // pop two values off the stack's top, compute the stated function on them and push the resulting value back onto the stack
            case "add":
                this._writeArithmeticCommandBase();
                this.outputFile.push(`M=M+D`);
                break;
            case "sub":
                this._writeArithmeticCommandBase();
                this.outputFile.push(`M=M-D`);
                break;
            case "and":
                this._writeArithmeticCommandBase();
                this.outputFile.push(`M=M&D`);
                break;
            case "or":
                this._writeArithmeticCommandBase();
                this.outputFile.push(`M=M|D`);
                break;
            case "eq":
                this._writeLogicCommandBase("JNE");
                this.logicJumpCounter += 1;
                break;
            case "gt":
                this._writeLogicCommandBase("JLE");
                this.logicJumpCounter += 1;
                break;
            case "lt":
                this._writeLogicCommandBase("JGE");
                this.logicJumpCounter += 1;
                break;
            // pop one value off the stack's top, compute the stated function on them and push the resulting value back onto the stack
            case "not":
                this.outputFile.push(`@SP`);
                this.outputFile.push(`A=M-1`);
                this.outputFile.push(`M=!M`);
                break;
            case "neg":
                this.outputFile.push(`D=0`);
                this.outputFile.push(`@SP`);
                this.outputFile.push(`A=M-1`);
                this.outputFile.push(`M=D-M`);
                break;
            default:
                throw new Error(`writeArithmetic called with a non-arithmetic command: ${command}`);
        }
    }
    _writeArithmeticCommandBase() {
        this.outputFile.push(`@SP`);
        this.outputFile.push(`AM=M-1`);
        this.outputFile.push(`D=M`);
        this.outputFile.push(`A=A-1`);
    }
    _writeLogicCommandBase(jumpType) {
        this._writeArithmeticCommandBase();
        this.outputFile.push(`D=M-D`);
        this.outputFile.push(`@FALSE${this.logicJumpCounter}`);
        this.outputFile.push(`D;${jumpType}`);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`A=M-1`);
        this.outputFile.push(`M=-1`);
        this.outputFile.push(`@CONTINUE${this.logicJumpCounter}`);
        this.outputFile.push(`0;JMP`);
        this.outputFile.push(`(FALSE${this.logicJumpCounter})`);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`A=M-1`);
        this.outputFile.push(`M=0`);
        this.outputFile.push(`(CONTINUE${this.logicJumpCounter})`);
    }
    /** @override */
    writePush(segment, index) {
        switch (segment) {
            case "argument":
                this._writePushHelper("ARG", index, false);
                break;
            case "local":
                this._writePushHelper("LCL", index, false);
                break;
            case "this":
                this._writePushHelper("THIS", index, false);
                break;
            case "that":
                this._writePushHelper("THAT", index, false);
                break;
            case "temp":
                this._writePushHelper("R5", index + 5, false);
                break;
            case "static":
                this._writePushHelper(`${16 + index}`, index, false);
                break;
            case "pointer": {
                if (index === 0)
                    this._writePushHelper("THIS", index, true);
                if (index === 1)
                    this._writePushHelper("THAT", index, true);
                break;
            }
            case "constant":
                // RAM[SP] = x
                this.outputFile.push(`@${index}`);
                this.outputFile.push(`D=A`);
                this.outputFile.push(`@SP`);
                this.outputFile.push(`A=M`);
                this.outputFile.push(`M=D`);
                // SP++
                this.outputFile.push(`@SP`);
                this.outputFile.push(`M=M+1`);
                break;
            default:
                throw new Error(`writePush called with an unknown segment type: ${segment}`);
        }
    }
    _writePushHelper(symbol, index, isPointer) {
        // RAM[SP] = x
        this.outputFile.push(`@${symbol}`);
        this.outputFile.push(`D=M`);
        if (!isPointer) {
            this.outputFile.push(`@${index}`);
            this.outputFile.push(`A=D+A`);
            this.outputFile.push(`D=M`);
        }
        this.outputFile.push(`@SP`);
        this.outputFile.push(`A=M`);
        this.outputFile.push(`M=D`);
        // SP++
        this.outputFile.push(`@SP`);
        this.outputFile.push(`M=M+1`);
    }
    /** @override */
    writePop(segment, index) {
        switch (segment) {
            case "argument":
                this._writePopHelper("ARG", index, false);
                break;
            case "local":
                this._writePopHelper("LCL", index, false);
                break;
            case "this":
                this._writePopHelper("THIS", index, false);
                break;
            case "that":
                this._writePopHelper("THAT", index, false);
                break;
            case "temp":
                this._writePopHelper("R5", index + 5, false);
                break;
            case "static":
                this._writePopHelper(`${16 + index}`, index, false);
                break;
            case "pointer": {
                if (index === 0)
                    this._writePopHelper("THIS", index, true);
                if (index === 1)
                    this._writePopHelper("THAT", index, true);
                break;
            }
            case "constant":
                throw new Error("Unable to pop a constant");
            default:
                throw new Error(`writePop called with an unknown segment type: ${segment}`);
        }
    }
    _writePopHelper(symbol, index, isPointer) {
        // x = RAM[SP]
        // SP--
        this.outputFile.push(`@${symbol}`);
        if (isPointer) {
            this.outputFile.push(`D=A`);
        }
        else {
            this.outputFile.push(`D=M`);
            this.outputFile.push(`@${index}`);
            this.outputFile.push(`D=D+A`);
        }
        this.outputFile.push(`@R13`);
        this.outputFile.push(`M=D`);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`AM=M-1`);
        this.outputFile.push(`D=M`);
        this.outputFile.push(`@R13`);
        this.outputFile.push(`A=M`);
        this.outputFile.push(`M=D`);
    }
    /** @override */
    writeLabel(label) {
        this.outputFile.push(`(${label})`);
    }
    /** @override */
    writeGoto(label) {
        this.outputFile.push(`@${label}`); // functionName$label
        this.outputFile.push(`0;JMP`);
    }
    /** @override */
    writeIf(label) {
        this.outputFile.push(`@${label}`);
        this.outputFile.push(`D;JNE`);
    }
    /** @override */
    writeFunction(functionName, nVars) {
        this.outputFile.push(`(${functionName})`);
        for (let i = 0; i < nVars; i++) {
            this.writePush("constant", 0);
        }
    }
    /** @override */
    writeCall(functionName, nArgs) {
        const returnAddress = `$ret.${this.labelCounter}`; // $ret.i
        this.labelCounter += 1;
        // push return address
        this.outputFile.push(`@${returnAddress}`);
        this.outputFile.push(`D=A`);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`A=M`);
        this.outputFile.push(`M=D`);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`M=M+1`);
        // push LCL, ARG, THIS, THAT
        this._writePushHelper("LCL", 0, true);
        this._writePushHelper("ARG", 0, true);
        this._writePushHelper("THIS", 0, true);
        this._writePushHelper("THAT", 0, true);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`D=M`);
        this.outputFile.push(`@5`);
        this.outputFile.push(`D=D-A`);
        this.outputFile.push(`@${nArgs}`);
        this.outputFile.push(`D=D-A`);
        this.outputFile.push(`@ARG`);
        this.outputFile.push(`M=D`);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`D=M`);
        this.outputFile.push(`@LCL`);
        this.outputFile.push(`M=D`);
        this.outputFile.push(`@${functionName}`);
        this.outputFile.push(`0;JMP`);
        this.outputFile.push(`(${returnAddress})`);
    }
    /** @override */
    writeReturn() {
        this.outputFile.push(`@LCL`);
        this.outputFile.push(`D=M`);
        this.outputFile.push(`@R11`);
        this.outputFile.push(`M=D`);
        this.outputFile.push(`@5`);
        this.outputFile.push(`A=D-A`);
        this.outputFile.push(`D=M`);
        this.outputFile.push(`@R12`);
        this.outputFile.push(`M=D`);
        this._writePopHelper("ARG", 0, false);
        this.outputFile.push(`@ARG`);
        this.outputFile.push(`D=M`);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`M=D+1`);
        this.outputFile.push(`M=D+1`);
        this._writeReturnHelper("THAT");
        this._writeReturnHelper("THIS");
        this._writeReturnHelper("ARG");
        this._writeReturnHelper("LCL");
        this.outputFile.push(`@R12`);
        this.outputFile.push(`A=M`);
        this.outputFile.push(`0;JMP`);
    }
    _writeReturnHelper(position) {
        this.outputFile.push(`@R11`);
        this.outputFile.push(`D=M-1`);
        this.outputFile.push(`AM=D`);
        this.outputFile.push(`D=M`);
        this.outputFile.push(`@${position}`);
        this.outputFile.push(`M=D`);
    }
}
exports.default = CodeWriter;
//# sourceMappingURL=CodeWriter.js.map