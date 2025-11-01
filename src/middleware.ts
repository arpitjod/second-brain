import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export interface AuthRequest extends Request {
  userId?: string;
}

export const userMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header provided" });
    }

    const token = authHeader.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_PASSWORD) as { id: string };
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
