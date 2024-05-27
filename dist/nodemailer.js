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
exports.sendEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
dotenv_1.default.config();
const controller_1 = require("./controller");
const sendEmail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rollno = req.headers.rollno;
    
    try {
        const email = yield (0, controller_1.fetchEmailIdByRollno)(rollno);
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: "Change Password",
            text: "This is the otp: ",
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                
                res.status(500).send({ message: "Internal Server Error!" });
            }
            else {
                res.status(200).send("Email sent successfully!");
            }
        });
    }
    catch (error) {
    }
}));
exports.sendEmail = sendEmail;
