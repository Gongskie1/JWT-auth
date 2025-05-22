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
exports.handleLogout = void 0;
const findRefreshToken_model_1 = require("../../models/refreshtoken/findRefreshToken.model");
const deleteRefreshToken_model_1 = require("../../models/refreshtoken/deleteRefreshToken.model");
const handleLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        res.status(204);
        return;
    }
    const refreshToken = cookies.jwt;
    const foundUser = yield (0, findRefreshToken_model_1.findRefreshToken)(refreshToken);
    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        res.status(204);
        return;
    }
    yield (0, deleteRefreshToken_model_1.deleteRefreshToken)(foundUser.hashedToken);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    res.sendStatus(204);
});
exports.handleLogout = handleLogout;
