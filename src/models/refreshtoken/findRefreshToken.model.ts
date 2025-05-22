import prisma from "../../config/prisma";

export async function findRefreshToken(refreshToken: string) {
    return await prisma.refreshToken.findFirst({
      where: { hashedToken: refreshToken },include:{
        user:{
          select:{
            roles:true
          }
        }
      },
    });
  }

export async function findRefreshTokenByUserId(userId:number) {
  return await prisma.refreshToken.findMany({
    where:{
      userId:userId
    }
  })
}