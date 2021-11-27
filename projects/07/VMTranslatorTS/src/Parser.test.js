import Parser from './Parser'

describe('Parser', () => {
  const lines = `// This is gibberish vm code
  push constant 10
  eq
  add
  sub
  lt
  gt
  neg
  or
  not
  pop local 0
  pop argument 2
  pop argument 1
  push constant 510
  push this 6
  push temp 6
  pop temp 6`.split('\n');
  const parser = new Parser(lines);

  it('commandType - should return the correct command type for a given command', () => {
    const parser = new Parser([]);

    expect(parser.commandType('add')).toEqual('C_ARITHMETIC');
    expect(parser.commandType('sub')).toEqual('C_ARITHMETIC');
    expect(parser.commandType('neg')).toEqual('C_ARITHMETIC');
    expect(parser.commandType('eq')).toEqual('C_ARITHMETIC');
    expect(parser.commandType('gt')).toEqual('C_ARITHMETIC');
    expect(parser.commandType('lt')).toEqual('C_ARITHMETIC');
    expect(parser.commandType('and')).toEqual('C_ARITHMETIC');
    expect(parser.commandType('or')).toEqual('C_ARITHMETIC');
    expect(parser.commandType('not')).toEqual('C_ARITHMETIC');
    expect(parser.commandType('label LOOP_START')).toEqual('C_LABEL');
    expect(parser.commandType('goto END_PROGRAM')).toEqual('C_GOTO');
    expect(parser.commandType('if-goto LOOP_START')).toEqual('C_IF');
    expect(parser.commandType('push constant 10')).toEqual('C_PUSH');
    expect(parser.commandType('push static 3')).toEqual('C_PUSH');
    expect(parser.commandType('pop local 0')).toEqual('C_POP');
    expect(parser.commandType('pop argument 1')).toEqual('C_POP');
    expect(parser.commandType('call Main.fibonacci 1')).toEqual('C_CALL');
    expect(parser.commandType('return')).toEqual('C_RETURN');
    expect(parser.commandType('function Main.fibonacci 0')).toEqual('C_FUNCTION');
  })

  it('arg1 - should return the first argument of the current command. In the case of C_ARITHMETIC, the command itself (add, sub, etc.) is returned', () => {
    const parser = new Parser([]);

    expect(parser.arg1('add')).toEqual('add');
    expect(parser.arg1('sub')).toEqual('sub');
    expect(parser.arg1('neg')).toEqual('neg');
    expect(parser.arg1('eq')).toEqual('eq');
    expect(parser.arg1('gt')).toEqual('gt');
    expect(parser.arg1('lt')).toEqual('lt');
    expect(parser.arg1('and')).toEqual('and');
    expect(parser.arg1('or')).toEqual('or');
    expect(parser.arg1('not')).toEqual('not');
    expect(parser.arg1('label LOOP_START')).toEqual('LOOP_START');
    expect(parser.arg1('goto END_PROGRAM')).toEqual('END_PROGRAM');
    expect(parser.arg1('if-goto LOOP_START')).toEqual('LOOP_START');
    expect(parser.arg1('push constant 10')).toEqual('constant');
    expect(parser.arg1('push static 3')).toEqual('static');
    expect(parser.arg1('pop local 0')).toEqual('local');
    expect(parser.arg1('pop argument 1')).toEqual('argument');
    expect(parser.arg1('call Main.fibonacci 1')).toEqual('Main.fibonacci');
    expect(parser.arg1('function Main.fibonacci 0')).toEqual('Main.fibonacci');
  })

  it('arg2 - the second argument of the current command', () => {
    const parser = new Parser([]);

    expect(parser.arg2('push constant 10')).toEqual(10);
    expect(parser.arg2('push static 3')).toEqual(3);
    expect(parser.arg2('pop local 0')).toEqual(0);
    expect(parser.arg2('pop argument 1')).toEqual(1);
    expect(parser.arg2('call Main.fibonacci 1')).toEqual(1);
    expect(parser.arg2('function Main.fibonacci 0')).toEqual(0);
  })
})