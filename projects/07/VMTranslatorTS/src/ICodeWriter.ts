
export type SegmentType =
| "argument"
| "local"
| "static"
| "constant"
| "this"
| "that"
| "pointer"
| "temp";

/**
 * Implementation indpendent interface specified by The Elements of Computing Systems 2nd Edition pg.165. Note: I made
 * setFileName() and close() optional methods. The book also specifies writePushPop which I split into separate
 * writePush and writePop methods to clean up the implementaiton.
 */
 export default interface ICodeWriter {
  /**
   * Informs that the translation of a new VM file has started (called by the VMTranslator)
   * @param fileName
   */
  setFileName?(fileName: string): void;

  /**
   * Writes to the output file the assembly code that implements the given arithmetic-logical command.
   * @param command
   */
  writeArithmetic(command: string): void;

  /**
   * Writes to the output file the assembly code that implements the given `push` command
   * @param segment
   * @param index
   */
  writePush(segment: SegmentType, index: number): void;

  /**
   * Writes to the output file the assembly code that implements the given `pop` command
   * @param segment
   * @param index
   */
  writePop(segment: SegmentType, index: number): void;

  /**
   * Writes to the output file the assembly code that effects the `label` command
   * @param label
   */
  writeLabel(label: string): void;

  /**
   * Writes to the output file the assembly code that effects the `goto` command
   * @param label
   */
  writeGoto(label: string): void;

  /**
   * Writes to the output file the assembly code that effects the `if-goto` command
   * @param label
   */
  writeIf(label: string): void;

  /**
   * Writes to the output file the assembly code that effects the `function` command
   * @param functionName
   * @param nVars
   */
  writeFunction(functionName: string, nVars: number): void;

  /**
   * Writes to the output file the assembly code that effects the `call` command
   * @param functionName
   * @param nVars
   */
  writeCall(functionName: string, nArgs: number): void;

  /**
   * Writes to the output file the assembly code that effects the `return` command
   */
  writeReturn(): void;

  /**
   * Closes the output file / stream.
   */
  close?(): void;
}
