import Code from "./Code";

type InstructionType = 0 | 1 | 2;

/**
 * Encapsulates access to the input assembly code.
 * It provides a convenient means for advancing through the source code, skipping comments and whitespace, and breaking each symbolic instruction into its underlying components.
 */
export default class Parser {
  static A_INSTRUCTION: InstructionType = 0;
  static C_INSTRUCTION: InstructionType = 1;
  static L_INSTRUCTION: InstructionType = 2;

  code: Code;

  lineStack: string[];
  currentLineNumber: number;
  currentInstruction: string;
  currentInstructionNumber: number;

  whitespaceRegExp = new RegExp(/\s/, "g");
  commentRegExp = new RegExp(/\/\/.*/, "g");
  destRegExp = new RegExp(/=.*/, "g");
  leftHandRegExp = new RegExp(/.*=/, "g");
  rightHandRegExp = new RegExp(/;.*/, "g");
  jumpRegExp = new RegExp(/.*;/, "g");
  labelRegExp = new RegExp(/(?!\()(.*)(?<!\))/);

  constructor(lines: string[]) {
    this.code = new Code();
    this.lineStack = lines;
    this.currentLineNumber = 0;
    this.currentInstruction = "";
    this.currentInstructionNumber = 0;
  }

  hasMoreLines(): boolean {
    return this.lineStack.length > 0;
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
      if (
        this.instructionType(this.currentInstruction) !== Parser.L_INSTRUCTION
      ) {
        this.currentInstructionNumber += 1;
      }
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

  symbol(instruction: string): string {
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

  aInstruction(address: string): string {
    const binaryAddress = parseInt(address).toString(2);
    return "0000000000000000".substr(binaryAddress.length) + binaryAddress;
  }

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
