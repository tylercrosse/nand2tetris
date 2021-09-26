type CodeDict = {
  [code: string]: string
}

/**
 * Translates Hack symbols into their binary codes.
 */
export default class Code {
  compCodes: CodeDict = {
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
    "D|M": "1010101",
  };

  comp(compCode: string): string {
    return this.compCodes[compCode] || "0000000";
  }

  destCodes: CodeDict = {
    "": "000", // null - the value is not stored
    M: "001", // RAM[A]
    D: "010", // D reg
    DM: "011", // D reg & RAM[A]
    MD: "011", // D reg & RAM[A] (handle if the code is reversed)
    A: "100", // A reg
    AM: "101", // A reg & RAM[A]
    AD: "110", // A reg & D reg
    ADM: "111", // A reg, D reg, & RAM[A]
  };

  dest(destCode: string): string {
    return this.destCodes[destCode] || "000";
  }

  jumpCodes: CodeDict = {
    // "": "000", // no jump
    JGT: "001", // if comp > 0 jump
    JEQ: "010", // if comp = 0 jump
    JGE: "011", // if comp >= 0 jump
    JLT: "100", // if comp < 0 jump
    JNE: "101", // if comp != 0 jump
    JLE: "110", // if comp <= 0 jump
    JMP: "111", // unconditional jump
  };

  jump(jumpCode: string): string {
    return this.jumpCodes[jumpCode] || "000";
  }
}
