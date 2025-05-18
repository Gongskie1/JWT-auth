// controllers/user/find-user.controller.ts
import { NextFunction, Request, Response } from "express";
import { findOneUserService } from "../../services/user/find-one-user.service";

const findOneUserController = async (req: Request, res: Response, next:NextFunction) => {
  const { email } = req.params;

  try {
    const user = await findOneUserService(email);

    res.status(200).json({
      success: true,
      message: "User found successfully",
      user,
    });
  } catch (error) {
    next(error)
  }
};

export default findOneUserController;
