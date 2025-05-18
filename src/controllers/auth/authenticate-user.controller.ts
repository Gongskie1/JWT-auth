// controllers/refreshtoken/handle-login.controller.ts
import { NextFunction, Request, Response } from "express";
import { Users } from "@prisma/client";
import { authenticateUser } from "../../services/auth/auth-user.service";

export const handleLogin = async (req: Request, res: Response,next:NextFunction) => {
  const user: Pick<Users, "email" | "password"> = req.body;

  try {
    const { accessToken, refreshToken } = await authenticateUser(user);

    console.log(refreshToken);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 1000 * 60 * 60 * 12,
    });
    

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};
