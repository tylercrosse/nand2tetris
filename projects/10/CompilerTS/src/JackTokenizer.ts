type TokenType =
  | "KEYWORD"
  | "SYMBOL"
  | "IDENTIFIER"
  | "INT_CONST"
  | "STRING_CONST";
type KeyWord =
  | "CLASS"
  | "METHOD"
  | "FUNCTION"
  | "CONSTRUCTOR"
  | "INT"
  | "BOOLEAN"
  | "CHAR"
  | "VOID"
  | "VAR"
  | "STATIC"
  | "FIELD"
  | "LET"
  | "DO"
  | "IF"
  | "ELSE"
  | "WHILE"
  | "RETURN"
  | "TRUE"
  | "FALSE"
  | "NULL"
  | "THIS";

/**
 * Tokenizer for Jack language
 */
export default class JackTokenizer {
  /**
   * Are there more tokens in the input?
   */
  hasMoreTokens(): boolean {
    return false;
  };

  /**
   * Gets the next token from the input and makes it the current token. This method should be called if hasMoreTokens() is true.
   */
  advance(): void {};

  /**
   * Returns the type of the current token.
   */
  tokenType(): TokenType {
    return "KEYWORD";
  };

  /** 
   * Returns the keyword which is the current token. Should be called only when tokenType() is KEYWORD.
   */
  keyWord(): KeyWord {
    return "CLASS";
  };

  /**
   * Returns the character which is the current token. Should be called only when tokenType() is SYMBOL.
   */
  symbol(): string {
    return "";
  };

  /**
   * Returns the identifier which is the current token. Should be called only when tokenType() is IDENTIFIER.
   */
  identifier(): string {
    return "";
  };

  /**
   * Returns the integer value of the current token. Should be called only when tokenType() is INT_CONST.
   */
  intVal(): number {
    return -1;
  };

  /**
   * Returns the string value of the current token. Should be called only when tokenType() is STRING_CONST.
   */
  stringVal(): string {
    return "";
  };
}
