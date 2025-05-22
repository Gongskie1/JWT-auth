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
exports.findOneUserService = void 0;
// services/user/find-one-user.service.ts
const findOne_user_model_1 = require("../../models/user/findOne-user.model");
const httpError_1 = require("../../utils/httpError");
const findOneUserService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, findOne_user_model_1.findOneUserModel)(email);
    if (!user)
        throw new httpError_1.HttpError(404, "User not found");
    return user;
});
exports.findOneUserService = findOneUserService;
