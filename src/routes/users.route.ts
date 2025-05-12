import { Router } from "express";
import createUserController from "../controllers/user/create-user.controller";
import findOneUserController from "../controllers/user/fetchUsers.controller";
import { authController } from "../controllers/user/authenticate-user.controller";
const router = Router();

router.post("/create-user", createUserController);
router.get("/get-user/:email", findOneUserController);
router.post("/login", authController)

export default router;