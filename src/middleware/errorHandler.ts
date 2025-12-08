import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppErrors";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Custom typed errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details || undefined,
    });
  }

  // Unexpected error
  return res.status(500).json({
    error: "Internal server error",
  });
}
