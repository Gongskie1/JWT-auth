"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_user_controller_1 = require("../controllers/auth/authenticate-user.controller");
const router = (0, express_1.Router)();
router.post("/", authenticate_user_controller_1.handleLogin);
exports.default = router;
