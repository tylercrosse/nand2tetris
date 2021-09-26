import * as fs from 'fs';


/**
 * 
 */
export default class Assembler {
  constructor() {
    // construct an empty symbol table
    // add the pre-defined symbols to the symbol table
  }

  firstPass() {
    // scan the entire program
    // for each "instruction" of the form (xxx):
      // add the pair (xxx, address) to the symbol table,
      // where address is the number of the instruction following (xxx)
  }

  secondPass() {
    // set n to 16
    // scan the entire program again; for each instruction:
      // if the instruction is @symbol, look up symbol in the symbol table;
        // if (symbol, value) is found, use value to complete the instructions translation;
        // if not found:
          // add (symbol, n) to the symbol table,
          // use n to complete the instruction's translation,
          // n++
      // if the instruction is a c-instruction, complete the instruction's translation
      // write the translated instruction to the output file.
  }

  static main(): void {

  }
}
