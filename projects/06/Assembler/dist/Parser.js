System.register(["./Code"], function (exports_1, context_1) {
    "use strict";
    var Code_1, Parser;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Code_1_1) {
                Code_1 = Code_1_1;
            }
        ],
        execute: function () {
            Parser = /** @class */ (function () {
                function Parser(lines) {
                    this.whitespaceRegExp = new RegExp(/\s/, "g");
                    this.commentRegExp = new RegExp(/\/\/.*/, "g");
                    this.destRegExp = new RegExp(/=.*/, "g");
                    this.leftHandRegExp = new RegExp(/.*=/, "g");
                    this.rightHandRegExp = new RegExp(/;.*/, "g");
                    this.jumpRegExp = new RegExp(/.*;/, "g");
                    this.code = new Code_1["default"]();
                    this.lineStack = lines;
                    this.currentLineNumber = 0;
                    this.currentInstruction = "";
                }
                Parser.prototype.hasMoreLines = function () {
                    return this.lineStack.length !== 0;
                };
                Parser.prototype.advance = function () {
                    if (!this.hasMoreLines())
                        return;
                    var line = this.lineStack
                        .shift()
                        .replace(this.whitespaceRegExp, "")
                        .replace(this.commentRegExp, "");
                    this.currentLineNumber += 1;
                    if (line.length === 0) {
                        this.advance();
                    }
                    else {
                        this.currentInstruction = line;
                    }
                };
                Parser.prototype.instructionType = function (instruction) {
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
                };
                // symbol(): string {}
                Parser.prototype.cInstruction = function (instruction) {
                    return ("111" +
                        this.comp(instruction) +
                        this.dest(instruction) +
                        this.jump(instruction));
                };
                Parser.prototype.dest = function (instruction) {
                    // dest=comp;jump
                    if (instruction.indexOf("=") === -1)
                        return "000";
                    var destCode = instruction.replace(this.destRegExp, "");
                    return this.code.dest(destCode);
                };
                Parser.prototype.comp = function (instruction) {
                    // dest=comp;jump
                    var compCode = instruction
                        .replace(this.leftHandRegExp, "")
                        .replace(this.rightHandRegExp, "");
                    return this.code.comp(compCode);
                };
                Parser.prototype.jump = function (instruction) {
                    // dest=comp;jump
                    if (instruction.indexOf(";") === -1)
                        return "000";
                    var jumpCode = instruction.replace(this.jumpRegExp, "");
                    return this.code.jump(jumpCode);
                };
                Parser.A_INSTRUCTION = 0;
                Parser.C_INSTRUCTION = 1;
                Parser.L_INSTRUCTION = 2;
                return Parser;
            }());
            exports_1("default", Parser);
        }
    };
});
//# sourceMappingURL=Parser.js.map