import Parser from "./Parser";
import CodeWriter from "./CodeWriter";
import { SegmentType } from "./ICodeWriter";
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
  parsers: Parser[];
  codeWriter: CodeWriter;
  inputFiles: string[];
  inputFileNames: string[];
  outputFile: string[];

  constructor(files: string[], fileNames: string[]) {
    this.inputFiles = files;
    this.inputFileNames = fileNames;
    this.parsers = files.map((file) => new Parser(file.split("\n")));
    this.codeWriter = new CodeWriter();
  }

  translate(): string {
    this.codeWriter.writeInit();

    for (let i = 0; i < this.inputFiles.length; i += 1) {
      const parser = this.parsers[i];
      this.codeWriter.setFileName(this.inputFileNames[i]);

      try {
        while (parser.hasMoreLines()) {
          parser.advance();

          // handle empty lines at the end of the file
          if (!parser.hasMoreLines()) break;

          const { currentCommand } = parser;
          const currentCommandType = parser.commandType(currentCommand);

          // add comment of vm command to asm file for readability & debugging
          this.codeWriter.writeCommandComment(currentCommand.trim());

          // write command
          switch (currentCommandType) {
            case C_ARITHMETIC:
              this.codeWriter.writeArithmetic(parser.arg1());
              break;
            case C_PUSH:
              this.codeWriter.writePush(
                parser.arg1() as SegmentType,
                parser.arg2()
              );
              break;
            case C_POP:
              this.codeWriter.writePop(
                parser.arg1() as SegmentType,
                parser.arg2()
              );
              break;
            case C_LABEL:
              this.codeWriter.writeLabel(parser.arg1());
              break;
            case C_GOTO:
              this.codeWriter.writeGoto(parser.arg1());
              break;
            case C_IF:
              this.codeWriter.writeIf(parser.arg1());
              break;
            case C_FUNCTION:
              this.codeWriter.writeFunction(parser.arg1(), parser.arg2());
              break;
            case C_RETURN:
              this.codeWriter.writeReturn();
              break;
            case C_CALL:
              this.codeWriter.writeCall(parser.arg1(), parser.arg2());
              break;
            default:
              console.warn("Unable to parse command!", currentCommand);
              break;
          }
        }
      } catch (e) {
        console.error(
          "❌",
          "line",
          parser.currentLineNumber,
          e.message,
          e.stack
        );
      }
    }

    return this.codeWriter.outputFile.join("\n") + "\n";
  }

  static main(fileContents: string[], fileNames: string[]): string {
    const vmTranslator = new VMTranslator(fileContents, fileNames);
    return vmTranslator.translate();
  }
}
