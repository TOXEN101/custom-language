export enum TokenType {
  Null,
  Number,
  Boolean,
  OpenParen,//(
  ClosedParen,//)
  OpenCurlyBrackets,//{
  ClosedCurlyBrackets,//}
  OpenBracket,//[
  ClosedBracket,//]
  SemiColon,
  Colon,
  Comma,
  MemberOp,// .
  PlusOp,
  MinusOp,
  MultiOp,
  DivOp,
  ModOp,
  EqualOp,
  LogOrOp,
  LogAndOp,
  Identifier,
  Let,
  Const,
  EOF,
}
export const RSVD: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
  true: TokenType.Boolean,
  false: TokenType.Boolean,
  null: TokenType.Null,
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
    else if (c[0] == "[")
      tokens.push(toToken(c.shift(), TokenType.OpenBracket));
    else if (c[0] == "]")
      tokens.push(toToken(c.shift(), TokenType.ClosedBracket));
    else if (c[0] == "+") tokens.push(toToken(c.shift(), TokenType.PlusOp));
    else if (c[0] == "-") tokens.push(toToken(c.shift(), TokenType.MinusOp));
    else if (c[0] == "*") tokens.push(toToken(c.shift(), TokenType.MultiOp));
    else if (c[0] == "/") tokens.push(toToken(c.shift(), TokenType.DivOp));
    else if (c[0] == "%") tokens.push(toToken(c.shift(), TokenType.ModOp));
    else if (c[0] == "=") tokens.push(toToken(c.shift(), TokenType.EqualOp));
    else if (c[0] == ".") tokens.push(toToken(c.shift(), TokenType.MemberOp));
    else if (c[0] == ";") tokens.push(toToken(c.shift(), TokenType.SemiColon));
    else if (c[0] == ":") tokens.push(toToken(c.shift(), TokenType.Colon));
    else if (c[0] == ",") tokens.push(toToken(c.shift(), TokenType.Comma));
    else if ( c[0] == "|" )
      tokens.push(toToken(c.shift(), TokenType.LogOrOp));
    else if (c[0] == "&" )
      tokens.push(toToken(c.shift(), TokenType.LogAndOp));
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
        if (typeof rsvd == "number") tokens.push(toToken(str, rsvd));
        else {
          tokens.push(toToken(str, TokenType.Identifier));
        }
      } else if (c[0] == " " || c[0] == "\t" || c[0] == "\n" || c[0] == "\r")
        c.shift();
      else {
        console.error("illegal character found:", c[0]);
        Deno.exit(1);
      }
    }
  }
  tokens.push(toToken("EndOfFile", TokenType.EOF));

  return tokens;
}
