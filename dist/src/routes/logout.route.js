"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const log_out_controller_1 = require("../controllers/auth/log-out.controller");
const router = (0, express_1.Router)();
router.get("/", log_out_controller_1.handleLogout);
exports.default = router;
