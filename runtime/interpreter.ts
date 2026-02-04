import {
  stmt,
  BinaryExpr,
  NullLiteral,
  NumericLiteral,
  Program,
  BooleanLiteral,
  Identifier,
  varDeclaration,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import {
  NullValue,
  NumericValue,
  RuntimeValue,
  BooleanValue,
} from "./values.ts";
import { exit } from "node:process";


function evaluate_Numeric_BinaryExpr(
  lhs: NumericValue,
  rhs: NumericValue,
  op: string,
): RuntimeValue {
  let value = 0;
  switch (op) {
    case "+":
      value = lhs.value + rhs.value;
      break;
    case "-":
      value = lhs.value - rhs.value;
      break;
    case "*":
      value = lhs.value * rhs.value;
      break;
    case "/":
      if (rhs.value == 0) {
        console.error("division by zero detected");
        Deno.exit(1);
      }
      value = lhs.value / rhs.value;
      break;
    case "%":
      value = lhs.value % rhs.value;
      break;
    default:
      console.error("unknown operator found:", op);
      exit(1);
  }
  return { type: "number", value: value as number } as NumericValue;
}
function evaluate_Boolean_BinaryExpr(
  lhs: BooleanValue,
  rhs: BooleanValue,
  op: string,
) {
  let value = false;
  switch (op) {
    case "|":
      value = (lhs.value || rhs.value) as boolean;
      break;
    case "&":
      value = (lhs.value && rhs.value) as boolean;
      break;
  }
  return {type:"boolean", value:value} as BooleanValue
}
function evaluate_Identifier(identifier: Identifier, env: Environment):RuntimeValue{
  const value= env.getVar(identifier.symbol)
  return value
}
function evaluate_BinaryExpr(BinExpr: BinaryExpr , env:Environment): RuntimeValue {
  const lhs = evaluate(BinExpr.left,env);
  const rhs = evaluate(BinExpr.right,env);
  if (lhs.type == "number" && rhs.type == "number")
    return evaluate_Numeric_BinaryExpr(
      lhs as NumericValue,
      rhs as NumericValue,
      BinExpr.operator,
    );
  else if (lhs.type == "boolean" && rhs.type == "boolean")
    return evaluate_Boolean_BinaryExpr(
      lhs as BooleanValue,
      rhs as BooleanValue,
      BinExpr.operator,
    );
    
  else return { type: "null", value: "null" } as NullValue;
}
function evaluate_varDeclaration(varDec: varDeclaration, env:Environment):RuntimeValue{
  const value=varDec.value?evaluate(varDec.value,env):{type:"null", value:"null"}as NullValue
  return env.declareVar(varDec.identifier,value,varDec.constant)
}
function evaluate_Program(program: Program, env: Environment): RuntimeValue {
  let lastEvaluated = { type: "null", value: "null" } as RuntimeValue;
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  return lastEvaluated;
}
export function evaluate(astNode: stmt, env:Environment): RuntimeValue {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        type: "number",
        value: (astNode as NumericLiteral).value,
      } as NumericValue;
    case "BooleanLiteral":
        return{type:"boolean", value: (astNode as BooleanLiteral).value} as BooleanValue
    case "NullLiteral":
      return { type: "null", value: "null" } as NullValue;
    case "Identifier":
      return evaluate_Identifier(astNode as Identifier, env)
    case "BinaryExpr":
      return evaluate_BinaryExpr(astNode as BinaryExpr,env);
    case "varDeclaration":
      return evaluate_varDeclaration(astNode as varDeclaration,env);
    case "Program":
      return evaluate_Program(astNode as Program,env);
    default:
      console.error("unknown node used at:", astNode);
      Deno.exit(0);
  }
}
