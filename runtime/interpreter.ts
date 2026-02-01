import {
  stmt,
  BinaryExpr,
  NullLiteral,
  NumericLiteral,
  Program,
  BooleanLiteral,
} from "../frontend/ast.ts";
import {
  NullValue,
  NumericValue,
  RuntimeValue,
  BooleanValue,
} from "./values.ts";
import { exit } from "node:process";

function evaluate_Program(program: Program): RuntimeValue {
  let lastEvaluated = { type: "null", value: "null" } as RuntimeValue;
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }
  return lastEvaluated;
}
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
function evaluate_BinaryExpr(BinExpr: BinaryExpr): RuntimeValue {
  const lhs = evaluate(BinExpr.left);
  const rhs = evaluate(BinExpr.right);
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

export function evaluate(astNode: stmt): RuntimeValue {
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
    case "BinaryExpr":
      return evaluate_BinaryExpr(astNode as BinaryExpr);
    case "Program":
      return evaluate_Program(astNode as Program);
    default:
      console.error("unknown node used at:", astNode);
      Deno.exit(0);
  }
}
