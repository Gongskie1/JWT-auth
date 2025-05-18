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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpError_1 = require("../../utils/httpError");
const findRefreshToken_model_1 = require("../../models/refreshtoken/findRefreshToken.model");
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const handleRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!cookies.jwt)
        return next(new httpError_1.HttpError(401, "Refresh token not found. Please log in again."));
    const refreshToken = cookies.jwt;
    const foundUser = yield (0, findRefreshToken_model_1.findRefreshToken)(refreshToken);
    if (!foundUser)
        return next(new httpError_1.HttpError(403, "Refresh token not found or invalid"));
    if (!refreshTokenSecret || !accessTokenSecret) {
        return next(new httpError_1.HttpError(500, "Server misconfiguration: Refresh token secret not set."));
    }
    jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret, (error, decoded) => {
        if (error || !decoded || typeof decoded === "string") {
            return next(new httpError_1.HttpError(403, "Unauthorized"));
        }
        const accessToken = jsonwebtoken_1.default.sign({
            id: foundUser.id,
            roles: foundUser.user.roles
        }, accessTokenSecret, { expiresIn: "12h" });
        return res.status(200).json({ accessToken });
    });
});
exports.handleRefreshToken = handleRefreshToken;
