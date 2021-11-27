import Parser from "./Parser";
import CodeWriter, { SegmentType } from "./CodeWriter";
import {
  C_ARITHMETIC,
  C_PUSH,
  C_POP,
  C_LABEL,
  C_GOTO,
  C_IF,
  C_FUNCTION,
  C_RETURN,
  C_CALL,
} from "./constants";

export default class VMTranslator {
  parser: Parser;
  codeWriter: CodeWriter;
  inputFile: string;
  outputFile: string[];

  constructor(file: string) {
    this.inputFile = file;
    this.parser = new Parser(this.inputFile.split("\n"));
    this.codeWriter = new CodeWriter();
  }

  translate(): string {
    while (this.parser.hasMoreLines()) {
      this.parser.advance();

      const { currentCommand } = this.parser;
      const currentCommandType = this.parser.commandType(currentCommand);

      // add comment of vm command to asm file for readability & debugging
      this.codeWriter.writeCommandComment(currentCommand);

      // write command
      switch (currentCommandType) {
        case C_ARITHMETIC:
          this.codeWriter.writeArithmetic(currentCommand);
          break;
        case C_PUSH:
          this.codeWriter.writePush(
            this.parser.arg1() as SegmentType,
            this.parser.arg2()
          );
          break;
        case C_POP:
          this.codeWriter.writePop(
            this.parser.arg1() as SegmentType,
            this.parser.arg2()
          );
          break;
        default:
          console.warn("Unable to parse command!");
          break;
      }
    }
    return this.codeWriter.outputFile.join("\n");
  }

  static main(file: string): string {
    const vmTranslator = new VMTranslator(file);
    return vmTranslator.translate();
  }
}
