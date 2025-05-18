import prisma from "../../config/prisma";

export async function findRefreshToken(refreshToken: string) {
    return await prisma.refreshToken.findFirst({
      where: { token: refreshToken },include:{
        user:{
          select:{
            roles:true
          }
        }
      },
    });
  }
  