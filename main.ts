import Parser from "./frontend/parser.ts";
import Environment, { initGlobalScope } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { BooleanValue, NumericValue } from "./runtime/values.ts";

// Repl();
Run("./test.txt");
async function  Run(fileName:string){
    const parser= new Parser();
    const env= initGlobalScope()
    const src = await Deno.readTextFile(fileName)
    const program= parser.produceAST(src);
    const values= evaluate(program,env);
    console.log(values)
}
function Repl(){


const parser= new Parser();
const environment= new Environment()
environment.declareVar("zaid", {type:"number", value:947}as NumericValue,false)
environment.declareVar("status", {type:"boolean", value:false}as BooleanValue,false)
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