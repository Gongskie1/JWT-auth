import { NextFunction, Request, Response } from "express";
import { allowOriginList } from "../config/cors";

export const credentials = (req:Request, res:Response, next:NextFunction)=>{
    const origin = req.headers.origin;

    if(allowOriginList.includes(origin!)){
        res.header("Access-Control-Allow-Credentials", "true")
    }
    next()
}