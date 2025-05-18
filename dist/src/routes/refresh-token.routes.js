"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refresh_token_controller_1 = require("../controllers/auth/refresh-token.controller");
const router = (0, express_1.Router)();
router.get("/", refresh_token_controller_1.handleRefreshToken);
exports.default = router;
