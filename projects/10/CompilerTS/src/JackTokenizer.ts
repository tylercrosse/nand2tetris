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
  commentRegExp = new RegExp(/\/\*(\*(?!\/)|[^*])*\*\/|\/\/.*/g);
  keywordRegExp = new RegExp(
    /class|constructor|function|method|field|static|var|int|char|boolean|void|true|false|null|this|let|do|if|else|while|return/g
  );
  symbolRegExp = new RegExp(
    /\{|\}|\(|\)|\[|\]|\.|\,|\;|\+|\-|\*|\/|\&|\||\<|\>|\=|\~/g
  );
  integerRegExp = new RegExp(/\d+/g);
  stringRegExp = new RegExp(/\"(.*?)\"/g); // needs to use matching groups to remove the quotes
  identifierRegExp = new RegExp(/\w+/g);
  tokenRegexp = new RegExp(
    this.keywordRegExp.source +
      "|" +
      this.symbolRegExp.source +
      "|" +
      this.integerRegExp.source +
      "|" +
      this.stringRegExp.source +
      "|" +
      this.identifierRegExp.source,
    "g"
  );

  tokens: string[] = [];

  constructor(input: string) {
    this.tokens = input
      .replace(this.commentRegExp, "")
      .match(this.tokenRegexp);
  }

  /**
   * Are there more tokens in the input?
   */
  hasMoreTokens(): boolean {
    return false;
  }

  /**
   * Gets the next token from the input and makes it the current token. This method should be called if hasMoreTokens() is true.
   */
  advance(): void {}

  /**
   * Returns the type of the current token.
   */
  tokenType(): TokenType {
    return "KEYWORD";
  }

  /**
   * Returns the keyword which is the current token. Should be called only when tokenType() is KEYWORD.
   */
  keyWord(): KeyWord {
    return "CLASS";
  }

  /**
   * Returns the character which is the current token. Should be called only when tokenType() is SYMBOL.
   */
  symbol(): string {
    return "";
  }

  /**
   * Returns the identifier which is the current token. Should be called only when tokenType() is IDENTIFIER.
   */
  identifier(): string {
    return "";
  }

  /**
   * Returns the integer value of the current token. Should be called only when tokenType() is INT_CONST.
   */
  intVal(): number {
    return -1;
  }

  /**
   * Returns the string value of the current token. Should be called only when tokenType() is STRING_CONST.
   */
  stringVal(): string {
    return "";
  }
}
