import { IManyResponse, IOneResponse, } from "../types/base";

/// succes
export const handleSuccesManyRespones = (
    {
    code,
    message,
    total,
    data,
    status,
    }:{
    code: string;
    message:string;
    total:number; 
    data:object;
    status: number;
}):IManyResponse => {
    return{
    is_error: false,
    code: code,
    message:message,
    total:total,
    data:data,
    error: null,
    status: status,
    }
}

export const handleSuccesOneRespones = (
    {
    code,
    message,
    data,
    status
    }:{
    code: string;
    message:string;
    data:any;
    status: number;
}):IOneResponse => {
    return{
    is_error: false,
    code: code,
    message:message,
    data:data,
    error: null,
    status: status
    }
}

//// error
export const handleErrorOneRespones = (
    {
    code,
    message,
    error,
    status
    }:{
    code: string;
    message:string;
    error:object;
    status: number
}):IOneResponse => {
    return{
    is_error: true,
    code: code,
    message:message,
    data:null,
    error: error,
    status:status
    }
}

export const handleErrorManyRespones = (
    {
    code,
    message,
    error,
    status
    }:{
    code: string;
    message:string;
    error:object;
    status: number
}):IManyResponse => {
    return{
    is_error: true,
    code: code,
    message:message,
    total:0,
    data:null,
    error: error,
    status: status
    }
}
