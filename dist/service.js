"use strict";
// service.ts
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
exports.verifyTokenByRollNo = exports.updateDetails = exports.handleLogin = void 0;
const model_1 = require("./model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken() {
    const tokenLength = 20; // Adjust the length of the random part of the token as needed
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomPartLength = 20; // 13 characters are for the timestamp
    // Generate random part of the token
    let randomPart = "";
    for (let i = 0; i < randomPartLength; i++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const timestamp = new Date().getTime().toString().substr(-5);
    const token = randomPart + timestamp;
    return token;
}
function handleLogin(rollno, password) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchPasswordByRollNo)(rollno)
            .then((results) => {
            if (results.rows.length > 0) {
                const dbPassword = results.rows[0].password;
                if (dbPassword === password) {
                    // const token: string = generateToken();
                    // const last_modified: string = new Date().toString();
                    // const currentDate = new Date();
                    // currentDate.setHours(currentDate.getHours() + 2);
                    // const expiry: string = currentDate.toString();
                    const token = jsonwebtoken_1.default.sign(results.rows[0], 'chotahathi', { expiresIn: '2h' });
                    const default_pass = (results.rows[0].name + '0000').substring(0, 4) + rollno;
                    const result = {
                        token: token,
                        defaultPass: password === default_pass
                    };
                    resolve(result);
                    // updateToken(token, rollno, last_modified, expiry)
                    //   .then((results: QueryResult<any>) => {
                    //     resolve(token);
                    //   })
                    //   .catch((error) => {
                    //     reject("internal server error");
                    //   });
                }
                else {
                    reject("incorrect password");
                }
            }
            else {
                reject("roll no. doesn't exist");
            }
        })
            .catch((error) => {
            reject("internal server error");
        });
    });
}
exports.handleLogin = handleLogin;
function updateDetails(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, password) {
    return new Promise((resolve, reject) => {
        const last_modified = new Date().toString();
        console.log("rollno ", rollno);
        (0, model_1.fetchPasswordByRollNo)(rollno).then((result) => {
            console.log("service ", result.rows);
            if (result.rows.length > 0) {
                (0, model_1.putDetailsByRollno)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, last_modified, password)
                    .then((results) => {
                    resolve("successfully updated!");
                })
                    .catch((error) => {
                    console.log(error);
                    reject("internal server error");
                });
            }
            else {
                reject("rollno not found!");
            }
        });
    });
}
exports.updateDetails = updateDetails;
function verifyTokenByRollNo(rollno) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, model_1.fetchTokenByRollNo)(rollno);
            return result.rows[0]; // Return token data or null if not found
        }
        catch (error) {
            throw new Error('Error verifying token');
        }
    });
}
exports.verifyTokenByRollNo = verifyTokenByRollNo;
