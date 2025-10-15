import { Request, Response } from "express";
import { ResponseModel } from "../models/ResponseModel";

export const validateMethod = (req: Request, res: Response, expectedMethod: string): boolean => {
  if (req.method !== expectedMethod.toUpperCase()) {
    const response = ResponseModel.create("error", 405, `Metodo no permitido`);
    res.status(405).json(response);
    return false;
  }
  return true;
};
