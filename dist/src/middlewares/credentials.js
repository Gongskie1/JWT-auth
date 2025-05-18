"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = void 0;
const cors_1 = require("../config/cors");
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (cors_1.allowOriginList.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
};
exports.credentials = credentials;
