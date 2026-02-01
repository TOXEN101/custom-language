export type nodeType =
  | "Program"
  | "BinaryExpr"
  | "Identifier"
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
export interface Expr extends stmt {}

export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}
export interface Identifier extends Expr{
    kind:"Identifier",
    symbol:string
}
 export interface NumericLiteral extends Expr{
    kind:"NumericLiteral",
    value:number
 }
 export interface BooleanLiteral extends Expr{
  kind:"BooleanLiteral",
  value:boolean
 }
 export interface NullLiteral extends Expr{
  kind:"NullLiteral",
  value:"null"
 }