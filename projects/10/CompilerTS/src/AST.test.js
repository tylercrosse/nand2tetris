import AST, { ASTNode } from './AST';

describe('AST', () => {
  it('should be able to build a simple syntax tree', () => {
    const ast = new AST();

    ast.root = new ASTNode('class')
    ast.addChild(new ASTNode('keyword', 'class'))
    ast.addChild(new ASTNode('identifier', 'Main'))
    ast.addChild(new ASTNode('symbol', '{'))
    
    let sub = new ASTNode('subroutineDec')
    ast.addChild(sub);
    ast.addChild(new ASTNode('keyword', 'function'), sub)
    ast.addChild(new ASTNode('keyword', 'void'), sub)
    ast.addChild(new ASTNode('identifier', 'main'), sub)
    ast.addChild(new ASTNode('symbol', '('), sub)
    ast.addChild(new ASTNode('parameterList'), sub)
    ast.addChild(new ASTNode('symbol', ')'), sub)

    let sub2 = new ASTNode('subroutineBody')
    ast.addChild(sub2, sub);
    ast.addChild(new ASTNode('symbol', '{'), sub2)

    sub = new ASTNode('varDec')
    ast.addChild(sub, sub2)
    ast.addChild(new ASTNode('keyword', 'var'), sub)
    ast.addChild(new ASTNode('identifier', 'Array'), sub)
    ast.addChild(new ASTNode('identifier', 'a'), sub)
    ast.addChild(new ASTNode('symbol', ';'), sub)
    
    ast.addChild(new ASTNode('symbol', '}'))

    expect(ast.treeTraverser(ast.root)).toMatchInlineSnapshot(`
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
    </subroutineBody>
  </subroutineDec>
  <symbol> } </symbol>
</class>
"
`);
  });
})