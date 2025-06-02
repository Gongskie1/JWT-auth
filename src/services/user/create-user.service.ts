// services/user/create-user.service.ts
import { Users } from "@prisma/client";
import { createUserModel } from "../../models/user/create-user.model";
import { findOneUserModel } from "../../models/user/findOne-user.model";
import { hashPassword } from "../../utils/bcrypt";
import { HttpError } from "../../utils/httpError"; 

export const createUserService = async (user: Omit<Users, "id">): Promise<Omit<Users, "id">> => {
  const existingUser = await findOneUserModel(user.email);

  if (existingUser) throw new HttpError(409, "This email is already taken.");

  const hashedPassword = await hashPassword(user.password);

  const newUser = await createUserModel({
    ...user,
    password: hashedPassword,
  });

  return newUser;
};
