import { NullLiteral, NumericLiteral } from "../frontend/ast.ts";
import Environment from "./environment.ts";
export type ValueType = "null" | "number" | "boolean" | "object" | "NativeFn";

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
export type FunctionCall =(args:RuntimeValue[],env:Environment)=> RuntimeValue

export interface NativeFnValue extends RuntimeValue{
    type:"NativeFn",
    call:FunctionCall
}
// creates RuntimeValue object of type NativeFnValue from the "call" parameter
export const mk_NativeFn=(call:FunctionCall)=> {return {type:"NativeFn",call} as NativeFnValue}
export const mk_Object=(properties:Map<string,RuntimeValue>)=> {return {type:"object",properties} as ObjectValue}
export const mk_Boolean=(value:boolean)=> {return {type:"boolean",value} as BooleanValue}
export const mk_Numeric=(value:number)=> {return {type:"number",value} as NumericValue}
export const mk_Null=()=> {return {type:"null", value:"null"} as NullValue}