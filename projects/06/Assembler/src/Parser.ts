import * as fs from "fs";
import Code from "./Code";

/**
 * Encapsulates access to the input assembly code.
 * It provides a convenient means for advancing through the source code, skipping comments and whitespace, and breaking each symbolic instruction into its underlying components.
 */
export default class Parser {
  static A_INSTRUCTION = 0;
  static C_INSTRUCTION = 1;
  static L_INSTRUCTION = 2;

  code: Code;

  lineStack: string[];
  currentLineNumber: number;
  currentInstruction: string;

  whitespaceRegExp = new RegExp(/\s/, "g");
  commentRegExp = new RegExp(/\/\/.*/, "g");
  destRegExp = new RegExp(/=.*/, "g");
  leftHandRegExp = new RegExp(/.*=/, "g");
  rightHandRegExp = new RegExp(/;.*/, "g");
  jumpRegExp = new RegExp(/.*;/, "g");

  constructor(filename: string) {
    this.code = new Code();
    const file = fs.readFileSync(filename);
    this.lineStack = file.split("\n");
    this.currentLineNumber = 0;
    this.currentInstruction = "";
  }

  hasMoreLines(): boolean {
    return this.lineStack.length !== 0;
  }

  advance(): void {
    if (!this.hasMoreLines()) return;

    const line = this.lineStack
      .shift()
      .replace(this.whitespaceRegExp, "")
      .replace(this.commentRegExp, "");

    this.currentLineNumber += 1;

    if (line.length === 0) {
      this.advance();
    } else {
      this.currentInstruction = line;
    }
  }

  instructionType(instruction: string): InstructionType {
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

  symbol(): string {}

  cInstruction(instruction: string): string {
    return (
      "111" +
      this.comp(instruction) +
      this.dest(instruction) +
      this.jump(instruction)
    );
  }

  dest(instruction: string): string {
    // dest=comp;jump
    if (instruction.indexOf("=") === -1) return "000";
    const destCode = instruction.replace(this.destRegExp, "");
    return this.code.dest(destCode);
  }

  comp(instruction: string): string {
    // dest=comp;jump
    const compCode = instruction
      .replace(this.leftHandRegExp, "")
      .replace(this.rightHandRegExp, "");
    return this.code.comp(compCode);
  }

  jump(instruction: string): string {
    // dest=comp;jump
    if (instruction.indexOf(";") === -1) return "000";
    const jumpCode = instruction.replace(this.jumpRegExp, "");
    return this.code.jump(jumpCode);
  }
}
