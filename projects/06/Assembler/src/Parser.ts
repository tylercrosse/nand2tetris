

enum InstructionType {
  A = "A_INSTRUCTION",
  C = "C_INSTRUCTION",
  L = "L_INSTRUCTION",
} 

/**
 * Encapsulates access to the input assembly code.
 * It provides a convenient means for advancing through the source code, skipping comments and whitespace, and breaking each symbolic instruction into its underlying components.
 */
export default class Parser {
  hasMoreLines(): boolean {}

  advance() {}

  instructionType(): InstructionType {}

  symbol(): string {}
  dest(): string {}
  comp(): string {}
  jump(): string {}

  public static main(): void {}
}
