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
const find_one_user_service_1 = require("../../services/user/find-one-user.service");
const findOneUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = yield (0, find_one_user_service_1.findOneUserService)(email);
        res.status(200).json({
            success: true,
            message: "User found successfully",
            user,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        const status = message === "User not found" ? 404 : 500;
        res.status(status).json({
            success: false,
            message,
            error: message,
        });
    }
});
exports.default = findOneUserController;
