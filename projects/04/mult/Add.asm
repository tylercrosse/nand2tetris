// Program: Add.asm
// Computes: Ram [2] = Ram[0] + Ram[1] + 17
// Usage: put values in Ram[0] and in Ram[1]
  // D = Ram[0]
  @R0
  D=M
  // D = D + Ram[1]
  @R1
  D=D+M
  // D = D + 17
  @17
  D=D+A
  // Ram[2] = D
  @R2
  M=D
(END)
  @END
  0;JMP