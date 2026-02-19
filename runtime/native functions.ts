import Environment from "./environment.ts";
import { mk_Null, mk_Numeric, RuntimeValue } from "./values.ts";

export const print= (args:RuntimeValue[],_env:Environment)=>{ console.log(...args) ;return mk_Null();}
export function showYear(){
    return mk_Numeric(Date.now() / 1000 / 3600 / 24 / 365 + 1970);
}