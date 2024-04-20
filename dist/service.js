"use strict";
// service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTheExamRegistrationProgramAndSemester = exports.fetchTheExamRegistrationCourse = exports.fetchTheExamRegistration = exports.fetchTheCoursesRollNo = exports.fetchTheCourses = exports.addInExamRegisteration = exports.fetchUserByRollno = exports.updateDetails = exports.handleLogin = void 0;
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
function updateDetails(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, program_type) {
    return new Promise((resolve, reject) => {
        const last_modified = new Date().toString();
        (0, model_1.putDetailsByRollno)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, program_type, last_modified)
            .then((results) => {
            resolve("successfully updated!");
        })
            .catch((error) => {
            console.log(error);
            reject("internal server error");
        });
    });
}
exports.updateDetails = updateDetails;
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
