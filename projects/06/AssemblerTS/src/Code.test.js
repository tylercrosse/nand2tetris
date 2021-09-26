import Code from "./Code";

describe("Code", () => {
  it("should be able to be initialized and run a method", () => {
    const code = new Code();
    expect(code.comp("M")).toEqual("1110000");
    expect(code.dest("M")).toEqual("001");
    expect(code.jump("JEQ")).toEqual("010");
  });
});
