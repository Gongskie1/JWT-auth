"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const httpError_1 = require("../utils/httpError");
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user)
            return next(new httpError_1.HttpError(401, "Unauthorized"));
        if (!allowedRoles.includes(req.user.roles)) {
            return next(new httpError_1.HttpError(403, "Forbidden: insufficient rights"));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
