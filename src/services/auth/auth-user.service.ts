// services/refreshtoken/auth-user.service.ts
import { Users } from "@prisma/client";
import { findOneUserService } from "../user/find-one-user.service";
import { checkHashedPassword } from "../../utils/bcrypt";
import jwt from "jsonwebtoken";
import { CreateRefreshTokenModel } from "../../models/refreshtoken/refreshtoken.model";
import { HttpError } from "../../utils/httpError"; 
import { findRefreshToken } from "../../models/refreshtoken/findRefreshToken.model";
import {  deleteRefreshTokenByUserId } from "../../models/refreshtoken/deleteRefreshToken.model";
import { Response } from "express";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export async function authenticateUser(user: Pick<Users, "email" | "password">, cookies?: any, res?: Response) {
    // Input validation
    if (!user.email) throw new HttpError(400, "Email is required");
    if (!user.password) throw new HttpError(400, "Password is required");

    // Check user exists
    const foundUser = await findOneUserService(user.email);
    if (!foundUser) throw new HttpError(404, "User not found");

    // Verify password
    const isAuthenticated = await checkHashedPassword(user.password, foundUser.password);
    if (!isAuthenticated) throw new HttpError(401, "Invalid credentials");


    // Handle refresh token reuse (if cookie exists)
    if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        
        try {
            const decoded = jwt.verify(refreshToken, refreshTokenSecret!) as { id: number };
            const foundToken = await findRefreshToken(refreshToken);
            
            if (!foundToken) {
                console.log("Refresh token reuse detected");
                await deleteRefreshTokenByUserId(decoded.id); 
            }
        } catch (error) {
            console.log("Invalid refresh token in cookie");
        }

        res?.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    }

    // // Delete all old refresh tokens for this user
    // await deleteRefreshTokenByUserId(foundUser.id);

    // Generate new tokens
    const accessToken = jwt.sign(
        { id: foundUser.id, roles: foundUser.roles },
        accessTokenSecret!,
        { expiresIn: "15m" } // More realistic expiry
    );

    const newRefreshToken = jwt.sign(
        { id: foundUser.id },
        refreshTokenSecret!,
        { expiresIn: "1d" }
    );

    // Save new refresh token
    await CreateRefreshTokenModel({
        hashedToken: newRefreshToken,
        userId: foundUser.id,
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
        revoked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return { accessToken, newRefreshToken, roles: foundUser.roles };
}


