// services/user/find-one-user.service.ts
import { findOneUserModel } from "../../models/user/fetchall-user.model";
import { Users } from "@prisma/client";
import { HttpError } from "../../utils/httpError";

export const findOneUserService = async (email: string): Promise<Omit<Users,"createdAt">> => {
  const user = await findOneUserModel(email);

  if (!user) throw new HttpError(404, "User not found");

  return user;
};
