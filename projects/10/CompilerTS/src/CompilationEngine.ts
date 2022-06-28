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

  private addHelper(tokenType: TokenTypes, nodeType: string): void {
    this.tokenizer.advance();
    if (this.tokenizer.tokenType() !== tokenType) {
      // throw new CompilationError(nodeType);
    }
    this.ast.addChild(
      new ASTNode(nodeType, this.tokenizer.currentToken),
      this.currentParent
    );
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
    this.ast.root = this.currentParent;
    this.ast.addChild(new ASTNode("keyword", "class"));

    this.addHelper(TokenTypes.IDENTIFIER, "identifier");
    this.addHelper(TokenTypes.SYMBOL, "symbol");

    this.compileClassVarDec();
    this.compileSubroutine();
  }

  /**
   * Compiles a static variable declaration, or a field declaration
   */
  compileClassVarDec(): void {}

  /**
   * Compiles a complete method, function, or constructor
   */
  compileSubroutine(): void {
    // end of class - base case
    if (this.tokenizer.peekNextToken() === "}") {
      this.addHelper(TokenTypes.SYMBOL, "symbol");
      return;
    };
    
    this.tokenizer.advance();
    const currTok = this.tokenizer.currentToken;
    if (
      currTok !== KeyWordTypes.METHOD ||
      currTok !== KeyWordTypes.FUNCTION ||
      currTok !== KeyWordTypes.CONSTRUCTOR
    ) {
      // throw new CompilationError("method|function|constructor");
    }

    this.currentParent = new ASTNode("subroutineDec");
    this.ast.addChild(this.currentParent);
    this.ast.addChild(new ASTNode("keyword", currTok), this.currentParent);

    if (this.tokenizer.peekNextToken() === KeyWordTypes.VOID) {
      this.addHelper(TokenTypes.KEYWORD, "keyword");
    }
    // subroutine name
    this.addHelper(TokenTypes.IDENTIFIER, "identifier");
    // (
    this.addHelper(TokenTypes.SYMBOL, "symbol");

    this.compileParameterList();

    // )
    this.addHelper(TokenTypes.SYMBOL, "symbol");

    this.compileSubroutineBody();

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

    // do {
    //   if (this.tokenizer.peekNextToken() !== ")") break;
    //   this.addHelper(TokenTypes.KEYWORD, "keyword");
    //   this.addHelper(TokenTypes.IDENTIFIER, "identifier");
    //   if (this.tokenizer.peekNextToken() === ",") {
    //     this.addHelper(TokenTypes.SYMBOL, "symbol");
    //   }
    // } while (true);
    this.currentParent = prevParent;
  }

  /**
   * Compiles a subroutine's body
   */
  compileSubroutineBody(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("subroutineBody");
    this.ast.addChild(this.currentParent, prevParent);

    this.addHelper(TokenTypes.SYMBOL, "symbol");

    // TODO probs add some conditionals & other logic
    this.compileVarDec();
    this.compileStatements();

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

    this.addHelper(TokenTypes.KEYWORD, "keyword"); // var

    // var type
    const nextTok = this.tokenizer.peekNextToken();
    if (
      nextTok === KeyWordTypes.INT ||
      nextTok === KeyWordTypes.INT ||
      nextTok === KeyWordTypes.BOOLEAN
    ) {
      this.addHelper(TokenTypes.KEYWORD, "keyword");
    } else {
      this.addHelper(TokenTypes.IDENTIFIER, "identifier");
    }

    do {
      this.addHelper(TokenTypes.IDENTIFIER, "identifier"); // var name
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

    switch(this.tokenizer.peekNextToken()) {
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
        // throw new CompilationError('let|if|while|do|return');
    }

    this.currentParent = prevParent;
  }

  /**
   * Compiles a `let` statement
   */
  compileLet(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("letStatement");
    this.ast.addChild(this.currentParent, prevParent);
    
    this.addHelper(TokenTypes.KEYWORD, "keyword"); // let
    this.addHelper(TokenTypes.IDENTIFIER, "identifier"); // var name
    this.addHelper(TokenTypes.SYMBOL, "symbol"); // =

    this.compileExpression();
    
    this.currentParent = prevParent;
  }

  /**
   * Compiles an `if` statement, possibly with a `else` clause
   */
  compileIf(): void {}

  /**
   * Compiles a `while` statement
   */
  compileWhile(): void {}

  /**
   * Compiles a `do` statement
   */
  compileDo(): void {}

  /**
   * Compiles a `return` statement
   */
  compileReturn(): void {}

  /**
   * Compiles an expression
   */
  compileExpression(): void {
    const prevParent = this.currentParent;
    this.currentParent = new ASTNode("expression");
    this.ast.addChild(this.currentParent, prevParent);
    
  
    
    this.currentParent = prevParent;
  }

  /**
   * Compiles a term. If the current token is an identifier, the routine must
   * distinguish between a variable, an array entry, and a subroutine call. A
   * single look-ahead token, which may be one of "[", ".", or "(" suffices to
   * distinguish between the three possibilities. Any other token is not part of
   * this term and should not be advanced over.
   */
  compileTerm(): void {}

  /**
   * Compiles a (possibly empty) comma-separated list of expressions. Returns the number of expressions in the list.
   */
  compileExpressionList(): number {
    return -1;
  }
}
