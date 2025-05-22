// controllers/refreshtoken/handle-login.controller.ts
import { NextFunction, Request, Response } from "express";
import { Users } from "@prisma/client";
import { authenticateUser } from "../../services/auth/auth-user.service";

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    const user: Pick<Users, "email" | "password"> = req.body;

    // Clear old cookie (even if auth fails)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

    try {
        const { accessToken, newRefreshToken, roles } = await authenticateUser(user, cookies, res);

        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 60 * 12,
        });

        res.status(200).json({ accessToken, roles });
    } catch (error) {
        next(error);
    }
};