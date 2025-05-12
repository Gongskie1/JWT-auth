// controllers/user/find-user.controller.ts
import { Request, Response } from "express";
import { findOneUserService } from "../../services/user/find-one-user.service";

const findOneUserController = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await findOneUserService(email);

    res.status(200).json({
      success: true,
      message: "User found successfully",
      user,
    });
  } catch (error) {

    const message = error instanceof Error ? error.message : "An unknown error occurred";

    const status = message === "User not found" ? 404 : 500;

    res.status(status).json({
      success: false,
      message,
      error: message,
    });
  }
};

export default findOneUserController;
