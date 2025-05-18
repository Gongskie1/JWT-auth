import {Router} from "express";
import { handleLogin } from "../controllers/auth/authenticate-user.controller";
const router = Router();

router.post("/", handleLogin)
export default router;