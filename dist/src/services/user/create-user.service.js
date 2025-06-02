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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserService = void 0;
const create_user_model_1 = require("../../models/user/create-user.model");
const findOne_user_model_1 = require("../../models/user/findOne-user.model");
const bcrypt_1 = require("../../utils/bcrypt");
const httpError_1 = require("../../utils/httpError");
const createUserService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield (0, findOne_user_model_1.findOneUserModel)(user.email);
    if (existingUser)
        throw new httpError_1.HttpError(409, "This email is already taken.");
    const hashedPassword = yield (0, bcrypt_1.hashPassword)(user.password);
    const newUser = yield (0, create_user_model_1.createUserModel)(Object.assign(Object.assign({}, user), { password: hashedPassword }));
    return newUser;
});
exports.createUserService = createUserService;
