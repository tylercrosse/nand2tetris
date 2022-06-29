import CompilationEngine from './CompilationEngine'

describe('CompilationEngine', () => {
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

  test('compileClass', () => {
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

    const engine = new CompilationEngine(input);

    engine.compileClass();
    expect(engine.ast.treeTraverser(engine.ast.root)).toMatchInlineSnapshot(`
"<class>
  <keyword> class </keyword>
  <identifier> Main </identifier>
  <symbol> { </symbol>
  <subroutineDec>
    <keyword> function </keyword>
    <keyword> void </keyword>
    <identifier> main </identifier>
    <symbol> ( </symbol>
    <parameterList>
    </parameterList>
    <symbol> ) </symbol>
    <subroutineBody>
      <symbol> { </symbol>
      <varDec>
        <keyword> var </keyword>
        <identifier> Array </identifier>
        <identifier> a </identifier>
        <symbol> ; </symbol>
      </varDec>
      <varDec>
        <keyword> var </keyword>
        <keyword> int </keyword>
        <identifier> length </identifier>
        <symbol> ; </symbol>
      </varDec>
      <varDec>
        <keyword> var </keyword>
        <keyword> int </keyword>
        <identifier> i </identifier>
        <symbol> , </symbol>
        <identifier> sum </identifier>
        <symbol> ; </symbol>
      </varDec>
      <statements>
        <letStatement>
          <keyword> let </keyword>
          <identifier> length </identifier>
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
                    <stringConstant> HOW MANY NUMBERS?  </stringConstant>
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
        <letStatement>
          <keyword> let </keyword>
          <identifier> i </identifier>
          <symbol> = </symbol>
          <expression>
            <term>
              <integerConstant> 0 </integerConstant>
            </term>
          </expression>
          <symbol> ; </symbol>
        </letStatement>
        <whileStatement>
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
        <letStatement>
          <keyword> let </keyword>
          <identifier> i </identifier>
          <symbol> = </symbol>
          <expression>
            <term>
              <integerConstant> 0 </integerConstant>
            </term>
          </expression>
          <symbol> ; </symbol>
        </letStatement>
        <letStatement>
          <keyword> let </keyword>
          <identifier> sum </identifier>
          <symbol> = </symbol>
          <expression>
            <term>
              <integerConstant> 0 </integerConstant>
            </term>
          </expression>
          <symbol> ; </symbol>
        </letStatement>
        <whileStatement>
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
        <doStatement>
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
        <doStatement>
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
        <doStatement>
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
        <returnStatement>
          <keyword> return </keyword>
          <symbol> ; </symbol>
        </returnStatement>
      </statements>
      <symbol> } </symbol>
    </subroutineBody>
  </subroutineDec>
  <symbol> } </symbol>
</class>
"
`)
  })
})