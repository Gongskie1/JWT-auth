import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import { corsOption } from "./src/config/cors";
import { errorHandler } from './src/utils/error-handler';
import { verifyJwt } from './src/middlewares/verifyJwt';
import cookieParser from 'cookie-parser';
import auth from "./src/routes/auth.route"
import register from "./src/routes/register.route";
import users from "./src/routes/users.route";
import refresh from "./src/routes/refresh-token.routes";
import logout from "./src/routes/logout.route";
import { credentials } from './src/middlewares/credentials';

const app = express();

app.use(credentials)
app.use(cors(corsOption));

app.use(express.json());

app.use(cookieParser());


app.use("/auth", auth);
app.use("/register", register);
app.use("/refresh", refresh);
app.use("/logout", logout);


app.use(verifyJwt);
app.use("/user", users);

app.use(errorHandler); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
