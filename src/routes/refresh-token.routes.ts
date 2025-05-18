import {Router} from "express";
import { handleRefreshToken } from "../controllers/auth/refresh-token.controller";
const router = Router();

router.get("/", handleRefreshToken);

export default router