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

export type CommandType =
  | "C_ARITHMETIC" // add, sub, neg, eg, gt, lt, and, or, not
  | "C_PUSH"
  | "C_POP"
  | "C_LABEL"
  | "C_GOTO"
  | "C_IF"
  | "C_FUNCTION"
  | "C_RETURN"
  | "C_CALL";

type CommandTypeDict = {
  [command: string]: CommandType;
};

/**
 * Handles the parsing of a single .vm file
 * reads a VM command, parses the command into its lexical components, and provides convenient access to these components
 * ignores all white space and comments
 */
export default class Parser {
  commandTypesDict: CommandTypeDict = {
    add: C_ARITHMETIC,
    sub: C_ARITHMETIC,
    neg: C_ARITHMETIC,
    eq: C_ARITHMETIC,
    gt: C_ARITHMETIC,
    lt: C_ARITHMETIC,
    and: C_ARITHMETIC,
    or: C_ARITHMETIC,
    not: C_ARITHMETIC,
    label: C_LABEL,
    goto: C_GOTO,
    "if-goto": C_IF,
    push: C_PUSH,
    pop: C_POP,
    call: C_CALL,
    return: C_RETURN,
    function: C_FUNCTION,
  };

  lineStack: string[];
  currentLineNumber: number;
  currentCommand: string;

  whitespaceRegExp = new RegExp(/^\s+|\s+$/, "g"); // leading & trailing 
  commentRegExp = new RegExp(/\/\/.*/, "g");
  argumentsRegExp = new RegExp(/[^\W][\w\.'-]*(?<=[\w\.])/, "gi");

  constructor(lines: string[]) {
    this.lineStack = lines;
    this.currentLineNumber = 0;
    this.currentCommand = "";
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
      this.currentCommand = line;
    }
  }

  /**
   * Returns a constant representing the type of the current command. C_ARITHMETIC is returned for all arithmetic/logical commands.
   */
  commandType(currentCommand = this.currentCommand): CommandType {
    const command = currentCommand.match(this.argumentsRegExp)[0];
    return this.commandTypesDict[command];
  }

  /**
   * Returns the first argument of the current command. In the case of C_ARITHMETIC, the command itself (add, sub, etc.) is returned. 
   * Should not be called if the current command is C_RETURN.
   */
  arg1(currentCommand = this.currentCommand): string {
    const command = currentCommand.match(this.argumentsRegExp)[1];
    return command || currentCommand.match(this.argumentsRegExp)[0];
  }

  /**
   * Returns the second argument of the current command. 
   * Should be called only if the current command is C_PUSH, C_POP, C_FUNCTION, or C_CALL. 
   */
  arg2(currentCommand = this.currentCommand): number {
    return parseInt(currentCommand.match(this.argumentsRegExp)[2], 10);
  }
}
