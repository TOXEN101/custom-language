import { StartupSnapshotCallbackFn } from "node:v8";
import { TokenType } from "./lexer.ts";

export type nodeType =
  // statements
  | "Program"
  | "varDeclaration"
  // expressions
  | "AssignmentExpr"
  | "BinaryExpr"
  | "Identifier"
  | "Property"
  | "MemberExpr"
  | "CallExpr"
  // literals
  | "ObjectLiteral"
  | "NumericLiteral"
  | "BooleanLiteral"
  | "NullLiteral";

export interface stmt {
  kind: nodeType;
}
export interface Program extends stmt {
  kind: "Program";
  body: stmt[];
}

export interface varDeclaration extends stmt {
  kind: "varDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expr;
}

export interface Expr extends stmt {}

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assignee: Expr;
  value: Expr;
}

export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}
export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}
export interface Property extends Expr{
  kind:"Property",
  key:string,
  value?:Expr
}
export interface MemberExpr extends Expr{
  kind:"MemberExpr",
  object: Expr,
  property:Expr,
  isComputed:boolean
}
export interface CallExpr extends Expr {
  kind:"CallExpr",
  caller:Expr,
  args:Expr[]
}
export interface ObjectLiteral extends Expr {
  kind:"ObjectLiteral",
  properties: Property[]

}
export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}
export interface BooleanLiteral extends Expr {
  kind: "BooleanLiteral";
  value: boolean;
}
export interface NullLiteral extends Expr {
  kind: "NullLiteral";
  value: "null";
}
