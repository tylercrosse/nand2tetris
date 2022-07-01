import CompilationEngine from './CompilationEngine'

describe('CompilationEngine', () => {
  test('compileSubroutine method', () => {
    const input1 = `
    method void dispose() {
      do square.dispose();
      do Memory.deAlloc(square);
      return;
    }
    `;
    const engine = new CompilationEngine(input1);
    engine.compileSubroutine()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<subroutineDec>
  <keyword> method </keyword>
  <keyword> void </keyword>
  <identifier> dispose </identifier>
  <symbol> ( </symbol>
  <parameterList>
  </parameterList>
  <symbol> ) </symbol>
  <subroutineBody>
    <symbol> { </symbol>
    <statements>
      <doStatement>
        <keyword> do </keyword>
        <identifier> square </identifier>
        <symbol> . </symbol>
        <identifier> dispose </identifier>
        <symbol> ( </symbol>
        <expressionList>
        </expressionList>
        <symbol> ) </symbol>
        <symbol> ; </symbol>
      </doStatement>
      <doStatement>
        <keyword> do </keyword>
        <identifier> Memory </identifier>
        <symbol> . </symbol>
        <identifier> deAlloc </identifier>
        <symbol> ( </symbol>
        <expressionList>
          <expression>
            <term>
              <identifier> square </identifier>
            </term>
          </expression>
        </expressionList>
        <symbol> ) </symbol>
        <symbol> ; </symbol>
      </doStatement>
      <returnStatement>
        <keyword> return </keyword>
        <symbol> ; </symbol>
      </returnStatement>
    </statements>
    <symbol> } </symbol>
  </subroutineBody>
</subroutineDec>
"
`);
  });
  
  test('compileSubroutine constructor', () => {
    const input2 = `
    constructor SquareGame new() {
      let square = square;
      let direction = direction;
      return square;
    }
    `;
    const engine = new CompilationEngine(input2);
    engine.compileSubroutine()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<subroutineDec>
  <keyword> constructor </keyword>
  <identifier> SquareGame </identifier>
  <identifier> new </identifier>
  <symbol> ( </symbol>
  <parameterList>
  </parameterList>
  <symbol> ) </symbol>
  <subroutineBody>
    <symbol> { </symbol>
    <statements>
      <letStatement>
        <keyword> let </keyword>
        <identifier> square </identifier>
        <symbol> = </symbol>
        <expression>
          <term>
            <identifier> square </identifier>
          </term>
        </expression>
        <symbol> ; </symbol>
      </letStatement>
      <letStatement>
        <keyword> let </keyword>
        <identifier> direction </identifier>
        <symbol> = </symbol>
        <expression>
          <term>
            <identifier> direction </identifier>
          </term>
        </expression>
        <symbol> ; </symbol>
      </letStatement>
      <returnStatement>
        <keyword> return </keyword>
        <expression>
          <term>
            <identifier> square </identifier>
          </term>
        </expression>
        <symbol> ; </symbol>
      </returnStatement>
    </statements>
    <symbol> } </symbol>
  </subroutineBody>
</subroutineDec>
"
`);
  })
  
  test('compileExpression', () => {
    let engine = new CompilationEngine(`i < length`);
    engine.compileExpression()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<expression>
  <term>
    <identifier> i </identifier>
  </term>
  <symbol> &lt; </symbol>
  <term>
    <identifier> length </identifier>
  </term>
</expression>
"
`);

    engine = new CompilationEngine(`i * (-j);`);
    engine.compileExpression()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<expression>
  <term>
    <identifier> i </identifier>
  </term>
  <symbol> * </symbol>
  <term>
    <symbol> ( </symbol>
    <expression>
      <term>
        <symbol> - </symbol>
        <term>
          <identifier> j </identifier>
        </term>
      </term>
    </expression>
    <symbol> ) </symbol>
  </term>
</expression>
"
`);

  engine = new CompilationEngine(`Square.new(0, 0, 30)`);
  engine.compileExpression()
  expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<expression>
  <term>
    <identifier> Square </identifier>
    <symbol> . </symbol>
    <identifier> new </identifier>
    <symbol> ( </symbol>
    <expressionList>
      <expression>
        <term>
          <integerConstant> 0 </integerConstant>
        </term>
      </expression>
      <symbol> , </symbol>
      <expression>
        <term>
          <integerConstant> 0 </integerConstant>
        </term>
      </expression>
      <symbol> , </symbol>
      <expression>
        <term>
          <integerConstant> 30 </integerConstant>
        </term>
      </expression>
    </expressionList>
    <symbol> ) </symbol>
  </term>
</expression>
"
`);
  })
  
  test('compileTerm', () => {
    let engine = new CompilationEngine(`0`);
    engine.compileTerm()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<term>
  <integerConstant> 0 </integerConstant>
</term>
"
`);

    engine = new CompilationEngine(`Array.new(length);`);
    engine.compileTerm()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<term>
  <identifier> Array </identifier>
  <symbol> . </symbol>
  <identifier> new </identifier>
  <symbol> ( </symbol>
  <expressionList>
    <expression>
      <term>
        <identifier> length </identifier>
      </term>
    </expression>
  </expressionList>
  <symbol> ) </symbol>
</term>
"
`);

    engine = new CompilationEngine(`Keyboard.readInt("HOW MANY NUMBERS? ");`);
    engine.compileTerm()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<term>
  <identifier> Keyboard </identifier>
  <symbol> . </symbol>
  <identifier> readInt </identifier>
  <symbol> ( </symbol>
  <expressionList>
    <expression>
      <term>
        <stringConstant> HOW MANY NUMBERS?  </stringConstant>
      </term>
    </expression>
  </expressionList>
  <symbol> ) </symbol>
</term>
"
`);
  })

  test('compileLet', () => {
    let engine = new CompilationEngine(`let a = Array.new(length);`);
    engine.compileLet()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<letStatement>
  <keyword> let </keyword>
  <identifier> a </identifier>
  <symbol> = </symbol>
  <expression>
    <term>
      <identifier> Array </identifier>
      <symbol> . </symbol>
      <identifier> new </identifier>
      <symbol> ( </symbol>
      <expressionList>
        <expression>
          <term>
            <identifier> length </identifier>
          </term>
        </expression>
      </expressionList>
      <symbol> ) </symbol>
    </term>
  </expression>
  <symbol> ; </symbol>
</letStatement>
"
`);
    
    engine = new CompilationEngine(`let sum = sum + a[i];`);
    engine.compileLet()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<letStatement>
  <keyword> let </keyword>
  <identifier> sum </identifier>
  <symbol> = </symbol>
  <expression>
    <term>
      <identifier> sum </identifier>
    </term>
    <symbol> + </symbol>
    <term>
      <identifier> a </identifier>
      <symbol> [ </symbol>
      <expression>
        <term>
          <identifier> i </identifier>
        </term>
      </expression>
      <symbol> ] </symbol>
    </term>
  </expression>
  <symbol> ; </symbol>
</letStatement>
"
`);
    
    engine = new CompilationEngine(`let a[i] = Keyboard.readInt("ENTER THE NEXT NUMBER: ");`);
    engine.compileLet()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<letStatement>
  <keyword> let </keyword>
  <identifier> a </identifier>
  <symbol> [ </symbol>
  <expression>
    <term>
      <identifier> i </identifier>
    </term>
  </expression>
  <symbol> ] </symbol>
  <symbol> = </symbol>
  <expression>
    <term>
      <identifier> Keyboard </identifier>
      <symbol> . </symbol>
      <identifier> readInt </identifier>
      <symbol> ( </symbol>
      <expressionList>
        <expression>
          <term>
            <stringConstant> ENTER THE NEXT NUMBER:  </stringConstant>
          </term>
        </expression>
      </expressionList>
      <symbol> ) </symbol>
    </term>
  </expression>
  <symbol> ; </symbol>
</letStatement>
"
`);
  });

  test('compileIf', () => {
    let engine = new CompilationEngine(`if (direction) { do square.moveUp(); }`);
    engine.compileIf()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<ifStatement>
  <keyword> if </keyword>
  <symbol> ( </symbol>
  <expression>
    <term>
      <identifier> direction </identifier>
    </term>
  </expression>
  <symbol> ) </symbol>
  <symbol> { </symbol>
  <statements>
    <doStatement>
      <keyword> do </keyword>
      <identifier> square </identifier>
      <symbol> . </symbol>
      <identifier> moveUp </identifier>
      <symbol> ( </symbol>
      <expressionList>
      </expressionList>
      <symbol> ) </symbol>
      <symbol> ; </symbol>
    </doStatement>
  </statements>
  <symbol> } </symbol>
</ifStatement>
"
`);
  });

  test('compileIfElse', () => {
    const input2 = `
    if (false) {
      let s = "string constant";
      let s = null;
      let a[1] = a[2];
    }
    else {              // There is no else keyword in the Square files.
      let i = i * (-j);
      let j = j / (-2);   // note: unary negate constant 2
      let i = i | j;
    }
    `;

    const engine = new CompilationEngine(input2);
    engine.compileIf()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<ifStatement>
  <keyword> if </keyword>
  <symbol> ( </symbol>
  <expression>
    <term>
      <keyword> false </keyword>
    </term>
  </expression>
  <symbol> ) </symbol>
  <symbol> { </symbol>
  <statements>
    <letStatement>
      <keyword> let </keyword>
      <identifier> s </identifier>
      <symbol> = </symbol>
      <expression>
        <term>
          <stringConstant> string constant </stringConstant>
        </term>
      </expression>
      <symbol> ; </symbol>
    </letStatement>
    <letStatement>
      <keyword> let </keyword>
      <identifier> s </identifier>
      <symbol> = </symbol>
      <expression>
        <term>
          <keyword> null </keyword>
        </term>
      </expression>
      <symbol> ; </symbol>
    </letStatement>
    <letStatement>
      <keyword> let </keyword>
      <identifier> a </identifier>
      <symbol> [ </symbol>
      <expression>
        <term>
          <integerConstant> 1 </integerConstant>
        </term>
      </expression>
      <symbol> ] </symbol>
      <symbol> = </symbol>
      <expression>
        <term>
          <identifier> a </identifier>
          <symbol> [ </symbol>
          <expression>
            <term>
              <integerConstant> 2 </integerConstant>
            </term>
          </expression>
          <symbol> ] </symbol>
        </term>
      </expression>
      <symbol> ; </symbol>
    </letStatement>
  </statements>
  <symbol> } </symbol>
  <keyword> else </keyword>
  <symbol> { </symbol>
  <statements>
    <letStatement>
      <keyword> let </keyword>
      <identifier> i </identifier>
      <symbol> = </symbol>
      <expression>
        <term>
          <identifier> i </identifier>
        </term>
        <symbol> * </symbol>
        <term>
          <symbol> ( </symbol>
          <expression>
            <term>
              <symbol> - </symbol>
              <term>
                <identifier> j </identifier>
              </term>
            </term>
          </expression>
          <symbol> ) </symbol>
        </term>
      </expression>
      <symbol> ; </symbol>
    </letStatement>
    <letStatement>
      <keyword> let </keyword>
      <identifier> j </identifier>
      <symbol> = </symbol>
      <expression>
        <term>
          <identifier> j </identifier>
        </term>
        <symbol> / </symbol>
        <term>
          <symbol> ( </symbol>
          <expression>
            <term>
              <symbol> - </symbol>
              <term>
                <integerConstant> 2 </integerConstant>
              </term>
            </term>
          </expression>
          <symbol> ) </symbol>
        </term>
      </expression>
      <symbol> ; </symbol>
    </letStatement>
    <letStatement>
      <keyword> let </keyword>
      <identifier> i </identifier>
      <symbol> = </symbol>
      <expression>
        <term>
          <identifier> i </identifier>
        </term>
        <symbol> | </symbol>
        <term>
          <identifier> j </identifier>
        </term>
      </expression>
      <symbol> ; </symbol>
    </letStatement>
  </statements>
  <symbol> } </symbol>
</ifStatement>
"
`);
  });

  test('compileWhile', () => {
    const input = `while (i < length) {
    let a[i] = Keyboard.readInt("ENTER THE NEXT NUMBER: ");
    let i = i + 1;
}`
    let engine = new CompilationEngine(input);
    engine.compileWhile()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<whileStatement>
  <keyword> while </keyword>
  <symbol> ( </symbol>
  <expression>
    <term>
      <identifier> i </identifier>
    </term>
    <symbol> &lt; </symbol>
    <term>
      <identifier> length </identifier>
    </term>
  </expression>
  <symbol> ) </symbol>
  <symbol> { </symbol>
  <statements>
    <letStatement>
      <keyword> let </keyword>
      <identifier> a </identifier>
      <symbol> [ </symbol>
      <expression>
        <term>
          <identifier> i </identifier>
        </term>
      </expression>
      <symbol> ] </symbol>
      <symbol> = </symbol>
      <expression>
        <term>
          <identifier> Keyboard </identifier>
          <symbol> . </symbol>
          <identifier> readInt </identifier>
          <symbol> ( </symbol>
          <expressionList>
            <expression>
              <term>
                <stringConstant> ENTER THE NEXT NUMBER:  </stringConstant>
              </term>
            </expression>
          </expressionList>
          <symbol> ) </symbol>
        </term>
      </expression>
      <symbol> ; </symbol>
    </letStatement>
    <letStatement>
      <keyword> let </keyword>
      <identifier> i </identifier>
      <symbol> = </symbol>
      <expression>
        <term>
          <identifier> i </identifier>
        </term>
        <symbol> + </symbol>
        <term>
          <integerConstant> 1 </integerConstant>
        </term>
      </expression>
      <symbol> ; </symbol>
    </letStatement>
  </statements>
  <symbol> } </symbol>
</whileStatement>
"
`);
  })

  test('compileDo', () => {
    let engine = new CompilationEngine(`do Output.println();`);
    engine.compileDo()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<doStatement>
  <keyword> do </keyword>
  <identifier> Output </identifier>
  <symbol> . </symbol>
  <identifier> println </identifier>
  <symbol> ( </symbol>
  <expressionList>
  </expressionList>
  <symbol> ) </symbol>
  <symbol> ; </symbol>
</doStatement>
"
`);
    
    engine = new CompilationEngine(`do Output.printString("THE AVERAGE IS: ");`);
    engine.compileDo()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<doStatement>
  <keyword> do </keyword>
  <identifier> Output </identifier>
  <symbol> . </symbol>
  <identifier> printString </identifier>
  <symbol> ( </symbol>
  <expressionList>
    <expression>
      <term>
        <stringConstant> THE AVERAGE IS:  </stringConstant>
      </term>
    </expression>
  </expressionList>
  <symbol> ) </symbol>
  <symbol> ; </symbol>
</doStatement>
"
`)
    
    engine = new CompilationEngine(`do Output.printInt(sum / length);`);
    engine.compileDo()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<doStatement>
  <keyword> do </keyword>
  <identifier> Output </identifier>
  <symbol> . </symbol>
  <identifier> printInt </identifier>
  <symbol> ( </symbol>
  <expressionList>
    <expression>
      <term>
        <identifier> sum </identifier>
      </term>
      <symbol> / </symbol>
      <term>
        <identifier> length </identifier>
      </term>
    </expression>
  </expressionList>
  <symbol> ) </symbol>
  <symbol> ; </symbol>
</doStatement>
"
`)
  });

  test('compileClassVarDec', () => {
    let engine = new CompilationEngine(`field Square square;`);
    engine.compileClassVarDec()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<classVarDec>
  <keyword> field </keyword>
  <identifier> Square </identifier>
  <identifier> square </identifier>
  <symbol> ; </symbol>
</classVarDec>
"
`);

    engine = new CompilationEngine(`field int direction;`);
    engine.compileClassVarDec()
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<classVarDec>
  <keyword> field </keyword>
  <keyword> int </keyword>
  <identifier> direction </identifier>
  <symbol> ; </symbol>
