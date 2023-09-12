import IError from "../error/error";


interface IResponse<T> {
    code: number;
    status: boolean;
    data?: T
    error?: IError[]
}
  
export default IResponse;