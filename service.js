"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.fetchTheStudentCampus = exports.fetchTheStudent = exports.updateThePassword = exports.otpVerifyService = exports.otpUpdateService = exports.fetchTheEmailId = exports.fetchTheProgram = exports.insertTheExamRegisterations = exports.insertTheUsers = exports.fetchTheExamRegistrationProgramAndSemester = exports.fetchTheExamRegistrationCourse = exports.fetchTheExamRegistration = exports.fetchTheCoursesRollNo = exports.fetchTheCourses = exports.fetchUserByRollno = exports.verifyTokenByRollNo = exports.updateDetails = exports.handleLoginByEmailId = exports.handleLogin = void 0;
var model_1 = require("./model");
var jsonwebtoken_1 = require("jsonwebtoken");
var bcrypt_1 = require("bcrypt");
function handleLogin(rollno, password) {
    console.log("service");
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchPasswordByRollNo)(rollno)
            .then(function (results) {
            if (results.rows.length > 0) {
                var dbPassword = results.rows[0].password;
                bcrypt_1["default"]
                    .compare(password, dbPassword)
                    .then(function (result) {
                    if (result) {
                        var token = jsonwebtoken_1["default"].sign({ user: results.rows[0] }, "chotahathi", {
                            expiresIn: "2h"
                        });
                        var default_pass = (results.rows[0].name + "0000").substring(0, 4) + rollno;
                        var result_1 = {
                            token: token,
                            defaultPass: password === default_pass
                        };
                        resolve(result_1);
                    }
                    else {
                        reject("incorrect password");
                    }
                });
            }
            else {
                reject("roll no. doesn't exist");
            }
        })["catch"](function (error) {
            reject("internal server error");
        });
    });
}
exports.handleLogin = handleLogin;
function handleLoginByEmailId(emailid, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            console.log("service");
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        (0, model_1.fetchPasswordByEmailId)(emailid)
                            .then(function (results) { return __awaiter(_this, void 0, void 0, function () {
                            var dbPassword;
                            return __generator(this, function (_a) {
                                if (results.rows.length > 0) {
                                    dbPassword = results.rows[0].password;
                                    // const hash = await bcrypt.hash("DSEU@12345", 10);
                                    // console.log("pass:",hash);
                                    bcrypt_1["default"]
                                        .compare(password, dbPassword)
                                        .then(function (result) {
                                        if (result) {
                                            delete results.rows[0].password;
                                            var token = jsonwebtoken_1["default"].sign({ user: results.rows[0] }, "motahathi", {
                                                expiresIn: "2h"
                                            });
                                            // const default_pass =
                                            //     (results.rows[0].name + "0000").substring(
                                            //         0,
                                            //         4
                                            //     ) + rollno;
                                            var result_2 = {
                                                token: token
                                            };
                                            resolve(result_2);
                                        }
                                        else {
                                            reject("incorrect password");
                                        }
                                    });
                                }
                                else {
                                    reject("email id doesn't exist");
                                }
                                return [2 /*return*/];
                            });
                        }); })["catch"](function (error) {
                            reject("internal server error");
                        });
                        return [2 /*return*/];
                    });
                }); })];
        });
    });
}
exports.handleLoginByEmailId = handleLoginByEmailId;
function uploadFile(file) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:8000/upload", {
                            method: "POST",
                            body: file
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.link]; // Assuming the API returns the link of the uploaded file
                case 3:
                    error_1 = _a.sent();
                    console.error("Error uploading file:", error_1);
                    throw new Error("Error uploading file");
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateDetails(rollno, program, semester, date_of_birth, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, aadhar, abc_id, pwbd_certificate, photo, program_type, password, year_of_admission) {
    return __awaiter(this, void 0, void 0, function () {
        var last_modified, passwordResult, hash, results, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    last_modified = new Date().toString();
                    console.log("rollno ", rollno);
                    return [4 /*yield*/, (0, model_1.fetchPasswordByRollNo)(rollno)];
                case 1:
                    passwordResult = _a.sent();
                    console.log("service ", passwordResult.rows);
                    if (!(passwordResult.rows.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, bcrypt_1["default"].hash(password, 10)];
                case 2:
                    hash = _a.sent();
                    return [4 /*yield*/, (0, model_1.putDetailsByRollno)(rollno, program, semester, date_of_birth, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, aadhar, abc_id, pwbd_certificate, // Use the uploaded link if available, otherwise use the original value
                        photo, // Use the uploaded link if available, otherwise use the original value
                        program_type, hash, year_of_admission, last_modified)];
                case 3:
                    results = _a.sent();
                    return [2 /*return*/, "successfully updated!"];
                case 4: throw new Error("rollno not found!");
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.log(error_2);
                    throw new Error("internal server error");
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.updateDetails = updateDetails;
function verifyTokenByRollNo(rollno) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, model_1.fetchTokenByRollNo)(rollno)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows[0]]; // Return token data or null if not found
                case 2:
                    error_3 = _a.sent();
                    throw new Error("Error verifying token");
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.verifyTokenByRollNo = verifyTokenByRollNo;
function fetchUserByRollno(rollno) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchUser)(rollno)
            .then(function (results) {
            resolve(results.rows);
        })["catch"](function (error) {
            console.log("Service error: ", error);
            reject("internal server error");
        });
    });
}
exports.fetchUserByRollno = fetchUserByRollno;
// export function addInExamRegisteration ( rollno:string, course_code:string) : Promise<string> {
//   return new Promise((resolve, reject) => {
//     const last_modified: string = new Date().toString();
//     addExamRegisteration(rollno, course_code, last_modified).then((results) => {
//       resolve("Successfully inserted in Exam Registeration!");
//     }).catch((error) => {
//       console.log("Exam registeration service error: ",error);
//       reject("Internal server error");
//     })
//   })
// }
function fetchTheCourses(campus, program, semester) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchCourses)(campus, program, semester)
            .then(function (results) {
            resolve(results.rows);
        })["catch"](function (error) {
            console.log("error in fetching courses: ", error);
            reject("Internal server error 1");
        });
    });
}
exports.fetchTheCourses = fetchTheCourses;
function fetchTheCoursesRollNo(rollno) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchCoursesRollNo)(rollno)
            .then(function (results) {
            resolve(results.rows);
        })["catch"](function (error) {
            console.log("error in fetching courses by rollno: ", error);
            reject("Internal server error roll 1");
        });
    });
}
exports.fetchTheCoursesRollNo = fetchTheCoursesRollNo;
function fetchTheExamRegistration(rollno) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchExamRegistration)(rollno)
            .then(function (result) {
            resolve(result.rows);
        })["catch"](function (error) {
            console.log("error in fetching exam registeration: ", error);
            reject("Internal server error fetch exam registeration 1");
        });
    });
}
exports.fetchTheExamRegistration = fetchTheExamRegistration;
function fetchTheExamRegistrationCourse(course_code) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchExamRegistrationCourse)(course_code)
            .then(function (result) {
            resolve(result.rows);
        })["catch"](function (error) {
            console.log("error in fetching exam registeration by course: ", error);
            reject("Internal server error fetch exam registeration course 1");
        });
    });
}
exports.fetchTheExamRegistrationCourse = fetchTheExamRegistrationCourse;
function fetchTheExamRegistrationProgramAndSemester(campus, program_type, program, semester) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchExamRegistrationProgramAndSemester)(campus, program_type, program, semester)
            .then(function (result) {
            var data = result.rows;
            // console.log("data: ", data)
            var students = {};
            data.forEach(function (student) {
                var rollno = student.rollno, name = student.name, dob = student.dob, photo = student.photo, program = student.program, semester = student.semester, course_code = student.course_code;
                if (!students[rollno]) {
                    students[rollno] = { rollno: rollno, name: name, dob: dob, photo: photo, program: program, semester: semester, course_codes: [course_code] };
                }
                else {
                    students[rollno].course_codes.push(course_code);
                }
            });
            resolve(Object.values(students));
        })["catch"](function (error) {
            console.log("error in fetching exam registeration by program and course: ", error);
            reject("Internal server error fetch exam registeration progrtam and semester 1");
        });
    });
}
exports.fetchTheExamRegistrationProgramAndSemester = fetchTheExamRegistrationProgramAndSemester;
function insertTheUsers(users) {
    console.log("hello");
    return new Promise(function (resolve, reject) {
        var data = [];
        // Use Promise.all to wait for all bcrypt hash operations to complete
        Promise.all(users.map(function (user) {
            var subpass = (user.name.toUpperCase()).substring(0, 4);
            subpass = subpass.split(" ")[0];
            var password = subpass + user.rollno;
            console.log(password);
            return new Promise(function (resolve, reject) {
                bcrypt_1["default"].hash(password, 10, function (err, hash) {
                    data.push(__assign(__assign({}, user), { password: hash }));
                    resolve(data);
                });
            });
        }))
            .then(function () {
            console.log("data: ", data);
            // Assuming insertUsers returns a Promise
            (0, model_1.insertUsers)(data)
                .then(function (result) {
                resolve(result.rows);
            })["catch"](function (error) {
                console.log("Error in inserting users: ", error);
                reject("Internal server error in insertUsers 1");
            });
        })["catch"](function (error) {
            console.log("Error in hashing passwords: ", error);
            reject("Internal server error in hashing passwords");
        });
    });
}
exports.insertTheUsers = insertTheUsers;
function insertTheExamRegisterations(registeration) {
    console.log("hello");
    return new Promise(function (resolve, reject) {
        (0, model_1.insertExamRegisterations)(registeration)
            .then(function (result) {
            resolve(result.rows);
        })["catch"](function (error) {
            console.log("Error in inserting exam registerations: ", error);
            reject("Internal server error in insertExamRegisterations");
        });
    });
}
exports.insertTheExamRegisterations = insertTheExamRegisterations;
function fetchTheProgram(program_type) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchProgram)(program_type).then(function (result) {
            resolve(result.rows);
        })["catch"](function (error) {
            console.log("Error in fetching programs: ", error);
            reject("Internal server error in insertExamRegisterations");
        });
    });
}
exports.fetchTheProgram = fetchTheProgram;
function fetchTheEmailId(rollno) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchEmailId)(rollno).then(function (result) {
            // console.log(result.rows[0].emailid);
            resolve(result.rows[0].emailid);
        })["catch"](function (error) {
            console.log("Error in fetching email: ", error);
            reject("Internal server error in fetchingEmailid");
        });
    });
}
exports.fetchTheEmailId = fetchTheEmailId;
function otpUpdateService(otp, rollno) {
    return new Promise(function (resolve, reject) {
        (0, model_1.otpUpdateModel)(otp, rollno).then(function (result) {
            resolve(result);
        })["catch"](function (error) {
            console.log("Error in otp udation: ", error);
            reject("Internal server error in otp updation");
        });
    });
}
exports.otpUpdateService = otpUpdateService;
function otpVerifyService(rollno) {
    return new Promise(function (resolve, reject) {
        (0, model_1.otpVerifyModel)(rollno).then(function (result) {
            resolve(result);
        })["catch"](function (error) {
            console.log("Error in otp validation: ", error);
            reject("Internal server error in otp validation");
        });
    });
}
exports.otpVerifyService = otpVerifyService;
function updateThePassword(password, rollno) {
    return __awaiter(this, void 0, void 0, function () {
        var hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt_1["default"].hash(password, 10)];
                case 1:
                    hash = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            (0, model_1.updatePassword)(hash, rollno).then(function (result) {
                                resolve(result);
                            })["catch"](function (error) {
                                console.log("Error in password updation: ", error);
                                reject("Internal server error in password updation");
                            });
                        })];
            }
        });
    });
}
exports.updateThePassword = updateThePassword;
function fetchTheStudent(program_type, program, semester) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchStudent)(program_type, program, semester).then(function (result) {
            resolve(result.rows);
        })["catch"](function (error) {
            console.log("Error in password updation: ", error);
            reject("Internal server error in password updation");
        });
    });
}
exports.fetchTheStudent = fetchTheStudent;
function fetchTheStudentCampus(campus, program_type, program, semester) {
    return new Promise(function (resolve, reject) {
        (0, model_1.fetchStudentCampus)(campus, program_type, program, semester).then(function (result) {
            resolve(result.rows);
        })["catch"](function (error) {
            console.log("Error in password updation: ", error);
            reject("Internal server error in password updation");
        });
    });
}
exports.fetchTheStudentCampus = fetchTheStudentCampus;
