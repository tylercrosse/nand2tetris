System.register([], function (exports_1, context_1) {
    "use strict";
    var Code;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Translates Hack symbols into their binary codes.
             */
            Code = /** @class */ (function () {
                function Code() {
                    this.compCodes = {
                        // a == 0
                        "0": "0101010",
                        "1": "0111111",
                        "-1": "0111010",
                        D: "0001100",
                        A: "0110000",
                        "!D": "0001101",
                        "!A": "0110001",
                        "-D": "0001111",
                        "-A": "0110011",
                        "D+1": "0011111",
                        "A+1": "0110111",
                        "D-1": "0001110",
                        "A-1": "0110010",
                        "D+A": "0000010",
                        "D-A": "0010011",
                        "A-D": "0000111",
                        "D&A": "0000000",
                        "D|A": "0010101",
                        // a == 1
                        M: "1110000",
                        "!M": "1110001",
                        "-M": "1110011",
                        "M+1": "1110111",
                        "M-1": "1110010",
                        "D+M": "1000010",
                        "D-M": "1010011",
                        "M-D": "1000111",
                        "D&M": "1000000",
                        "D|M": "1010101"
                    };
                    this.destCodes = {
                        "": "000",
                        M: "001",
                        D: "010",
                        DM: "011",
                        A: "100",
                        AM: "101",
                        AD: "110",
                        ADM: "111"
                    };
                    this.jumpCodes = {
                        // "": "000", // no jump
                        JGT: "001",
                        JEQ: "010",
                        JGE: "011",
                        JLT: "100",
                        JNE: "101",
                        JLE: "110",
                        JMP: "111"
                    };
                }
                Code.prototype.comp = function (compCode) {
                    return this.compCodes[compCode] || "0000000";
                };
                Code.prototype.dest = function (destCode) {
                    return this.destCodes[destCode] || "000";
                };
                Code.prototype.jump = function (jumpCode) {
                    return this.jumpCodes[jumpCode] || "000";
                };
                return Code;
            }());
            exports_1("default", Code);
        }
    };
});
//# sourceMappingURL=Code.js.map