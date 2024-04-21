"use strict";
// model.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertExamRegisterations = exports.insertUsers = exports.fetchExamRegistrationProgramAndSemester = exports.fetchExamRegistrationCourse = exports.fetchExamRegistration = exports.fetchCoursesRollNo = exports.fetchCourses = exports.fetchUser = exports.putDetailsByRollno = exports.pushToken = exports.fetchTokenByRollNo = exports.updateToken = exports.fetchPasswordByRollNo = void 0;
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
// export function addExamRegisteration ( rollno:string, course_code:string, last_modified:string ): Promise<QueryResult<any>> {
//   return new Promise((resolve, reject) => {
//     pool.query(addExamRegisterationByRollno, [rollno, course_code, last_modified], (error, results)=>{
//       if(error) {
//         console.log("Exam registeration model error: ",error);
//         reject(error);
//       } else {
//         resolve(results);
//       }
//     })
//   })
// }
function fetchCourses(semester, program) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.fetchCoursesBySemester, [semester, program], (error, results) => {
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
function fetchCoursesRollNo(rollno) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.fetchCoursesByRollNo, [rollno], (error, results) => {
            if (error) {
                console.log("fetch courses by roll no error: ", error);
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.fetchCoursesRollNo = fetchCoursesRollNo;
function fetchExamRegistration(rollno) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.fetchExamRegistrationByRollNo, [rollno], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.fetchExamRegistration = fetchExamRegistration;
function fetchExamRegistrationCourse(course_code) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.fetchExamRegistrationByCourseCode, [course_code], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.fetchExamRegistrationCourse = fetchExamRegistrationCourse;
function fetchExamRegistrationProgramAndSemester(program, semester) {
    return new Promise((resolve, reject) => {
        db_1.default.query(queries_1.fetchExamRegistrationByProgramAndSemester, [program, semester], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.fetchExamRegistrationProgramAndSemester = fetchExamRegistrationProgramAndSemester;
function insertUsers(users) {
    return new Promise((resolve, reject) => {
        const query = `
      INSERT INTO users (rollno, name, password)
      VALUES ${users.map(user => {
            return `('${user.rollno}', '${user.name}', '${user.password}')`;
        }).join(', ')}
    `;
        db_1.default.query(query, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.insertUsers = insertUsers;
function insertExamRegisterations(registeration) {
    return new Promise((resolve, reject) => {
        const last_modified = new Date().toString();
        const query = `
      INSERT INTO exam_registeration (rollno, course_code, last_modified)
      VALUES ${registeration.course_code.map(courseCode => {
            return `('${registeration.rollno}', '${courseCode}', '${last_modified}')`;
        }).join(', ')}
    `;
        db_1.default.query(query, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.insertExamRegisterations = insertExamRegisterations;
