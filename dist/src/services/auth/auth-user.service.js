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
exports.authenticateUser = authenticateUser;
const find_one_user_service_1 = require("../user/find-one-user.service");
const bcrypt_1 = require("../../utils/bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshtoken_model_1 = require("../../models/refreshtoken/refreshtoken.model");
const httpError_1 = require("../../utils/httpError");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
function authenticateUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!user.email)
            throw new httpError_1.HttpError(400, "Please insert an email");
        if (!user.password)
            throw new httpError_1.HttpError(400, "Please insert a password");
        const foundUser = yield (0, find_one_user_service_1.findOneUserService)(user.email);
        if (!foundUser)
            throw new httpError_1.HttpError(404, "User not found");
        const isAuthenticated = yield (0, bcrypt_1.checkHashedPassword)(user.password, foundUser.password);
        if (!isAuthenticated)
            throw new httpError_1.HttpError(401, "Invalid password or username");
        if (!accessTokenSecret || !refreshTokenSecret)
            throw new httpError_1.HttpError(500, "JWT secrets are not defined in environment variables");
        const accessToken = jsonwebtoken_1.default.sign({
            id: foundUser.id,
            roles: foundUser.roles
        }, accessTokenSecret, { expiresIn: "1m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: foundUser.id }, refreshTokenSecret, { expiresIn: "12h" });
        yield (0, refreshtoken_model_1.refreshTokenModel)({
            token: refreshToken,
            userId: foundUser.id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12),
            isValid: true,
            createdAt: new Date(),
        });
        return {
            accessToken,
            refreshToken,
        };
    });
}
