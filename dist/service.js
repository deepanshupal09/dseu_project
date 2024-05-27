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
exports.fetchTheStudentCampus = exports.fetchTheStudent = exports.updateThePassword = exports.otpVerifyService = exports.otpUpdateService = exports.fetchTheEmailId = exports.fetchTheProgram = exports.insertTheExamRegisterations = exports.insertTheUsers = exports.fetchTheExamRegistrationProgramAndSemester = exports.fetchTheExamRegistrationCourse = exports.fetchTheExamRegistration = exports.fetchTheCoursesRollNo = exports.fetchTheCourses = exports.fetchUserByRollno = exports.verifyTokenByRollNo = exports.updateDetails = exports.handleLoginByEmailId = exports.handleLogin = void 0;
const model_1 = require("./model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function handleLogin(rollno, password) {
    
    return new Promise((resolve, reject) => {
        (0, model_1.fetchPasswordByRollNo)(rollno)
            .then((results) => {
            if (results.rows.length > 0) {
                const dbPassword = results.rows[0].password;
                bcrypt_1.default
                    .compare(password, dbPassword)
                    .then(function (result) {
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
function handleLoginByEmailId(emailid, password) {
    return __awaiter(this, void 0, void 0, function* () {
        
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            (0, model_1.fetchPasswordByEmailId)(emailid)
                .then((results) => __awaiter(this, void 0, void 0, function* () {
                if (results.rows.length > 0) {
                    const dbPassword = results.rows[0].password;
                    // const hash = await bcrypt.hash("DSEU@12345", 10);
                    // 
                    bcrypt_1.default
                        .compare(password, dbPassword)
                        .then(function (result) {
                        if (result) {
                            const token = jsonwebtoken_1.default.sign({ user: results.rows[0] }, "chotahathi", {
                                expiresIn: "2h",
                            });
                            // const default_pass =
                            //     (results.rows[0].name + "0000").substring(
                            //         0,
                            //         4
                            //     ) + rollno;
                            const result = {
                                token: token
                            };
                            resolve(result);
                        }
                        else {
                            reject("incorrect password");
                        }
                    });
                }
                else {
                    reject("email id doesn't exist");
                }
            }))
                .catch((error) => {
                reject("internal server error");
            });
        }));
    });
}
exports.handleLoginByEmailId = handleLoginByEmailId;
function uploadFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const formData = new FormData();
            // formData.append("file", file);
            const response = yield fetch("http://localhost:8000/upload", {
                method: "POST",
                body: file,
            });
            const data = yield response.json();
            return data.link; // Assuming the API returns the link of the uploaded file
        }
        catch (error) {
            console.error("Error uploading file:", error);
            throw new Error("Error uploading file");
        }
    });
}
function updateDetails(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, aadhar, abc_id, pwbd_certificate, photo, program_type, password, year_of_admission) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const last_modified = new Date().toString();
            
            const passwordResult = yield (0, model_1.fetchPasswordByRollNo)(rollno);
            
            if (passwordResult.rows.length > 0) {
                const hash = yield bcrypt_1.default.hash(password, 10);
                const results = yield (0, model_1.putDetailsByRollno)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, aadhar, abc_id, pwbd_certificate, // Use the uploaded link if available, otherwise use the original value
                photo, // Use the uploaded link if available, otherwise use the original value
                last_modified, program_type, hash, year_of_admission);
                return "successfully updated!";
            }
            else {
                throw new Error("rollno not found!");
            }
        }
        catch (error) {
            
            throw new Error("internal server error");
        }
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
        (0, model_1.fetchUser)(rollno)
            .then((results) => {
            resolve(results.rows);
        })
            .catch((error) => {
            
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
//       
//       reject("Internal server error");
//     })
//   })
// }
function fetchTheCourses(semester, program) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchCourses)(semester, program)
            .then((results) => {
            resolve(results.rows);
        })
            .catch((error) => {
            
            reject("Internal server error 1");
        });
    });
}
exports.fetchTheCourses = fetchTheCourses;
function fetchTheCoursesRollNo(rollno) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchCoursesRollNo)(rollno)
            .then((results) => {
            resolve(results.rows);
        })
            .catch((error) => {
            
            reject("Internal server error roll 1");
        });
    });
}
exports.fetchTheCoursesRollNo = fetchTheCoursesRollNo;
function fetchTheExamRegistration(rollno) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchExamRegistration)(rollno)
            .then((result) => {
            resolve(result.rows);
        })
            .catch((error) => {
            
            reject("Internal server error fetch exam registeration 1");
        });
    });
}
exports.fetchTheExamRegistration = fetchTheExamRegistration;
function fetchTheExamRegistrationCourse(course_code) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchExamRegistrationCourse)(course_code)
            .then((result) => {
            resolve(result.rows);
        })
            .catch((error) => {
            
            reject("Internal server error fetch exam registeration course 1");
        });
    });
}
exports.fetchTheExamRegistrationCourse = fetchTheExamRegistrationCourse;
function fetchTheExamRegistrationProgramAndSemester(campus, program_type, program, semester) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchExamRegistrationProgramAndSemester)(campus, program_type, program, semester)
            .then((result) => {
            const data = result.rows;
            let students = {};
            data.forEach((student) => {
                const { rollno, name, dob, photo, program, semester, course_code } = student;
                if (!students[rollno]) {
                    students[rollno] = { rollno, name, dob, photo, program, semester, course_codes: [course_code] };
                }
                else {
                    students[rollno].course_codes.push(course_code);
                }
            });
            resolve(Object.values(students));
        })
            .catch((error) => {
            
            reject("Internal server error fetch exam registeration progrtam and semester 1");
        });
    });
}
exports.fetchTheExamRegistrationProgramAndSemester = fetchTheExamRegistrationProgramAndSemester;
function insertTheUsers(users) {
    
    return new Promise((resolve, reject) => {
        let data = [];
        // Use Promise.all to wait for all bcrypt hash operations to complete
        Promise.all(users.map((user) => {
            let subpass = (user.name.toUpperCase()).substring(0, 4);
            subpass = subpass.split(" ")[0];
            const password = subpass + user.rollno;
            
            return new Promise((resolve, reject) => {
                bcrypt_1.default.hash(password, 10, function (err, hash) {
                    data.push(Object.assign(Object.assign({}, user), { password: hash }));
                    resolve(data);
                });
            });
        }))
            .then(() => {
            
            // Assuming insertUsers returns a Promise
            (0, model_1.insertUsers)(data)
                .then((result) => {
                resolve(result.rows);
            })
                .catch((error) => {
                
                reject("Internal server error in insertUsers 1");
            });
        })
            .catch((error) => {
            
            reject("Internal server error in hashing passwords");
        });
    });
}
exports.insertTheUsers = insertTheUsers;
function insertTheExamRegisterations(registeration) {
    
    return new Promise((resolve, reject) => {
        (0, model_1.insertExamRegisterations)(registeration)
            .then((result) => {
            resolve(result.rows);
        })
            .catch((error) => {
            
            reject("Internal server error in insertExamRegisterations");
        });
    });
}
exports.insertTheExamRegisterations = insertTheExamRegisterations;
function fetchTheProgram(program_type) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchProgram)(program_type).then((result) => {
            resolve(result.rows);
        }).catch((error) => {
            
            reject("Internal server error in insertExamRegisterations");
        });
    });
}
exports.fetchTheProgram = fetchTheProgram;
function fetchTheEmailId(rollno) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchEmailId)(rollno).then((result) => {
            // 
            resolve(result.rows[0].emailid);
        }).catch((error) => {
            
            reject("Internal server error in fetchingEmailid");
        });
    });
}
exports.fetchTheEmailId = fetchTheEmailId;
function otpUpdateService(otp, rollno) {
    return new Promise((resolve, reject) => {
        (0, model_1.otpUpdateModel)(otp, rollno).then((result) => {
            resolve(result);
        }).catch((error) => {
            
            reject("Internal server error in otp updation");
        });
    });
}
exports.otpUpdateService = otpUpdateService;
function otpVerifyService(rollno) {
    return new Promise((resolve, reject) => {
        (0, model_1.otpVerifyModel)(rollno).then((result) => {
            resolve(result);
        }).catch((error) => {
            
            reject("Internal server error in otp validation");
        });
    });
}
exports.otpVerifyService = otpVerifyService;
function updateThePassword(password, rollno) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(password, 10);
        return new Promise((resolve, reject) => {
            (0, model_1.updatePassword)(hash, rollno).then((result) => {
                resolve(result);
            }).catch((error) => {
                
                reject("Internal server error in password updation");
            });
        });
    });
}
exports.updateThePassword = updateThePassword;
function fetchTheStudent(program_type, program, semester) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchStudent)(program_type, program, semester).then((result) => {
            resolve(result.rows);
        }).catch((error) => {
            
            reject("Internal server error in password updation");
        });
    });
}
exports.fetchTheStudent = fetchTheStudent;
function fetchTheStudentCampus(campus, program_type, program, semester) {
    return new Promise((resolve, reject) => {
        (0, model_1.fetchStudentCampus)(campus, program_type, program, semester).then((result) => {
            resolve(result.rows);
        }).catch((error) => {
            
            reject("Internal server error in password updation");
        });
    });
}
exports.fetchTheStudentCampus = fetchTheStudentCampus;
