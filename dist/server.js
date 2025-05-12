"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./src/config/cors");
const routes_1 = __importDefault(require("./src/routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(cors_2.corsOption));
app.use("/api", routes_1.default);
app.listen(process.env.PORT, () => {
    console.log(`This server running on port http://localhost:${process.env.PORT}`);
});
// model Users {
//     id       Int    @id @default(autoincrement())
//     name     String @db.VarChar(255)
//     email    String @unique @db.VarChar(255)
//     password String @db.VarChar(255)
//   }
// DATABASE_URL="postgresql://postgres:NANBAKA123@localhost:5432/jwt?schema=public"
// PORT=8080
// ACCESS_TOKEN_SECRET=836d29e1901fde6a97e98a36d8e4b7573660e368b56e9f7fb60e3ea6e14b4bf506f2bd9b7010636c25b5c53ed45124fb64fc90044214effb0d169945d89d59d8
// REFRESH_TOKEN_SECRET=84729f8e5cb78054525bf3306d9969f4560c07100b1a1539b4a1e0b6e45f6264974a6de553df25431e378e63c921c414b35dec2b15c96625f20c3af43d1bf6e2
