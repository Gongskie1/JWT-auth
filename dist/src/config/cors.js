"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOption = void 0;
const allowlist = ["fb.com", "http://127.0.0.1:8080", "http://localhost:8080"];
exports.corsOption = {
    origin: (origin, callback) => {
        // console.log("Request Origin:", origin);
        if (!origin || allowlist.includes(origin)) {
            callback(null, true);
        }
        else {
            //   console.log("Blocked by CORS:", origin);
            callback(new Error("Not Allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
