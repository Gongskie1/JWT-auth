import { Router } from "express";
import userRoute from "./users.route"
const router = Router();

router.use(userRoute);

export default router;