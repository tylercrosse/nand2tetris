import { CommandType } from "./Parser";

export type SegmentType =
  | "argument"
  | "local"
  | "static"
  | "constant"
  | "this"
  | "that"
  | "pointer"
  | "temp";

type JumpType = "JLE" | "JGE" | "JNE";

/**
 * Indirect Addressing - Pointer Manipulation
 * D = *p  // pseudo asm
 *
 * @p     // Hack asm
 * A=M
 * D=M
 */

export default class CodeWriter {
  outputFile: string[];
  logicJumpCounter: number;

  constructor() {
    this.outputFile = [];
    this.logicJumpCounter = 0;
  }

  /**
   * Adds a comment to the out asm file for vm command for readability & debugging
   */
  writeCommandComment(command: string) {
    this.outputFile.push(``);
    this.outputFile.push(`// ${command}`);
  }

  /**
   * Write to the out file the assembly code that implements the given arithmetic command.
   * @param command
   */
  writeArithmetic(command: string) {
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
        console.warn(
          "writeArithmetic called with a non-arithmetic command",
          command
        );
        break;
    }
  }

  _writeArithmeticCommandBase(): void {
    this.outputFile.push(`@SP`);
    this.outputFile.push(`AM=M-1`);
    this.outputFile.push(`D=M`);
    this.outputFile.push(`A=A-1`);
  }

  _writeLogicCommandBase(jumpType: JumpType): void {
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

  writePush(segment: SegmentType, index: number) {
    switch (segment) {
      case "argument":
        this._writePush("ARG", index, false);
        break;
      case "local":
        this._writePush("LCL", index, false);
        break;
      case "static":
        this._writePush(`${16 + index}`, index, false);
        break;
      case "constant":
        // RAM[SP] = x
        this.outputFile.push(`@${index}`);
        this.outputFile.push(`D=A`);
        this.outputFile.push(`D=A`);
        this.outputFile.push(`@SP`);
        this.outputFile.push(`A=M`);
        this.outputFile.push(`M=D`);
        // SP++
        this.outputFile.push(`@SP`);
        this.outputFile.push(`M=M+1`);
        break;
      default:
        console.warn("writePush called with an unknown segment type", segment);
        break;
    }
  }

  _writePush(symbol: string, index: number, isPointer: boolean) {
    // RAM[SP] = x
    this.outputFile.push(`@${symbol}`);
    this.outputFile.push(`D=M`);
    if (isPointer) {
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

  writePop(segment: SegmentType, index: number) {
    switch (segment) {
      case "argument":
        this._writePop("ARG", index, false);
        break;
      case "local":
        this._writePop("LCL", index, false);
        break;
      case "static":
        this._writePop(`${16 + index}`, index, false);
        break;
      case "constant":
        throw new Error('Unable to pop a constant')
        break;
      default:
        console.warn("writePush called with an unknown segment type", segment);
        break;
    }
  }

  _writePop(symbol: string, index: number, isPointer: boolean) {
    // x = RAM[SP]
    // SP--
    this.outputFile.push(`@${symbol}`);
    if (isPointer) {
      this.outputFile.push(`D=M`);
      this.outputFile.push(`@${index}`);
      this.outputFile.push(`D=D+A`);
    } else {
      this.outputFile.push(`D=A`);
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
}
