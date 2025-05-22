import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { HttpError } from "../../utils/httpError";
import { findRefreshToken } from "../../models/refreshtoken/findRefreshToken.model";
import { deleteRefreshToken, deleteRefreshTokenByUserId } from "../../models/refreshtoken/deleteRefreshToken.model";
import { CreateRefreshTokenModel } from "../../models/refreshtoken/refreshtoken.model";

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;

export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return next(new HttpError(401, "Refresh token not found. Please log in again."));

  const oldRefreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  const foundTokenRecord = await findRefreshToken(oldRefreshToken);

  if (!foundTokenRecord) {
    // Check if token reuse is happening (e.g., attacker stole a token)
    jwt.verify(oldRefreshToken, refreshTokenSecret, async (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (error || typeof decoded !== "object" || !decoded?.id) {
        return next(new HttpError(403, "Unauthorized"));
      }

      // Invalidate all tokens for the user
      await deleteRefreshTokenByUserId(decoded.id);
      console.log("Possible token reuse detected. Deleted all refresh tokens for user:", decoded.id);
      return next(new HttpError(403, "Unauthorized"));
    });
    return;
  }

  // Verify that the refresh token is still valid
  jwt.verify(oldRefreshToken, refreshTokenSecret, async (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (error || typeof decoded !== "object" || !decoded?.id) {
      await deleteRefreshToken(oldRefreshToken); // Remove expired or invalid token
      return next(new HttpError(403, "Unauthorized"));
    }

    // Delete the old refresh token as part of rotation
    await deleteRefreshToken(oldRefreshToken);

    // Create new access token
    const accessToken = jwt.sign(
      {
        id: decoded.id,
        roles: foundTokenRecord.user.roles,
      },
      accessTokenSecret,
      { expiresIn: "15m" }
    );

    // Create a new refresh token
    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      refreshTokenSecret,
      { expiresIn: "1d" }
    );

    // Save the new token in DB
    await CreateRefreshTokenModel({
      hashedToken: newRefreshToken,
      userId: decoded.id,
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      revoked: false,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    // Send new token as cookie
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return res.status(200).json({ accessToken });
  });
};


