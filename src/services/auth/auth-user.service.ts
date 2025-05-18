// services/refreshtoken/auth-user.service.ts
import { Users } from "@prisma/client";
import { findOneUserService } from "../user/find-one-user.service";
import { checkHashedPassword } from "../../utils/bcrypt";
import jwt from "jsonwebtoken";
import { refreshTokenModel } from "../../models/refreshtoken/refreshtoken.model";
import { HttpError } from "../../utils/httpError"; 

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export async function  authenticateUser(user: Pick<Users, "email" | "password">) {
  if (!user.email) throw new HttpError(400, "Please insert an email");
  if (!user.password) throw new HttpError(400, "Please insert a password");

  const foundUser = await findOneUserService(user.email);
  if (!foundUser) throw new HttpError(404, "User not found");

  const isAuthenticated = await checkHashedPassword(user.password, foundUser.password);
  if (!isAuthenticated) throw new HttpError(401, "Invalid password or username");

  if (!accessTokenSecret || !refreshTokenSecret) throw new HttpError(500, "JWT secrets are not defined in environment variables");

  const accessToken = jwt.sign(
    { 
        id: foundUser.id,
        roles: foundUser.roles
      },
    accessTokenSecret,
    { expiresIn: "1m" }
  );

  const refreshToken = jwt.sign(
    { id: foundUser.id },
    refreshTokenSecret,
    { expiresIn: "12h" }
  );

  await refreshTokenModel({
    token: refreshToken,
    userId: foundUser.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
    isValid: true,
    createdAt: new Date(),
  });

  return {
    accessToken,
    refreshToken,
  };
}
