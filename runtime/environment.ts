import { RuntimeValue } from "./values.ts";

export default class Environment{
    private parent?:Environment;
    private variables: Map<string,RuntimeValue>
    constructor(parentENV?:Environment){
        this.parent==parentENV;
        this.variables= new Map()
    }

    public declareVar(varname:string, value:RuntimeValue):RuntimeValue{
        if(this.variables.has(varname))
            throw`The variable '${varname}' has already been declared. `
        this.variables.set(varname,value)
        return value
    }
    public assignVar(varname:string, value:RuntimeValue):RuntimeValue{
        const env= this.resolve(varname);
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