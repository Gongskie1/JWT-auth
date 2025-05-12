import { Request, Response } from "express";
import { Users } from "@prisma/client";
import { createUserService } from "../../services/user/create-user.service";

const createUserController = async (req: Request, res: Response) => {
  const user: Omit<Users, "id"> = req.body;

  try {
    const newUser = await createUserService(user);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    })
    return;
  } catch (error) {
    console.error("Error in createUserController:", error);

    const message = error instanceof Error ? error.message : "An unknown error occurred";

    const statusCode = message === "This email is already taken." ? 409 : 500;

     res.status(statusCode).json({
      success: false,
      message,
    })
    return;
  }
};

export default createUserController;
