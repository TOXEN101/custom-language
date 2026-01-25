export enum TokenType {
  Number,
  Boolean,
  OpenParen,
  ClosedParen,
  OpenCurlyBrackets,
  ClosedCurlyBrackets,
  SemiColon,
  PlusOp,
  MinusOp,
  MultiOp,
  DivOp,
  ModOp,
  EqualOp,
  Identifier,
  Let,
  Const,
}
export const RSVD: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
  true: TokenType.Boolean,
  false: TokenType.Boolean,
};
export interface Token {
  value: string;
  type: TokenType;
}

function toToken(value: string = "", type: TokenType): Token {
  return { value: value, type: type };
}
export function tokenize(code: string): Token[] {
  let tokens = new Array<Token>();
  let c = code.split("");

  while (c.length > 0) {
    if (c[0] == "(") tokens.push(toToken(c.shift(), TokenType.OpenParen));
    else if (c[0] == ")")
      tokens.push(toToken(c.shift(), TokenType.ClosedParen));
    else if (c[0] == "{")
      tokens.push(toToken(c.shift(), TokenType.OpenCurlyBrackets));
    else if (c[0] == "}")
      tokens.push(toToken(c.shift(), TokenType.ClosedCurlyBrackets));
    else if (c[0] == "+") tokens.push(toToken(c.shift(), TokenType.PlusOp));
    else if (c[0] == "-") tokens.push(toToken(c.shift(), TokenType.MinusOp));
    else if (c[0] == "*") tokens.push(toToken(c.shift(), TokenType.MultiOp));
    else if (c[0] == "/") tokens.push(toToken(c.shift(), TokenType.DivOp));
    else if (c[0] == "%") tokens.push(toToken(c.shift(), TokenType.ModOp));
    else if (c[0] == "=") tokens.push(toToken(c.shift(), TokenType.EqualOp));
    else if (c[0] == ";") tokens.push(toToken(c.shift(), TokenType.SemiColon));
    else {
      if (c[0].match(/[0-9]/)) {
        let num = "";
        while (c.length > 0 && c[0].match(/[0-9]/)) {
          num += c.shift();
        }
        tokens.push(toToken(num, TokenType.Number));
      } else if (c[0].match(/[a-zA-Z$_]/)) {
        let str = "";
        while (c.length > 0 && c[0].match(/[a-zA-Z$_]/)) str += c.shift();
        const rsvd = RSVD[str];
        if (rsvd) tokens.push(toToken(str, rsvd));
        else {
          tokens.push(toToken(str, TokenType.Identifier));
        }
      } else if (c[0] == " " || c[0] == "\t" || c[0] == "\n") c.shift();
      else {
        console.error("illegal character found:", c[0]);
        Deno.exit(1);
      }
    }
  }

  return tokens;
}

const source = await Deno.readTextFile("./test.txt");
for (const token of tokenize(source)) {
  console.log(token);
}
