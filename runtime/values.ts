import { NullLiteral, NumericLiteral } from "../frontend/ast.ts";
export type ValueType = "null" | "number" | "boolean";

export interface RuntimeValue {
    type: ValueType
}
export interface NumericValue extends RuntimeValue {
    type:"number"
    value: number
}
export interface BooleanValue extends RuntimeValue {
    type:"boolean"
    value: boolean
}
export interface NullValue extends RuntimeValue {
    type:"null"
    value: "null"
}