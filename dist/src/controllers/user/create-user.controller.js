"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_user_service_1 = require("../../services/user/create-user.service");
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        const newUser = yield (0, create_user_service_1.createUserService)(user);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser,
        });
        return;
    }
    catch (error) {
        console.error("Error in createUserController:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        const statusCode = message === "This email is already taken." ? 409 : 500;
        res.status(statusCode).json({
            success: false,
            message,
        });
        return;
    }
});
exports.default = createUserController;
