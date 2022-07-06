export class ASTNode {
  token: string | number;
  type: string;
  children: ASTNode[];

  constructor(type: string, token?: string | number) {
    this.type = type;
    this.token = token;
    this.children = [];
  }
}

export default class AST {
  root: ASTNode = null;

  constructor() {}

  addChild(node: ASTNode, root?: ASTNode): void {
    if (this.root === null) {
      this.root = node;
    } else {
      root = root || this.root;
      root.children.push(node);
    }
  }

  /**
   * Performs a depth-first traversal of the AST and creates XML nodes for each node.
   * @example
   * Tree:
   * ```
   *         term
   *        /     \
   *  symbol (~)  term
   *              / 
   *        identifier (exit)
   * ```
   * Output:
   * ```xml
   *  <term>
   *    <symbol> ~ </symbol>
   *    <term>
   *      <identifier> exit </identifier>
   *    </term>
   *  </term>
   * ```
   * @param node ASTNode
   * @param depth current depth
   * @param callback optional function to call on each node
   * @returns
   */
  xmlStringBuilder(node: ASTNode, depth = 0, callback?: Function): string {
    if (node === undefined) return;

    const offset = "  ".repeat(depth);
    let s = node.token
      ? `${offset}<${node.type}> ${node.token} `
      : `${offset}<${node.type}>\n`;

    if (callback) callback(node);

    for (const child of node.children) {
      s += this.xmlStringBuilder(child, depth + 1, callback);
    }
    s += node.token ? `</${node.type}>\n` : `${offset}</${node.type}>\n`;
    return s;
  }
}
