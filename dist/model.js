"use strict";
// model.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putDetailsByRollno = exports.pushToken = exports.fetchTokenByRollNo = exports.updateToken = exports.fetchPasswordByRollNo = void 0;
const db_1 = __importDefault(require("./db"));
const queries_1 = require("./queries");
function fetchPasswordByRollNo(rollno) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.getPasswordByRollno, [rollno], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.fetchPasswordByRollNo = fetchPasswordByRollNo;
function updateToken(token, rollno, last_modified, expiry) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.putToken, [token, last_modified, expiry, rollno], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.updateToken = updateToken;
function fetchTokenByRollNo(rollno) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.fetchToken, [rollno], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.fetchTokenByRollNo = fetchTokenByRollNo;
function pushToken(rollno, token, created_at, last_modified, expiry) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.pushTokenQuery, [rollno, token, created_at, last_modified, expiry], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.pushToken = pushToken;
function putDetailsByRollno(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, last_modified, password) {
    console.log("here");
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.updateDetailsByRollno, [
            program,
            semester,
            phone,
            campus,
            emailid,
            gender,
            alternate_phone,
            father,
            mother,
            guardian,
            last_modified,
            rollno,
            password
        ], (error, results) => {
            if (error) {
                console.log("model", error);
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.putDetailsByRollno = putDetailsByRollno;