</classVarDec>
"
`);
  })

  test('compileClass ArrayTest', () => {
    const input1 = `
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

    const engine = new CompilationEngine(input1);
    engine.compileClass();
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchSnapshot('ArrayTest/Main.jack')
  });

  test('compileClass ExpressionLessSquare', () => {
    const input2 = `
    // This file is part of www.nand2tetris.org
    // and the book "The Elements of Computing Systems"
    // by Nisan and Schocken, MIT Press.
    // File name: projects/10/ExpressionLessSquare/SquareGame.jack
    
    /** Expressionless version of projects/10/Square/SquareGame.jack. */
    
    class SquareGame {
       field Square square; 
       field int direction; 
    
       constructor SquareGame new() {
          let square = square;
          let direction = direction;
          return square;
       }
    
       method void dispose() {
          do square.dispose();
          do Memory.deAlloc(square);
          return;
       }
    
       method void moveSquare() {
          if (direction) { do square.moveUp(); }
          if (direction) { do square.moveDown(); }
          if (direction) { do square.moveLeft(); }
          if (direction) { do square.moveRight(); }
          do Sys.wait(direction);
          return;
       }
    
       method void run() {
          var char key;
          var boolean exit;
          
          let exit = key;
          while (exit) {
             while (key) {
                let key = key;
                do moveSquare();
             }
    
             if (key) { let exit = exit; }
             if (key) { do square.decSize(); }
             if (key) { do square.incSize(); }
             if (key) { let direction = exit; }
             if (key) { let direction = key; }
             if (key) { let direction = square; }
             if (key) { let direction = direction; }
    
             while (key) {
                let key = key;
                do moveSquare();
             }
          }
          return;
        }
    }
    `

    const engine = new CompilationEngine(input2);
    engine.compileClass();
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchSnapshot('ExpressionLessSquare/SquareGame.jack')
  });

  test('compileClass SquareGame', () => {
    const input3 = `
    // This file is part of www.nand2tetris.org
    // and the book "The Elements of Computing Systems"
    // by Nisan and Schocken, MIT Press.
    // File name: projects/10/Square/SquareGame.jack
    
    // (same as projects/09/Square/SquareGame.jack)
    
    /**
     * Implements the Square Dance game.
     * This simple game allows the user to move a black square around
     * the screen, and change the square's size during the movement.
     * When the game starts, a square of 30 by 30 pixels is shown at the
     * top-left corner of the screen. The user controls the square as follows.
     * The 4 arrow keys are used to move the square up, down, left, and right.
     * The 'z' and 'x' keys are used, respectively, to decrement and increment
     * the square's size. The 'q' key is used to quit the game.
     */
    
    class SquareGame {
      field Square square; // the square of this game
      field int direction; // the square's current direction: 
                           // 0=none, 1=up, 2=down, 3=left, 4=right
   
      /** Constructs a new Square Game. */
      constructor SquareGame new() {
         // Creates a 30 by 30 pixels square and positions it at the top-left
         // of the screen.
         let square = Square.new(0, 0, 30);
         let direction = 0;  // initial state is no movement
         return this;
      }
   
      /** Disposes this game. */
      method void dispose() {
         do square.dispose();
         do Memory.deAlloc(this);
         return;
      }
   
      /** Moves the square in the current direction. */
      method void moveSquare() {
         if (direction = 1) { do square.moveUp(); }
         if (direction = 2) { do square.moveDown(); }
         if (direction = 3) { do square.moveLeft(); }
         if (direction = 4) { do square.moveRight(); }
         do Sys.wait(5);  // delays the next movement
         return;
      }
   
      /** Runs the game: handles the user's inputs and moves the square accordingly */
      method void run() {
         var char key;  // the key currently pressed by the user
         var boolean exit;
         let exit = false;
         
         while (~exit) {
            // waits for a key to be pressed
            while (key = 0) {
               let key = Keyboard.keyPressed();
               do moveSquare();
            }
            if (key = 81)  { let exit = true; }     // q key
            if (key = 90)  { do square.decSize(); } // z key
            if (key = 88)  { do square.incSize(); } // x key
            if (key = 131) { let direction = 1; }   // up arrow
            if (key = 133) { let direction = 2; }   // down arrow
            if (key = 130) { let direction = 3; }   // left arrow
            if (key = 132) { let direction = 4; }   // right arrow
   
            // waits for the key to be released
            // while (~(key = 0)) {
            //    let key = Keyboard.keyPressed();
            //    do moveSquare();
            // }
        } // while
        return;
       }
    }
    `

    const engine = new CompilationEngine(input3);
    engine.compileClass();
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchSnapshot('Square/SquareGame.jack')
  })
})