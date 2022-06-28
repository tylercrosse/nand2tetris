export class ASTNode {
  token: string|number
  type: string
  children: ASTNode[]

  constructor(type: string, token?: string|number) {
    this.type = type;
    this.token = token;
    this.children = [];
  }
}

export default class AST {
  root: ASTNode

  constructor() {}

  addChild(node: ASTNode, root=this.root): void {
    root.children.push(node)
  }

  treeTraverser(node: ASTNode, level=0, callback?: Function) {
    if (node === undefined) return;

    const offset = "  ".repeat(level);
    let s = node.token ? `${offset}<${node.type}> ${node.token} ` : `${offset}<${node.type}>\n`;
    
    if (callback) callback(node);
    
    for (const child of node.children) {
      s += this.treeTraverser(child, level+1, callback);
    }
    s += node.token ? `</${node.type}>\n` : `${offset}</${node.type}>\n`;
    return s;
  }
}
