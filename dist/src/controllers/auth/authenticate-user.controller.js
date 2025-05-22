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
exports.handleLogin = void 0;
const auth_user_service_1 = require("../../services/auth/auth-user.service");
const handleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    const user = req.body;
    // Clear old cookie (even if auth fails)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    try {
        const { accessToken, newRefreshToken, roles } = yield (0, auth_user_service_1.authenticateUser)(user, cookies, res);
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 60 * 12,
        });
        res.status(200).json({ accessToken, roles });
    }
    catch (error) {
        next(error);
    }
});
exports.handleLogin = handleLogin;
