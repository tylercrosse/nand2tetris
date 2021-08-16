// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

(INIT)
  @8192 // 32 * 256 number of 16 bit pixels to cover the screen
  D=A
  @i
  M=D

(LOOP) 
  @i
  M=M-1 // decrement the index
  D=M
  @INIT // if index < 0 go to INIT to reset it (infinite loop)
  D;JLT 
  
  @KBD // loads the keyboard's address
  D=M
  @WHITE // if (Memory at keybaord address == 0) - no key is pressed go to WHITE
  D;JEQ
  @BLACK // else go to BLACK
  0;JMP

(BLACK)
  @SCREEN //loads the screen's first address - 16384 (0x4000)
  D=A
  @i
  A=D+M // adds the current index to the screen's first address in order to color the current set of 16 pixels
  M=-1 // sets value in current address to black (0b1111111111111111 or 0xFFFF)
  @LOOP // return to the loop
  0;JMP

(WHITE)
  @SCREEN //loads the screen's first address - 16384 (0x4000)
  D=A
  @i
  A=D+M // adds the current index to the screen's first address in order to color the current set of 16 pixels
  M=0 // sets value in current address to white (0b0000000000000000 or 0x0000)
  @LOOP // return to the loop
  0;JMP
