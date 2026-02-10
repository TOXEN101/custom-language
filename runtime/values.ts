import { NullLiteral, NumericLiteral } from "../frontend/ast.ts";
export type ValueType = "null" | "number" | "boolean" | "object";

export interface RuntimeValue {
    type: ValueType
}
export interface NullValue extends RuntimeValue {
    type:"null"
    value: "null"
}
export interface NumericValue extends RuntimeValue {
    type:"number"
    value: number
}
export interface BooleanValue extends RuntimeValue {
    type:"boolean"
    value: boolean
}
export interface ObjectValue extends RuntimeValue {
    type:"object"
    properties: Map<string,RuntimeValue>
}
