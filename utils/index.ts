import { Request, Response } from "express";
import { ResponseModel } from "../models/ResponseModel";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import dotenv from "dotenv";
dotenv.config();

export function validateMethod(req: Request, res: Response, expectedMethod: string): boolean {
  if (req.method !== expectedMethod.toUpperCase()) {
    const response = ResponseModel.create("error", 405, `Metodo no permitido`);
    res.status(405).json(response);
    return false;
  }
  return true;
}

export function getAppName(): string {
  const appName = process.env.APP_NAME;

  if (!appName) {
    throw new Error("App name is not configured");
  }
  return appName;
}

export function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Error JWT");
  }

  return jwtSecret;
}

export function createJwtToken(
  payload: { [key: string]: any },
  type: "access" | "refresh",
): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT secret is not configured");
  }

  let expiresIn: StringValue;

  if (type === "access") {
    expiresIn = "30m";
  } else if (type === "refresh") {
    expiresIn = "180d"; // 6 meses
  } else {
    throw new Error("Invalid token type");
  }

  return jwt.sign(payload, jwtSecret, { expiresIn });
}

export function formatDate(exp: number | undefined) {
  return exp ? new Date(exp * 1000).toISOString().slice(0, 19) : null;
}

export function handleError(error: any, res: Response) {
  if (error?.response?.data) {
    const response = ResponseModel.create("error", 400, error.response.data.message);
    res.status(400).json(response);
    return;
  }
  const response = ResponseModel.create("error", 500, error?.message || "Unknown error");
  res.status(500).json(response);
}
