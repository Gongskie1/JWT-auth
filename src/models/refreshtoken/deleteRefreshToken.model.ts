import prisma from "../../config/prisma";


export async function deleteRefreshToken(refreshToken: string) {
    return await prisma.refreshToken.delete({
        where:{ token: refreshToken}
    })
  }
  