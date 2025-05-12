import { Request, Response } from "express";
import { Users } from "@prisma/client"
import { authenticateUser } from "../../services/refreshtoken/auth-user.service"

export const authController = async (req:Request,res:Response)=>{
    const user: Pick<Users,"email"|"password"> = req.body
    try {
        const { accessToken, refreshToken } = await authenticateUser(user);

        res.cookie(
            "cookie",
            refreshToken, 
            {httpOnly:true,sameSite:"none",secure:false, maxAge: 1000 * 60 * 60 * 12});
        res.status(200).json({accessToken});
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";

        const statusCode = message === "User is not verified." ? 409 : 500;

        res.status(statusCode).json({
        success: false,
        message,
        })
        return;
    }
}