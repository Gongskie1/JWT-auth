import prisma from "../../config/prisma";


export async function deleteRefreshToken(refreshToken: string) {
    return await prisma.refreshToken.delete({
        where:{ hashedToken: refreshToken}
    })
  }
  
export async function deleteRefreshTokenByUserId(userId:number) {
    return await prisma.refreshToken.deleteMany({
        where: { userId }
    })
}