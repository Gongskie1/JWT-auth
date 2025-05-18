import { Router } from "express";
import  { handleLogout }  from "../controllers/auth/log-out.controller";
const router = Router();

router.get("/", handleLogout);

export default router