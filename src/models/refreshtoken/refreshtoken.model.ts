import prisma from "../../config/prisma";
import { RefreshToken } from "@prisma/client";


export async function refreshTokenModel(token:Omit<RefreshToken,"id">) {
    const refreshToken = prisma.refreshToken.create({data:token});
    return refreshToken;
}