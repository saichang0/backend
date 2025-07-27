export interface IOneResponse {
    is_error: boolean;
    code: string;
    message:string;
    data?:any;
    error:object | null;
    status:number
}

export interface IManyResponse {
    is_error: boolean;
    code: string;
    message:string;
    total:number;
    data:object | null;
    error:object | null;
    status: number;
}