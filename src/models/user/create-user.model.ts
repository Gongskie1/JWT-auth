import { Users } from "@prisma/client";
import prisma from "../../config/prisma";


export const createUserModel = async (user: Omit<Users,"id">): Promise<Users>=>{
    const account = await prisma.users.create({data:user})
    return account;
}

