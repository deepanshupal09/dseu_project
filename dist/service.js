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
exports.fetchTheExamRegistrationProgramAndSemester = exports.fetchTheExamRegistrationCourse = exports.fetchTheExamRegistration = exports.fetchTheCoursesRollNo = exports.fetchTheCourses = exports.addInExamRegisteration = exports.fetchUserByRollno = exports.verifyTokenByRollNo = exports.updateDetails = exports.handleLogin = void 0;
const model_1 = require("./model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function handleLogin(rollno, password) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchPasswordByRollNo)(rollno)
            .then((results) => {
            if (results.rows.length > 0) {
                const dbPassword = results.rows[0].password;
                bcrypt_1.default.compare(password, dbPassword).then(function (result) {
                    //   bcrypt.hash("anan41521005", 10).then(function(hash) {
                    //     console.log(hash)
                    // });
                    if (result) {
                        const token = jsonwebtoken_1.default.sign({ user: results.rows[0] }, "chotahathi", {
                            expiresIn: "2h",
                        });
                        const default_pass = (results.rows[0].name + "0000").substring(0, 4) + rollno;
                        const result = {
                            token: token,
                            defaultPass: password === default_pass,
                        };
                        resolve(result);
                    }
                    else {
                        reject("incorrect password");
                    }
                });
                // const token: string = generateToken();
                // const last_modified: string = new Date().toString();
                // const currentDate = new Date();
                // currentDate.setHours(currentDate.getHours() + 2);
                // const expiry: string = currentDate.toString();
                // updateToken(token, rollno, last_modified, expiry)
                //   .then((results: QueryResult<any>) => {
                //     resolve(token);
                //   })
                //   .catch((error) => {
                //     reject("internal server error");
                //   });
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
function updateDetails(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, password, program_type) {
    return new Promise((resolve, reject) => {
        const last_modified = new Date().toString();
        console.log("rollno ", rollno);
        (0, model_1.fetchPasswordByRollNo)(rollno).then((result) => {
            console.log("service ", result.rows);
            if (result.rows.length > 0) {
                bcrypt_1.default.hash(password, 10).then(function (hash) {
                    // Store hash in your password DB.
                    (0, model_1.putDetailsByRollno)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, last_modified, program_type, hash)
                        .then((results) => {
                        resolve("successfully updated!");
                    })
                        .catch((error) => {
                        console.log(error);
                        reject("internal server error");
                    });
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
            throw new Error("Error verifying token");
        }
    });
}
exports.verifyTokenByRollNo = verifyTokenByRollNo;
function fetchUserByRollno(rollno) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchUser)(rollno).then((results) => {
            resolve(results.rows);
        })
            .catch((error) => {
            console.log("Service error: ", error);
            reject("internal server error");
        });
    });
}
exports.fetchUserByRollno = fetchUserByRollno;
function addInExamRegisteration(rollno, course_code) {
    return new Promise((resolve, reject) => {
        const last_modified = new Date().toString();
        (0, model_1.addExamRegisteration)(rollno, course_code, last_modified).then((results) => {
            resolve("Successfully inserted in Exam Registeration!");
        }).catch((error) => {
            console.log("Exam registeration service error: ", error);
            reject("Internal server error");
        });
    });
}
exports.addInExamRegisteration = addInExamRegisteration;
function fetchTheCourses(semester, program) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchCourses)(semester, program).then((results) => {
            resolve(results.rows);
        }).catch((error) => {
            console.log("error in fetching courses: ", error);
            reject("Internal server error 1");
        });
    });
}
exports.fetchTheCourses = fetchTheCourses;
function fetchTheCoursesRollNo(rollno) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchCoursesRollNo)(rollno).then((results) => {
            resolve(results.rows);
        }).catch((error) => {
            console.log("error in fetching courses by rollno: ", error);
            reject("Internal server error roll 1");
        });
    });
}
exports.fetchTheCoursesRollNo = fetchTheCoursesRollNo;
function fetchTheExamRegistration(rollno) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchExamRegistration)(rollno).then((result) => {
            resolve(result.rows);
        }).catch((error) => {
            console.log("error in fetching exam registeration: ", error);
            reject("Internal server error fetch exam registeration 1");
        });
    });
}
exports.fetchTheExamRegistration = fetchTheExamRegistration;
function fetchTheExamRegistrationCourse(course_code) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchExamRegistrationCourse)(course_code).then((result) => {
            resolve(result.rows);
        }).catch((error) => {
            console.log("error in fetching exam registeration by course: ", error);
            reject("Internal server error fetch exam registeration course 1");
        });
    });
}
exports.fetchTheExamRegistrationCourse = fetchTheExamRegistrationCourse;
function fetchTheExamRegistrationProgramAndSemester(program, semester) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchExamRegistrationProgramAndSemester)(program, semester).then((result) => {
            resolve(result.rows);
        }).catch((error) => {
            console.log("error in fetching exam registeration by program and course: ", error);
            reject("Internal server error fetch exam registeration progrtam and semester 1");
        });
    });
}
exports.fetchTheExamRegistrationProgramAndSemester = fetchTheExamRegistrationProgramAndSemester;
