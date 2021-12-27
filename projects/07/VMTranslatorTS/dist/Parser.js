"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
/**
 * Handles the parsing of a single .vm file
 * reads a VM command, parses the command into its lexical components, and provides convenient access to these components
 * ignores all white space and comments
 */
class Parser {
    constructor(lines) {
        this.commandTypesDict = {
            add: constants_1.C_ARITHMETIC,
            sub: constants_1.C_ARITHMETIC,
            neg: constants_1.C_ARITHMETIC,
            eq: constants_1.C_ARITHMETIC,
            gt: constants_1.C_ARITHMETIC,
            lt: constants_1.C_ARITHMETIC,
            and: constants_1.C_ARITHMETIC,
            or: constants_1.C_ARITHMETIC,
            not: constants_1.C_ARITHMETIC,
            label: constants_1.C_LABEL,
            goto: constants_1.C_GOTO,
            "if-goto": constants_1.C_IF,
            push: constants_1.C_PUSH,
            pop: constants_1.C_POP,
            call: constants_1.C_CALL,
            return: constants_1.C_RETURN,
            function: constants_1.C_FUNCTION,
        };
        this.whitespaceRegExp = new RegExp(/^\s+|\s+$/, "g"); // leading & trailing 
        this.commentRegExp = new RegExp(/\/\/.*/, "g");
        this.argumentsRegExp = new RegExp(/[^\W][\w\.'-]*(?<=[\w\.])/, "gi");
        this.lineStack = lines;
        this.currentLineNumber = 0;
        this.currentCommand = "";
    }
    hasMoreLines() {
        return this.lineStack.length > 0;
    }
    advance() {
        if (!this.hasMoreLines())
            return;
        const line = this.lineStack
            .shift()
            .replace(this.whitespaceRegExp, "")
            .replace(this.commentRegExp, "");
        this.currentLineNumber += 1;
        if (line.length === 0) {
            this.advance();
        }
        else {
            this.currentCommand = line;
        }
    }
    /**
     * Returns a constant representing the type of the current command. C_ARITHMETIC is returned for all
     * arithmetic/logical commands.
     */
    commandType(currentCommand = this.currentCommand) {
        const command = currentCommand.match(this.argumentsRegExp)[0];
        return this.commandTypesDict[command];
    }
    /**
     * Returns the first argument of the current command. In the case of C_ARITHMETIC, the command itself (add, sub, etc.)
     * is returned. Should not be called if the current command is C_RETURN.
     */
    arg1(currentCommand = this.currentCommand) {
        const command = currentCommand.match(this.argumentsRegExp)[1];
        return command || currentCommand.match(this.argumentsRegExp)[0];
    }
    /**
     * Returns the second argument of the current command. Should be called only if the current command is C_PUSH, C_POP,
     * C_FUNCTION, or C_CALL.
     */
    arg2(currentCommand = this.currentCommand) {
        return parseInt(currentCommand.match(this.argumentsRegExp)[2], 10);
    }
}
exports.default = Parser;
//# sourceMappingURL=Parser.js.map