import { nextTick } from "process";
import AST, { ASTNode } from "./AST";
import JackTokenizer, { TokenTypes, KeyWordTypes } from "./JackTokenizer";

class CompilationError extends Error {
  constructor(message: string, ...args: any[]) {
    super(...args);
  }
}

/**
 * Recursive top-down parser for Jack language.
 */
export default class CompilationEngine {
  ast: AST;
  tokenizer: JackTokenizer;
  currentParent: ASTNode;

  constructor(input: string) {
    this.ast = new AST();
    this.tokenizer = new JackTokenizer(input);
  }

  private addHelper(tokenType: string): void {
    this.tokenizer.advance();
    if (this.tokenizer.tokenType() !== tokenType) {
      // throw new CompilationError(nodeType);
    }
    this.ast.addChild(
      new ASTNode(tokenType, this.tokenizer.currentToken),
      this.currentParent
    );
  }

  private complileTypeHelper(): void {
    const nextTok = this.tokenizer.peekNextToken();

    if (
      nextTok === KeyWordTypes.INT ||
      nextTok === KeyWordTypes.CHAR ||
      nextTok === KeyWordTypes.BOOLEAN ||
      nextTok === KeyWordTypes.VOID
    ) {
      this.addHelper(TokenTypes.KEYWORD);
    }

    if (this.tokenizer.tokenType(nextTok) === TokenTypes.IDENTIFIER) {
      this.addHelper(TokenTypes.IDENTIFIER);
    }
  }

  /**
   * Compiles a complete class
   */
  compileClass(): void {
    this.tokenizer.advance();

    if (this.tokenizer.currentToken !== KeyWordTypes.CLASS) {
      throw new CompilationError("class");
    }
    this.currentParent = new ASTNode("class");
    this.ast.addChild(this.currentParent);
    this.ast.addChild(new ASTNode("keyword", "class"));

    this.addHelper(TokenTypes.IDENTIFIER);
    this.addHelper(TokenTypes.SYMBOL); // {

    this.compileClassVarDec();
    this.compileSubroutine();

    this.addHelper(TokenTypes.SYMBOL); // }
  }

  /**
   * Compiles a static variable declaration, or a field declaration
   */
  compileClassVarDec(): void {
    const prevParent = this.currentParent;

    // end of variable declariation - base case
    const nextTok = this.tokenizer.peekNextToken();
    if (nextTok !== KeyWordTypes.STATIC && nextTok !== KeyWordTypes.FIELD) {
      return;
    }

    this.currentParent = new ASTNode("classVarDec");
    this.ast.addChild(this.currentParent, prevParent);
    this.addHelper(TokenTypes.KEYWORD); // field or static

    this.complileTypeHelper();

    do {
      if (this.tokenizer.peekNextToken() === ";") {
        this.addHelper(TokenTypes.SYMBOL); // ;
        break;
      } else if (this.tokenizer.peekNextToken() === ",") {
        this.addHelper(TokenTypes.SYMBOL); // ,
      }
      this.addHelper(TokenTypes.IDENTIFIER);
    } while (true);

    this.currentParent = prevParent;

    // recurse
    this.compileClassVarDec();
  }

  /**
   * Compiles a complete method, function, or constructor
   */
  compileSubroutine(): void {
    const prevParent = this.currentParent;

    // end of subroutine - base case
    const nextTok = this.tokenizer.peekNextToken();
    if (
      nextTok === "}" ||
      (nextTok !== KeyWordTypes.METHOD &&
        nextTok !== KeyWordTypes.FUNCTION &&
        nextTok !== KeyWordTypes.CONSTRUCTOR)
    ) {
      return;
    }

    this.currentParent = new ASTNode("subroutineDec");
    this.ast.addChild(this.currentParent);
    this.addHelper(TokenTypes.KEYWORD); // method | function | constructor

    this.complileTypeHelper();
    this.addHelper(TokenTypes.IDENTIFIER); // subroutine name
    this.addHelper(TokenTypes.SYMBOL); // (

    this.compileParameterList();

    this.addHelper(TokenTypes.SYMBOL); // )

    this.compileSubroutineBody();
    this.currentParent = prevParent;

    // recurse
    this.compileSubroutine();
  }

  /**
   * Compiles a (possibly empty) parameter list, not including the enclosing "()"
   */
  compileParameterList(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("parameterList");
    this.ast.addChild(this.currentParent, prevParent);

    do {
      if (this.tokenizer.peekNextToken() === ")") break;
      
      this.complileTypeHelper();
      this.addHelper(TokenTypes.IDENTIFIER); // parameter name
      
      if (this.tokenizer.peekNextToken() === ",") {
        this.addHelper(TokenTypes.SYMBOL); // ,
      }
    } while (true);

    this.currentParent = prevParent;
  }

