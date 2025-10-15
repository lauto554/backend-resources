export type ResponseStatus = "success" | "error" | "warning";

export class ResponseModel<T = any> {
  public status: ResponseStatus;
  public data: T | null;
  public code: number;
  public message: string;

  constructor(status: ResponseStatus, data: T | null = null, code: number, message: string = "") {
    this.status = status;
    this.data = data;
    this.code = code;
    this.message = message;
  }

  // Método estático único para crear respuestas
  static create<T>(
    status: ResponseStatus,
    code: number,
    message: string,
    data: T | null = null
  ): ResponseModel<T> {
    return new ResponseModel(status, data, code, message);
  }
}
