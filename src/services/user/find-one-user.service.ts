import { findOneUserModel } from "../../models/user/fetchall-user.model";
import { Users } from "@prisma/client";

export const findOneUserService = async (email: string): Promise<Users> => {
  const user = await findOneUserModel(email);

  if (!user) throw new Error("User not found");

  return user;
};


