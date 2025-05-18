import { Router } from "express";
import createUserController from "../controllers/user/create-user.controller";
const router = Router();

router.post("/",createUserController);

export default router;
