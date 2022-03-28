/**
 * Recursive top-down parser for Jack language.
 */
export default class CompilationEngine {
  /**
   * Compiles a complete class
   */
  compileClass(): void {}

  /**
   * Compiles a static variable declaration, or a field declaration
   */
  compileClassVarDec(): void {}

  /**
   * Compiles a complete method, function, or constructor
   */
  compileSubroutine(): void {}

  /**
   * Compiles a (possibly empty) parameter list, not including the enclosing "()"
   */
  compileParameterList(): void {}

  /**
   * Compiles a subroutine's body
   */
  compileSubroutineBody(): void {}

  /**
   * Compiles a `var` declaration
   */
  compileVarDec(): void {}

  /**
   * Compiles a sequence of statements, not including the enclosing "{}".
   */
  compileStatements(): void {}

  /**
   * Compiles a `let` statement
   */
  compileLet(): void {}

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
  compileExpression(): void {}

  /**
   * Compiles a term. If the current token is an identifier, the routine must distinguish between a variable, an array entry, and a subroutine call. A single look-ahead token, which may be one of "[", ".", or "(" suffices to distinguish between the three possibilities. Any other token is not part of this term and should not be advanced over.
   */
  compileTerm(): void {}

  /**
   * Compiles a (possibly empty) comma-separated list of expressions. Returns the number of expressions in the list.
   */
  compileExpressionList(): number {
    return -1;
  }
}
