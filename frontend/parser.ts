import {
  stmt,
  Program,
  Expr,
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  NullLiteral,
  BooleanLiteral,
  varDeclaration,
  Property,
  ObjectLiteral,
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
      case TokenType.Boolean:
        return {
          kind: "BooleanLiteral",
          value: this.eat().value === "true",
        } as BooleanLiteral;
      case TokenType.Null:
        this.eat();
        return {
          kind: "NullLiteral",
          value: "null",
        } as NullLiteral;
      case TokenType.OpenParen: {
        this.eat();
        const value = this.parse_Expr();
        this.expect(
          TokenType.ClosedParen,
          `unexpected token (${this.at().value}) - expected: ")" `,
        );
        this.eat();
        return value;
      }
      default:
        console.error("unexpected token found during parsing: ", this.at());
        Deno.exit(1);
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
  private parse_andExpr(): Expr {
    let left = this.parse_additiveExpr();
    while (this.at().type == TokenType.LogAndOp) {
      const operator = this.eat().value;
      const right = this.parse_additiveExpr();
      left = {
        kind: "BinaryExpr",
        left: left,
        operator,
        right: right,
      } as BinaryExpr;
    }
    return left;
  }
  private parse_orExpr(): Expr {
    let left = this.parse_andExpr();
    while (this.at().type == TokenType.LogOrOp) {
      const operator = this.eat().value;
      const right = this.parse_andExpr();
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
    // assuming that logical operations (and or)  have the lowest precedence
    //  ->> addition and subtraction
    // ->> multiplication , division & mod
    // ->> Identifiers & numbers
    return this.parse_orExpr();
  }

  private parse_ObjectExpr(): Expr {
    if (this.at().type !== TokenType.OpenCurlyBrackets)
      return this.parse_BinaryExpr();
    this.eat();
    const properties = new Array<Property>();
    while(this.not_eof()&& this.at().type !== TokenType.ClosedCurlyBrackets){
      this.expect(TokenType.Identifier,`object properties must start with a token of type 'key':Identifier, but got ${this.at()}`)
      const key = this.eat().value

      // {key,}
      if(this.at().type== TokenType.Comma){
        this.eat();
        properties.push({kind:"Property", key }as Property)
        continue
      }else if( this.at().type== TokenType.ClosedCurlyBrackets){
        properties.push({ kind: "Property", key } as Property);
        continue;
      }
      // {key:value,}
      this.expect(
        TokenType.Colon,
        `object properties' definition must contain a token of type ':':Colon after a key definition, but got ${this.at()}`,
      );
      this.eat();
      const value= this.parse_Expr();
      properties.push({kind:"Property", key, value})

      if(this.at().type != TokenType.ClosedCurlyBrackets){
        this.expect(
          TokenType.Comma,
          `object properties must be separated with a token of type ',':Colon, but got ${this.at()}`,
        );
        this.eat()
      }
    }
    this.expect(
      TokenType.ClosedCurlyBrackets,
      `object definitions must end with a token of type '}':ClosedCurlyBrackets, but got ${this.at()}`,
    );
    this.eat()
    return{kind:"ObjectLiteral", properties}as ObjectLiteral
  }
  private parse_AssignmentExpr(): Expr {
    let left = this.parse_ObjectExpr();
    if (this.at().type == TokenType.EqualOp) {
      this.eat();
      const value = this.parse_ObjectExpr();
      left = {
        kind: "AssignmentExpr",
        assignee: left,
        value,
      } as AssignmentExpr;
      return left;
    }
    return left;
  }

  private parse_Expr(): Expr {
    return this.parse_AssignmentExpr();
  }
  private parse_varDeclaration(): stmt {
    const isConst = this.eat().type == TokenType.Const;
    this.expect(
      TokenType.Identifier,
      `unexpected token found: '${this.at().type}', expected token of type Identifier`,
    );
    const identifier = this.eat().value;
    if (
      this.at().type == TokenType.SemiColon ||
      this.at().type == TokenType.EOF
    ) {
      this.eat();
      if (isConst) throw `Must initialize the constant with a value`;
      return {
        kind: "varDeclaration",
        constant: false,
        identifier,
      } as varDeclaration;
    }
    this.expect(
      TokenType.EqualOp,
      `unexpected token found: '${this.at().type}' after let | const, expected token of type assignment operator '='.`,
    );
    this.eat();
    const varDec = {
      kind: "varDeclaration",
      constant: isConst,
      identifier: identifier,
      value: this.parse_Expr(),
    } as varDeclaration;
    if (
      this.at().type != TokenType.SemiColon &&
      this.at().type != TokenType.EOF
    ) {
      throw `unexpected token found: '${this.at().type}', expected token of type semiColon ';'.`;
    }
    if (this.at().type == TokenType.SemiColon) this.eat();
    return varDec;
  }
  private parse_stmt(): stmt {
    switch (this.at().type) {
      case TokenType.Const:
      case TokenType.Let:
        return this.parse_varDeclaration();
      default:
        return this.parse_Expr();
    }
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
