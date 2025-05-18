import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { HttpError } from "../utils/httpError";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return next(new HttpError(401, "No token provided"));

  const token = authHeader.split(" ")[1];
  if (!accessTokenSecret) return next(new HttpError(500, "JWT secret not defined"));

  jwt.verify(token, accessTokenSecret, (error, decoded) => {
    if (error instanceof TokenExpiredError) {
      return next(new HttpError(401, "Token has expired"));
    }
    if (error) return next(new HttpError(403, "Invalid token"));

    if (typeof decoded !== "object" || decoded === null) {
      return next(new HttpError(400, "Malformed token payload"));
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles
    };

    next();
  });
};
