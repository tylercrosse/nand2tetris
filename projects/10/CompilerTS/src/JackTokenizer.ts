export const TokenTypes = {
  KEYWORD: "keyword",
  SYMBOL: "symbol",
  IDENTIFIER: "identifier",
  INT_CONST: "integerConstant",
  STRING_CONST: "stringConstant",
};
export const KeyWordTypes = {
  CLASS: "class",
  METHOD: "method",
  FUNCTION: "function",
  CONSTRUCTOR: "constructor",
  INT: "int",
  BOOLEAN: "boolean",
  CHAR: "char",
  VOID: "void",
  VAR: "var",
  STATIC: "static",
  FIELD: "field",
  LET: "let",
  DO: "do",
  IF: "if",
  ELSE: "else",
  WHILE: "while",
  RETURN: "return",
  TRUE: "true",
  FALSE: "false",
  NULL: "null",
  THIS: "this",
};

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
  currentToken: string;

  constructor(input: string) {
    this.tokens = input.replace(this.commentRegExp, "").match(this.tokenRegexp);
  }

  getCurrentToken() {
    return this.currentToken;
  }

  /**
   * Are there more tokens in the input?
   */
  hasMoreTokens(): boolean {
    return this.tokens.length > 0;
  }

  /**
   * Peeks at the next token.
   * @returns next token
   */
  peekNextToken(): string {
    return this.tokens[0];
  }

  /**
   * Gets the next token from the input and makes it the current token. This method should be called if hasMoreTokens() is true.
   */
  advance(): void {
    if (!this.hasMoreTokens()) return;

    this.currentToken = this.tokens.shift();
  }

  /**
   * Returns the type of the current token.
   */
  tokenType(token: string = this.currentToken) {
    if (this.keywordRegExp.test(token)) {
      this.keywordRegExp.lastIndex = 0; // reset regex
      return TokenTypes.KEYWORD;
    } else if (this.symbolRegExp.test(token)) {
      this.symbolRegExp.lastIndex = 0; // reset regex
      return TokenTypes.SYMBOL;
    } else if (this.integerRegExp.test(token)) {
      this.integerRegExp.lastIndex = 0; // reset regex
      return TokenTypes.INT_CONST;
    } else if (this.stringRegExp.test(token)) {
      this.stringRegExp.lastIndex = 0; // reset regex
      return TokenTypes.STRING_CONST;
    } else {
      return TokenTypes.IDENTIFIER;
    }
  }

  /**
   * Returns the keyword which is the current token. Should be called only when tokenType() is KEYWORD.
   */
  keyWord(): string {
    if (this.tokenType() === TokenTypes.KEYWORD) return this.currentToken;
  }

  /**
   * Returns the character which is the current token. Should be called only when tokenType() is SYMBOL.
   */
  symbol(): string {
    if (this.tokenType() === TokenTypes.SYMBOL) return this.currentToken;
  }

  /**
   * Returns the identifier which is the current token. Should be called only when tokenType() is IDENTIFIER.
   */
  identifier(): string {
    if (this.tokenType() === TokenTypes.IDENTIFIER) return this.currentToken;
  }

  /**
   * Returns the integer value of the current token. Should be called only when tokenType() is INT_CONST.
   */
  intVal(): number {
    if (this.tokenType() === TokenTypes.INT_CONST)
      return parseInt(this.currentToken, 10);
  }

  /**
   * Returns the string value of the current token. Should be called only when tokenType() is STRING_CONST.
   */
  stringVal(): string {
    if (this.tokenType() === TokenTypes.STRING_CONST) return this.currentToken;
  }
}
