import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../utils/httpError";
import { findRefreshToken } from "../../models/refreshtoken/findRefreshToken.model";
import { deleteRefreshToken } from "../../models/refreshtoken/deleteRefreshToken.model";


export const handleLogout = async (req:Request,res:Response,next:NextFunction) => {
    const cookies = req.cookies;

    if(!cookies.jwt)  {
        res.status(204)
        return;
    }
    const refreshToken = cookies.jwt;

    const foundUser = await findRefreshToken(refreshToken);
    if(!foundUser) {
        res.clearCookie("jwt", { 
            httpOnly: true,
            sameSite: "none",
            secure: true, });
        
         res.status(204)
         return;
    }

    await deleteRefreshToken(foundUser.token);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    res.sendStatus(204);
}