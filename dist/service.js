"use strict";
// service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDetails = exports.handleLogin = void 0;
const model_1 = require("./model");
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
                    const token = generateToken();
                    const last_modified = new Date().toString();
                    const currentDate = new Date();
                    currentDate.setHours(currentDate.getHours() + 2);
                    const expiry = currentDate.toString();
                    (0, model_1.updateToken)(token, rollno, last_modified, expiry)
                        .then((results) => {
                        resolve(token);
                    })
                        .catch((error) => {
                        reject("internal server error");
                    });
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
function updateDetails(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian) {
    return new Promise((resolve, reject) => {
        const last_modified = (new Date()).toString();
        (0, model_1.putDetailsByRollno)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, last_modified).then((results) => {
            resolve("successfully updated!");
        }).catch((error) => {
            console.log(error);
            reject("internal server error");
        });
    });
}
exports.updateDetails = updateDetails;
