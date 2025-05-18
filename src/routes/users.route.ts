import { Router } from "express";
import createUserController from "../controllers/user/create-user.controller";
import findOneUserController from "../controllers/user/fetchUsers.controller";
import { authorizeRoles } from "../middlewares/authorizeRoles";
const router = Router();

router.route("/")
.post(createUserController);

router.route("/:email")
.get(authorizeRoles("ADMIN","RIDER"),findOneUserController);

export default router;