// controllers/user/create-user.controller.ts
import { NextFunction, Request, Response } from "express";
import { Users } from "@prisma/client";
import { createUserService } from "../../services/user/create-user.service";

const createUserController = async (req: Request, res: Response, next:NextFunction) => {
  const user: Omit<Users, "id"> = req.body;

  try {
    const newUser = await createUserService(user);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error)
  }
};

export default createUserController;
