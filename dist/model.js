"use strict";
// model.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCourses = exports.addExamRegisteration = exports.fetchUser = exports.putDetailsByRollno = exports.pushToken = exports.fetchTokenByRollNo = exports.updateToken = exports.fetchPasswordByRollNo = void 0;
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
function putDetailsByRollno(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, program_type, last_modified) {
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
            program_type,
            last_modified,
            rollno,
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
function fetchUser(rollno) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.getUserByRollno, [rollno], (error, results) => {
            if (error) {
                console.log("Model error: ", error);
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.fetchUser = fetchUser;
function addExamRegisteration(rollno, course_code, last_modified) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.addExamRegisterationByRollno, [rollno, course_code, last_modified], (error, results) => {
            if (error) {
                console.log("Exam registeration model error: ", error);
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.addExamRegisteration = addExamRegisteration;
function fetchCourses(semester, course_code) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.fetchCoursesBySemester, [semester, course_code], (error, results) => {
            if (error) {
                console.log("fetch courses error: ", error);
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.fetchCourses = fetchCourses;
