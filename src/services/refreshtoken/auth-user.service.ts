import { Users } from "@prisma/client";
import { findOneUserService } from "../user/find-one-user.service";
import { checkHashedPassword } from "../../utils/bcrypt";
import jwt from "jsonwebtoken";
import { refreshTokenModel } from "../../models/refreshtoken/refreshtoken.model";


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;


export async function authenticateUser(user: Pick<Users, "email" | "password">) {

    if (!user.email)  throw new Error("Please insert an email");
    if (!user.password) throw new Error("Please insert a password");

    const foundUser = await findOneUserService(user.email);
    if (!foundUser) throw new Error("User not found");

    const isAuthenticated = await checkHashedPassword(user.password, foundUser.password);
    if (!isAuthenticated) throw new Error("Invalid password");

    if (!accessTokenSecret || !refreshTokenSecret) throw new Error("JWT secrets are not defined in environment variables");
        
    const accessToken = jwt.sign(
        { id: foundUser.id, email: foundUser.email },
        accessTokenSecret,
        {expiresIn:"30s"}
    );
    
    const refreshToken = jwt.sign(
        { id: foundUser.id, email: foundUser.email },
        refreshTokenSecret,
        {expiresIn:"12h"}
    );

    await refreshTokenModel({
        token: refreshToken,
        userId: foundUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours
        isValid: true,
        createdAt: new Date()
    });


    return {
        accessToken,
        refreshToken,
    };

}
