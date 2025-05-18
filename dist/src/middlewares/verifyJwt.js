"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const httpError_1 = require("../utils/httpError");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const verifyJwt = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")))
        return next(new httpError_1.HttpError(401, "No token provided"));
    const token = authHeader.split(" ")[1];
    if (!accessTokenSecret)
        return next(new httpError_1.HttpError(500, "JWT secret not defined"));
    jsonwebtoken_1.default.verify(token, accessTokenSecret, (error, decoded) => {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return next(new httpError_1.HttpError(401, "Token has expired"));
        }
        if (error)
            return next(new httpError_1.HttpError(403, "Invalid token"));
        if (typeof decoded !== "object" || decoded === null) {
            return next(new httpError_1.HttpError(400, "Malformed token payload"));
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            roles: decoded.roles
        };
        next();
    });
};
exports.verifyJwt = verifyJwt;