  /**
   * Compiles a subroutine's body
   */
  compileSubroutineBody(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("subroutineBody");
    this.ast.addChild(this.currentParent, prevParent);

    this.addHelper(TokenTypes.SYMBOL); // {

    this.compileVarDec();
    this.compileStatements();

    this.addHelper(TokenTypes.SYMBOL); // }

    this.currentParent = prevParent;
  }

  /**
   * Compiles a `var` declaration
   */
  compileVarDec(): void {
    if (this.tokenizer.peekNextToken() !== KeyWordTypes.VAR) return;

    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("varDec");
    this.ast.addChild(this.currentParent, prevParent);

    this.addHelper(TokenTypes.KEYWORD); // var
    this.complileTypeHelper(); // var type

    do {
      this.addHelper(TokenTypes.IDENTIFIER); // var name
      this.tokenizer.advance();
      if (this.tokenizer.currentToken === ",") {
        this.ast.addChild(new ASTNode("symbol", ","), this.currentParent);
      } else {
        this.ast.addChild(new ASTNode("symbol", ";"), this.currentParent);
        break;
      }
    } while (true);

    this.currentParent = prevParent;

    this.compileVarDec();
  }

  /**
   * Compiles a sequence of statements, not including the enclosing "{}".
   */
  compileStatements(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("statements");
    this.ast.addChild(this.currentParent, prevParent);

    this.compileStatement();

    this.currentParent = prevParent;
  }

  /**
   * Compiles a single
   */
  compileStatement(): void {
    if (this.tokenizer.peekNextToken() === "}") {
      return;
    }

    switch (this.tokenizer.peekNextToken()) {
      case KeyWordTypes.LET:
        this.compileLet();
        break;
      case KeyWordTypes.IF:
        this.compileIf();
        break;
      case KeyWordTypes.WHILE:
        this.compileWhile();
        break;
      case KeyWordTypes.DO:
        this.compileDo();
        break;
      case KeyWordTypes.RETURN:
        this.compileReturn();
        break;
      default:
      // throw new CompilationError('let|if|while|do|return'); // TODO
    }
    this.compileStatement();
  }

  /**
   * Compiles a `let` statement
   */
  compileLet(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("letStatement");
    this.ast.addChild(this.currentParent, prevParent);

    this.addHelper(TokenTypes.KEYWORD); // let
    this.addHelper(TokenTypes.IDENTIFIER); // var name

    if (this.tokenizer.peekNextToken() === "[") {
      this.addHelper(TokenTypes.SYMBOL); // [
      this.compileExpression();
      this.addHelper(TokenTypes.SYMBOL); // ]
    }

    this.addHelper(TokenTypes.SYMBOL); // =

    this.compileExpression();

    this.addHelper(TokenTypes.SYMBOL); // ;

    this.currentParent = prevParent;
  }

  /**
   * Compiles an `if` statement, possibly with a `else` clause
   */
  compileIf(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("ifStatement");
    this.ast.addChild(this.currentParent, prevParent);

    this.addHelper(TokenTypes.KEYWORD); // if
    this.addHelper(TokenTypes.SYMBOL); // (
    this.compileExpression();
    this.addHelper(TokenTypes.SYMBOL); // )
    this.addHelper(TokenTypes.SYMBOL); // {
    this.compileStatements();
    this.addHelper(TokenTypes.SYMBOL); // }

    if (this.tokenizer.peekNextToken() === KeyWordTypes.ELSE) {
      this.addHelper(TokenTypes.KEYWORD); // else
      this.addHelper(TokenTypes.SYMBOL); // {
      this.compileStatements();
      this.addHelper(TokenTypes.SYMBOL); // }
    }

    this.currentParent = prevParent;
  }

  /**
   * Compiles a `while` statement
   */
  compileWhile(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("whileStatement");
    this.ast.addChild(this.currentParent, prevParent);

    this.addHelper(TokenTypes.KEYWORD); // while
    this.addHelper(TokenTypes.SYMBOL); // (

    this.compileExpression();

    this.addHelper(TokenTypes.SYMBOL); // )
    this.addHelper(TokenTypes.SYMBOL); // {

    this.compileStatements();

    this.addHelper(TokenTypes.SYMBOL); // }

    this.currentParent = prevParent;
  }

  /**
   * Compiles a `do` statement
   */
  compileDo(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("doStatement");
    this.ast.addChild(this.currentParent, prevParent);

    this.addHelper(TokenTypes.KEYWORD); // do
    this.addHelper(TokenTypes.IDENTIFIER); // name

    if (this.tokenizer.peekNextToken() === ".") {
      this.addHelper(TokenTypes.SYMBOL); // .
      this.addHelper(TokenTypes.IDENTIFIER); // name after .
    }

    this.addHelper(TokenTypes.SYMBOL); // (

    this.compileExpressionList();

    this.addHelper(TokenTypes.SYMBOL); // )
    this.addHelper(TokenTypes.SYMBOL); // ;

    this.currentParent = prevParent;
  }

