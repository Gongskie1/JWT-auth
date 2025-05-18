import { Request, Response, NextFunction } from "express";
import { Roles } from "@prisma/client";
import { HttpError } from "../utils/httpError";

export const authorizeRoles = (...allowedRoles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401,"Unauthorized"));

    if (!allowedRoles.includes(req.user.roles )) {
      return  next(new HttpError(403,"Forbidden: insufficient rights"));
    }

    next();
  };
};
