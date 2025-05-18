"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOption = exports.allowOriginList = void 0;
exports.allowOriginList = ["fb.com", "http://127.0.0.1:8080", "http://localhost:8080", "http://localhost:5457"];
exports.corsOption = {
    origin: (origin, callback) => {
        // console.log("Request Origin:", origin);
        if (!origin || exports.allowOriginList.includes(origin)) {
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
