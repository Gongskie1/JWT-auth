"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_user_controller_1 = __importDefault(require("../controllers/user/create-user.controller"));
const fetchUsers_controller_1 = __importDefault(require("../controllers/user/fetchUsers.controller"));
const authorizeRoles_1 = require("../middlewares/authorizeRoles");
const router = (0, express_1.Router)();
router.route("/")
    .post(create_user_controller_1.default);
router.route("/:email")
    .get((0, authorizeRoles_1.authorizeRoles)("ADMIN", "RIDER"), fetchUsers_controller_1.default);
exports.default = router;
