
// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// eq
@SP
AM=M-1
D=M
A=A-1
D=M-D
@FALSE0
D;JNE
@SP
A=M-1
M=-1
@CONTINUE0
0;JMP
(FALSE0)
@SP
A=M-1
M=0
(CONTINUE0)

// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1

// eq
@SP
AM=M-1
D=M
A=A-1
D=M-D
@FALSE1
D;JNE
@SP
A=M-1
M=-1
@CONTINUE1
0;JMP
(FALSE1)
@SP
A=M-1
M=0
(CONTINUE1)

// push constant 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1

// eq
@SP
AM=M-1
D=M
A=A-1
D=M-D
@FALSE2
D;JNE
@SP
A=M-1
M=-1
@CONTINUE2
0;JMP
(FALSE2)
@SP
A=M-1
M=0
(CONTINUE2)

// push constant 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// lt
@SP
AM=M-1
D=M
A=A-1
D=M-D
@FALSE3
D;JGE
@SP
A=M-1
M=-1
@CONTINUE3
0;JMP
(FALSE3)
@SP
A=M-1
M=0
(CONTINUE3)

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1

// lt
@SP
AM=M-1
D=M
A=A-1
D=M-D
@FALSE4
D;JGE
@SP
A=M-1
M=-1
@CONTINUE4
0;JMP
(FALSE4)
@SP
A=M-1
M=0
(CONTINUE4)

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1

// lt
@SP
AM=M-1
D=M
A=A-1
D=M-D
@FALSE5
D;JGE
@SP
A=M-1
M=-1
@CONTINUE5
0;JMP
(FALSE5)
@SP
A=M-1
M=0
(CONTINUE5)

// push constant 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// gt
@SP
AM=M-1
D=M
A=A-1
D=M-D
@FALSE6
D;JLE
@SP
A=M-1
M=-1
@CONTINUE6
0;JMP
(FALSE6)
@SP
A=M-1
M=0
(CONTINUE6)

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1

// gt
@SP
AM=M-1
D=M
A=A-1
D=M-D
@FALSE7
D;JLE
@SP
A=M-1
M=-1
@CONTINUE7
0;JMP
(FALSE7)
@SP
A=M-1
M=0
(CONTINUE7)

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1

// gt
@SP
AM=M-1
D=M
A=A-1
D=M-D
@FALSE8
D;JLE
@SP
A=M-1
M=-1
@CONTINUE8
0;JMP
(FALSE8)
@SP
A=M-1
M=0
(CONTINUE8)

// push constant 57
@57
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 31
@31
D=A
@SP
A=M
M=D
@SP
M=M+1

// push constant 53
@53
D=A
@SP
A=M
M=D
@SP
M=M+1

// add
@SP
AM=M-1
D=M
A=A-1
M=M+D

// push constant 112
@112
D=A
@SP
A=M
M=D
@SP
M=M+1

// sub
@SP
AM=M-1
D=M
A=A-1
M=M-D

// neg
D=0
@SP
A=M-1
M=D-M

// and
@SP
AM=M-1
D=M
A=A-1
M=M&D

// push constant 82
@82
D=A
@SP
A=M
M=D
@SP
M=M+1

// or
@SP
AM=M-1
D=M
A=A-1
M=M|D

// not
@SP
A=M-1
M=!M
