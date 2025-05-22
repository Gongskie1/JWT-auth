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
const deleteRefreshToken_model_1 = require("../../models/refreshtoken/deleteRefreshToken.model");
const refreshtoken_model_1 = require("../../models/refreshtoken/refreshtoken.model");
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const handleRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return next(new httpError_1.HttpError(401, "Refresh token not found. Please log in again."));
    const oldRefreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    const foundTokenRecord = yield (0, findRefreshToken_model_1.findRefreshToken)(oldRefreshToken);
    if (!foundTokenRecord) {
        // Check if token reuse is happening (e.g., attacker stole a token)
        jsonwebtoken_1.default.verify(oldRefreshToken, refreshTokenSecret, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (error || typeof decoded !== "object" || !(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                return next(new httpError_1.HttpError(403, "Unauthorized"));
            }
            // Invalidate all tokens for the user
            yield (0, deleteRefreshToken_model_1.deleteRefreshTokenByUserId)(decoded.id);
            console.log("Possible token reuse detected. Deleted all refresh tokens for user:", decoded.id);
            return next(new httpError_1.HttpError(403, "Unauthorized"));
        }));
        return;
    }
    // Verify that the refresh token is still valid
    jsonwebtoken_1.default.verify(oldRefreshToken, refreshTokenSecret, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (error || typeof decoded !== "object" || !(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
            yield (0, deleteRefreshToken_model_1.deleteRefreshToken)(oldRefreshToken); // Remove expired or invalid token
            return next(new httpError_1.HttpError(403, "Unauthorized"));
        }
        // Delete the old refresh token as part of rotation
        yield (0, deleteRefreshToken_model_1.deleteRefreshToken)(oldRefreshToken);
        // Create new access token
        const accessToken = jsonwebtoken_1.default.sign({
            id: decoded.id,
            roles: foundTokenRecord.user.roles,
        }, accessTokenSecret, { expiresIn: "15m" });
        // Create a new refresh token
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: decoded.id }, refreshTokenSecret, { expiresIn: "1d" });
        // Save the new token in DB
        yield (0, refreshtoken_model_1.CreateRefreshTokenModel)({
            hashedToken: newRefreshToken,
            userId: decoded.id,
            expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
            revoked: false,
            updatedAt: new Date(),
            createdAt: new Date(),
        });
        // Send new token as cookie
        res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
        return res.status(200).json({ accessToken });
    }));
});
exports.handleRefreshToken = handleRefreshToken;
