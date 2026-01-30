import {
  stmt,
  Program,
  Expr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
} from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private eat(): Token {
    return this.tokens.shift() as Token;
  }
  private at(): Token {
    return this.tokens[0];
  }
  private not_eof(): boolean {
    return this.at().type != TokenType.EOF;
  }
  private expect(tokenType: TokenType, error: any) {
    const current = this.at();
    if (!current || current.type != tokenType) {
      console.error(error);
      Deno.exit(1);
    }
  }

  private parse_primaryExpr(): Expr {
    const expr = this.at();

    switch (expr.type) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;
      case TokenType.OpenParen: {
        this.eat();
        const value = this.parse_Expr();
        this.expect(
          TokenType.ClosedParen,
          `un expected token (${this.at().value})- expected: ")" `,
        );
        this.eat();
        return value
      }
      default:
        console.error("unexpected token found during parsing: ",this.at())
        Deno.exit(1)
    }
  }

  private parse_multiplicativeExpr(): Expr {
    let left = this.parse_primaryExpr();

    while (
      this.at().type == TokenType.MultiOp ||
      this.at().type == TokenType.DivOp ||
      this.at().type == TokenType.ModOp
    ) {
      const operator = this.eat().value;
      const right = this.parse_primaryExpr();
      left = {
        kind: "BinaryExpr",
        left: left,
        operator,
        right: right,
      } as BinaryExpr;
    }
    return left;
  }
  private parse_additiveExpr(): Expr {
    let left = this.parse_multiplicativeExpr();

    while (
      this.at().type == TokenType.PlusOp ||
      this.at().type == TokenType.MinusOp
    ) {
      const operator = this.eat().value;
      const right = this.parse_multiplicativeExpr();
      left = {
        kind: "BinaryExpr",
        left: left,
        operator,
        right: right,
      } as BinaryExpr;
    }
    return left;
  }
  private parse_BinaryExpr(): Expr {
    // assuming that addition and subtraction have the lowest precedence
    // ->> multiplication , division & mod
    // ->> Identifiers & numbers
    return this.parse_additiveExpr();
  }
  private parse_Expr(): Expr {
    // assuming we only have binaryExpr
    return this.parse_BinaryExpr();
  }
  private parse_stmt(): stmt {
    //assuming that our programming language doesn't have statements (yet)
    return this.parse_Expr();
  }
  public produceAST(src: string): Program {
    this.tokens = tokenize(src);
    const program: Program = {
      kind: "Program",
      body: [],
    };
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }
}
