import Assembler from "./Assembler";
import * as fs from "fs";

jest.mock("fs", () => ({
  readFileSync: () => ``,
}));

describe("Assembler", () => {
  it.todo("should process L-instructions on the first pass");
  it.todo("should process C-instructions the second pass");
  it.todo(
    "should process A-instructions and increment the variable index on the second pass"
  );
});
