import Parser from "./Parser";
import * as fs from "fs";

jest.mock("fs", () => ({
  readFileSync: () => `
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/06/add/Add.asm

// Computes R0 = 2 + 3  (R0 refers to RAM[0])

@2
D=A
@3
D=D+A
@0
M=D
`,
}));

describe("Parser", () => {
  it("instructionType - should be able to determine the type of an instruction", () => {
    const parser = new Parser();

    expect(parser.instructionType("@2")).toEqual(Parser.A_INSTRUCTION);
    expect(parser.instructionType("(LOOP)")).toEqual(Parser.L_INSTRUCTION);
    expect(parser.instructionType("D=M")).toEqual(Parser.C_INSTRUCTION);
  });

  it("advance - should be able to get the next instruction", () => {
    const parser = new Parser();

    expect(parser.lineStack).toHaveLength(15);
    expect(parser.currentInstruction).toEqual("");

    parser.advance();

    expect(parser.lineStack).toHaveLength(6);
    expect(parser.currentInstruction).toEqual("@2");

    parser.advance();

    expect(parser.lineStack).toHaveLength(5);
    expect(parser.currentInstruction).toEqual("D=A");

    parser.advance();

    expect(parser.lineStack).toHaveLength(4);
    expect(parser.currentInstruction).toEqual("@3");

    parser.advance();

    expect(parser.lineStack).toHaveLength(3);
    expect(parser.currentInstruction).toEqual("D=D+A");

    parser.advance();

    expect(parser.lineStack).toHaveLength(2);
    expect(parser.currentInstruction).toEqual("@0");

    parser.advance();

    expect(parser.lineStack).toHaveLength(1);
    expect(parser.currentInstruction).toEqual("M=D");

    parser.advance();

    expect(parser.lineStack).toHaveLength(0);
    expect(parser.currentInstruction).toEqual("M=D");
  });

  it("cInstruction - should determine the C-instruction binary", () => {
    const parser = new Parser();

    expect(parser.cInstruction("D=A")).toEqual("1110110000010000");
    expect(parser.cInstruction("AD=A-D")).toEqual("1110000111110000");
    expect(parser.cInstruction("D=;JGT")).toEqual("1110000000010001");
    expect(parser.cInstruction("D+1;JEQ")).toEqual("1110011111000010");
    expect(parser.cInstruction("M=D+M")).toEqual("1111000010001000");
  });

  it("dest - should determine the dest binary", () => {
    const parser = new Parser();

    expect(parser.dest("D=A")).toEqual("010");
    expect(parser.dest("D=;JGT")).toEqual("010");
    expect(parser.dest("M=D+M")).toEqual("001");
  });

  it("comp - should determine the comp binary", () => {
    const parser = new Parser();

    expect(parser.comp("D=A")).toEqual("0110000");
    expect(parser.comp("D=;JGT")).toEqual("0000000");
    expect(parser.comp("M=D+M")).toEqual("1000010");
  });

  it("jump - should determine the jump binary", () => {
    const parser = new Parser();

    expect(parser.jump("D=A")).toEqual("000");
    expect(parser.jump("D=;JGT")).toEqual("001");
    expect(parser.jump("M=D+M")).toEqual("000");
  });
});
