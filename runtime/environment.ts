import { print,showYear } from "./native functions.ts";
import { mk_NativeFn, mk_Null, RuntimeValue } from "./values.ts";

export function initGlobalScope(){
const env= new Environment();
env.declareVar("print",mk_NativeFn(print),true)
env.declareVar("showYear",mk_NativeFn(showYear),true)
return env
}

export default class Environment{
    private parent?:Environment;
    private variables: Map<string,RuntimeValue>
    private constants:Set<string>
    constructor(parentENV?:Environment){
        const global = parentENV ? true : false;
        this.parent=parentENV;
        this.variables= new Map()
        this.constants= new Set()
    }

    public declareVar(varname:string, value:RuntimeValue, isConst:boolean):RuntimeValue{
        if(this.variables.has(varname))
            throw`The variable '${varname}' has already been declared. `
        if(isConst)
            this.constants.add(varname)
        this.variables.set(varname,value)
        return value
    }
    public assignVar(varname:string, value:RuntimeValue):RuntimeValue{
        const env= this.resolve(varname);
        if(this.constants.has(varname))
            throw`${varname} is of type constant and can't reassign its value. `
        env.variables.set(varname,value)
        return value
    }

    public getVar(varname:string):RuntimeValue{
        const env= this.resolve(varname);
        return env.variables.get(varname) as RuntimeValue
    }

    //  this functions checks wether the given variable has been declared in its current environment or its parent
    public resolve(varname:string):Environment{
        if(this.variables.has(varname))
            return this
        if(this.parent== undefined)
            throw `couldn't resolve the variable '${varname}', it doesn't exist.`
        return this.parent.resolve(varname);
    }
} 