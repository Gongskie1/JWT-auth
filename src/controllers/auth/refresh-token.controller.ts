import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { HttpError } from "../../utils/httpError";
import { findRefreshToken } from "../../models/refreshtoken/findRefreshToken.model";

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const handleRefreshToken = async (req:Request,res:Response,next:NextFunction) => {
    const cookies = req.cookies;

    if(!cookies.jwt) return next(new HttpError(401, "Refresh token not found. Please log in again."));
    const refreshToken = cookies.jwt;

    const foundUser = await findRefreshToken(refreshToken);
    if(!foundUser) return next(new HttpError(403, "Refresh token not found or invalid"));

    if (!refreshTokenSecret || !accessTokenSecret) {
      return next(new HttpError(500, "Server misconfiguration: Refresh token secret not set."));
    }

    jwt.verify(
        refreshToken,
        refreshTokenSecret,
        (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
          if (error || !decoded || typeof decoded === "string") {
            return next(new HttpError(403, "Unauthorized"));
          }
      
          const accessToken = jwt.sign(
            { 
              id: foundUser.id,
              roles: foundUser.user.roles
            },
            accessTokenSecret!,
            { expiresIn: "12h" }
          );
      
          return res.status(200).json({ accessToken });
        }
      );
}