  /**
   * Compiles a `return` statement
   */
  compileReturn(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("returnStatement");
    this.ast.addChild(this.currentParent, prevParent);

    this.addHelper(TokenTypes.KEYWORD); // return

    if (this.tokenizer.peekNextToken() !== ";") {
      this.compileExpression();
    }
    this.addHelper(TokenTypes.SYMBOL); // ;

    this.currentParent = prevParent;
  }

  /**
   * Compiles an expression
   */
  compileExpression(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("expression");
    this.ast.addChild(this.currentParent, prevParent);

    this.compileTerm();

    do {
      const nextTok = this.tokenizer.peekNextToken();
      if (
        nextTok === "=" ||
        nextTok === ">" ||
        nextTok === "<" ||
        nextTok === "&" ||
        nextTok === "|" ||
        nextTok === "+" ||
        nextTok === "-" ||
        nextTok === "*" ||
        nextTok === "~" ||
        nextTok === "/"
      ) {
        if (nextTok === ">") {
          this.tokenizer.advance();
          this.ast.addChild(new ASTNode("symbol", "&gt;"), this.currentParent);
        } else if (nextTok === "<") {
          this.tokenizer.advance();
          this.ast.addChild(new ASTNode("symbol", "&lt;"), this.currentParent);
        } else if (nextTok === "&") {
          this.tokenizer.advance();
          this.ast.addChild(new ASTNode("symbol", "&amp;"), this.currentParent);
        } else {
          this.addHelper(TokenTypes.SYMBOL);
        }
        this.compileTerm();
      } else {
        break;
      }
    } while (true);

    this.currentParent = prevParent;
  }

  /**
   * Compiles a term. If the current token is an identifier, the routine must
   * distinguish between a variable, an array entry, and a subroutine call. A
   * single look-ahead token, which may be one of "[", ".", or "(" suffices to
   * distinguish between the three possibilities. Any other token is not part of
   * this term and should not be advanced over.
   */
  compileTerm(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("term");
    this.ast.addChild(this.currentParent, prevParent);

    let nextTok = this.tokenizer.peekNextToken();
    let nextTokType = this.tokenizer.tokenType(nextTok);

    // (
    if (nextTok === "(") {
      this.addHelper(TokenTypes.SYMBOL); // (
      this.compileExpression();
      this.addHelper(TokenTypes.SYMBOL); // )
    }

    if (nextTokType === TokenTypes.IDENTIFIER) {
      this.addHelper(TokenTypes.IDENTIFIER);

      nextTok = this.tokenizer.peekNextToken();
      nextTokType = this.tokenizer.tokenType(nextTok);

      // .
      if (nextTok === ".") {
        this.addHelper(TokenTypes.SYMBOL); // .
        this.addHelper(TokenTypes.IDENTIFIER); // name after .
        this.addHelper(TokenTypes.SYMBOL); // (
        this.compileExpressionList();
        this.addHelper(TokenTypes.SYMBOL); // )
      }

      // [
      if (nextTok === "[") {
        this.addHelper(TokenTypes.SYMBOL); // [
        this.compileExpression();
        this.addHelper(TokenTypes.SYMBOL); // ]
      }
    } else if (nextTokType === TokenTypes.INT_CONST) {
      this.addHelper(TokenTypes.INT_CONST);
    } else if (nextTokType === TokenTypes.STRING_CONST) {
      this.tokenizer.advance();
      this.ast.addChild(
        new ASTNode(
          "stringConstant",
          this.tokenizer.currentToken.replace(/^\"|\"$/g, "") // remove quotes
        ),
        this.currentParent
      );
    } else if (
      nextTok === KeyWordTypes.TRUE ||
      nextTok === KeyWordTypes.FALSE ||
      nextTok === KeyWordTypes.NULL ||
      nextTok === KeyWordTypes.THIS
    ) {
      this.addHelper(TokenTypes.KEYWORD);
    } else if (nextTok === "-" || nextTok === "~") { // unary
      this.addHelper(TokenTypes.SYMBOL); // - or ~
      this.compileTerm();
    }

    this.currentParent = prevParent;
  }

  /**
   * Compiles a (possibly empty) comma-separated list of expressions. Returns the number of expressions in the list.
   */
  compileExpressionList(): number {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("expressionList");
    this.ast.addChild(this.currentParent, prevParent);

    let counter = 0;
    do {
      if (this.tokenizer.peekNextToken() === ")") break;
      
      this.compileExpression();
      if (this.tokenizer.peekNextToken() === ",") {
        this.addHelper(TokenTypes.SYMBOL); // ,
      }
      counter += 1;
    } while (true);

    this.currentParent = prevParent;

    return counter;
  }
}
