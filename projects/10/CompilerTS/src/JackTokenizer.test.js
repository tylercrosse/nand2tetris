import JackTokenizer, { TokenTypes } from "./JackTokenizer";

describe("JackTokenizer", () => {
  const input = `
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/10/ArrayTest/Main.jack

// (identical to projects/09/Average/Main.jack)

/** Computes the average of a sequence of integers. */
class Main {
    function void main() {
        var Array a;
        var int length;
        var int i, sum;
  
  let length = Keyboard.readInt("HOW MANY NUMBERS? ");
  let a = Array.new(length);
  let i = 0;
  
  while (i < length) {
      let a[i] = Keyboard.readInt("ENTER THE NEXT NUMBER: ");
      let i = i + 1;
  }
  
  let i = 0;
  let sum = 0;
  
  while (i < length) {
      let sum = sum + a[i];
      let i = i + 1;
  }
  
  do Output.printString("THE AVERAGE IS: ");
  do Output.printInt(sum / length);
  do Output.println();
  
  return;
    }
}
`;

  it("should be able to tokenize a file", () => {
    const tokenizer = new JackTokenizer(input);

    expect(tokenizer.tokens).toHaveLength(140);

    // check some of the output locally
    expect(tokenizer.tokens.slice(0, 7)).toEqual([
      "class",
      "Main",
      "{",
      "function",
      "void",
      "main",
      "(",
    ]);

    // be more exhaustive
    expect(tokenizer.tokens).toMatchSnapshot();
  });

  it("should be able to determine the type of a token", () => {
    const tokenizer = new JackTokenizer(input);

    const types = tokenizer.tokens.map((token) => tokenizer.tokenType(token));

    // check some of the output locally
    expect(types.slice(0, 7)).toEqual([
      TokenTypes.KEYWORD,
      TokenTypes.IDENTIFIER,
      TokenTypes.SYMBOL,
      TokenTypes.KEYWORD,
      TokenTypes.IDENTIFIER,
      TokenTypes.IDENTIFIER,
      TokenTypes.SYMBOL,
    ]);

    // be more exhaustive
    expect(types).toMatchSnapshot();
  });

  it("should be able to match symbols", () => {
    const tokenizer = new JackTokenizer("");
    const symbols = [
      "{",
      "}",
      "(",
      ")",
      "[",
      "]",
      ".",
      ",",
      ";",
      "+",
      "-",
      "*",
      "/",
      "&",
      "|",
      "<",
      ">",
      "=",
      "~",
    ];
    expect(symbols.every((sym) => tokenizer.tokenType(sym))).toEqual(true);
  });
});
