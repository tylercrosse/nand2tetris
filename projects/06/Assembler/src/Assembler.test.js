import Assembler from "./Assembler";
import * as fs from "fs";

jest.mock("fs", () => ({
  readFileSync: () => ``,
}));

describe('Assembler', () => {
  
})