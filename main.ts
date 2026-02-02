import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { BooleanValue, NumericValue } from "./runtime/values.ts";


function Tscript(){


const parser= new Parser();
const environment= new Environment()
environment.declareVar("zaid", {type:"number", value:947}as NumericValue)
environment.declareVar("status", {type:"boolean", value:false}as BooleanValue)
console.log("\nTscript v.007")
while(true){
    const input= prompt("> ")
    if(!input|| input=="exit" || input == "die")
        Deno.exit(1);
    const program= parser.produceAST(input);
    const Runtime= evaluate(program,environment);
    console.log(Runtime)
}
}
Tscript();