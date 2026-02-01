import Parser from "./frontend/parser.ts";
import { evaluate } from "./runtime/interpreter.ts";


function Tscript(){


const parser= new Parser();
console.log("\nTscript v.007")
while(true){
    const input= prompt("> ")
    if(!input|| input=="exit" || input == "die")
        Deno.exit(1);
    const program= parser.produceAST(input);
    const Runtime= evaluate(program);
    console.log(Runtime)
}
}
Tscript();