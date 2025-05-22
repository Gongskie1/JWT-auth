import { Users } from "@prisma/client"
import prisma from "../../config/prisma"

export const findOneUserModel = async (email:string): Promise<Users|null>=>{
    const findUser = await prisma.users.findUnique({where:{
        email
    }})
    return findUser
}