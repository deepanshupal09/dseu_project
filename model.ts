// model.ts

import { QueryResult } from "pg";
import pool from "./db";
import {
    getPasswordByRollno,
    putToken,
    fetchToken,
    pushTokenQuery,
    updateDetailsByRollno,
    getUserByRollno,
    // addExamRegisterationByRollno,
    fetchCoursesBySemester,
    fetchCoursesByRollNo,
    fetchExamRegistrationByRollNo,
    fetchExamRegistrationByCourseCode,
    fetchExamRegistrationByProgramAndSemester,
    fetchProgramByProgramType,
    fetchEmailIdByRollno,
    updateOTP,
    verifyOTP,
    updatePasswordByOtp,
    fetchStudentByProgramAndSemester,
    fetchStudentByCampusAndProgram
} from "./queries";

export function fetchPasswordByRollNo(
    rollno: string
): Promise<QueryResult<any>> {
    console.log("model rollno: ",rollno)
    return new Promise((resolve, reject) => {
        pool.query(getPasswordByRollno, [rollno], (error, results) => {
            if (error) {
                console.log("eror: ", error)    
                reject(error);
            } else {
                // console.log("error mode: ",results)
                resolve(results);
            }
        });
    });
}

export function updateToken(
    token: string,
    rollno: string,
    last_modified: string,
    expiry: string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(
            putToken,
            [token, last_modified, expiry, rollno],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

export function fetchTokenByRollNo(rollno: string): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(fetchToken, [rollno], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export function pushToken(
    rollno: string,
    token: string,
    created_at: string,
    last_modified: string,
    expiry: string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(
            pushTokenQuery,
            [rollno, token, created_at, last_modified, expiry],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

export function putDetailsByRollno(
    rollno: string,
    program: string,
    semester: number,
    phone: string,
    campus: string,
    emailid: string,
    gender: string,
    alternate_phone: string,
    father: string,
    mother: string,
    guardian: string,
    aadhar: string,
    abc_id: string,
    pwbd_certificate: string,
    photo: string,
    last_modified: string,
    program_type: string,
    password: string,
    year_of_admission: string,
): Promise<QueryResult<any>> {
    console.log("here");
    return new Promise((resolve, reject) => {
        console.log("here");
        // console.log("rollno:", rollno);
        // console.log("program:", program);
        // console.log("semester:", semester);
        // console.log("phone:", phone);
        // console.log("campus:", campus);
        // console.log("emailid:", emailid);
        // console.log("gender:", gender);
        // console.log("alternate_phone:", alternate_phone);
        // console.log("father:", father);
        // console.log("mother:", mother);
        // console.log("guardian:", guardian);
        // console.log("aadhar:", aadhar);
        // console.log("abc_id:", abc_id);
        // console.log("pwbd_certificate:", pwbd_certificate);
        // console.log("photo:", photo);
        // console.log("last_modified:", last_modified);
        // console.log("program_type:", program_type);
        // console.log("password:", password);
        pool.query(
            updateDetailsByRollno,
            [
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
                aadhar,
                abc_id,
                pwbd_certificate,
                photo,
                last_modified,
                program_type,
                password,
                rollno,
                year_of_admission
            ],
            (error, results) => {
                if (error) {
                    console.log("model", error);
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

export function fetchUser(rollno: string): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(getUserByRollno, [rollno], (error, results) => {
            if (error) {
                console.log("Model error: ", error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

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

export function fetchCourses(
    semester: number,
    program: string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(
            fetchCoursesBySemester,
            [semester, program],
            (error, results) => {
                if (error) {
                    console.log("fetch courses error: ", error);
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

export function fetchCoursesRollNo(rollno: string): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(fetchCoursesByRollNo, [rollno], (error, results) => {
            if (error) {
                console.log("fetch courses by roll no error: ", error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export function fetchExamRegistration(
    rollno: string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(
            fetchExamRegistrationByRollNo,
            [rollno],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

export function fetchExamRegistrationCourse(
    course_code: string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(
            fetchExamRegistrationByCourseCode,
            [course_code],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

export function fetchExamRegistrationProgramAndSemester(
    campus: string,
    program_type: string,
    program: string,
    semester: number
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(
            fetchExamRegistrationByProgramAndSemester,
            [campus, program_type, program, semester],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

export function insertUsers(
    users: Array<{ rollno: string; name: string; password: string }>
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        const query = `
      INSERT INTO users (rollno, name, password)
      VALUES ${users
          .map((user) => {
              return `('${user.rollno}', '${user.name}', '${user.password}')`;
          })
          .join(", ")}
    `;
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export function insertExamRegisterations(registeration: {
    rollno: string;
    course_code: Array<string>;
}): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        const last_modified: string = new Date().toString();
        const query = `
      INSERT INTO exam_registeration (rollno, course_code, last_modified)
      VALUES ${registeration.course_code
          .map((courseCode) => {
              return `('${registeration.rollno}', '${courseCode}', '${last_modified}')`;
          })
          .join(", ")}
    `;
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export function fetchProgram( program_type: string) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchProgramByProgramType,[program_type],(error, results) => {
            if(error){
                reject(error);
            } else{
                resolve(results);
            }
        })
    })
}

export function fetchEmailId( rollno: string) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchEmailIdByRollno,[rollno],(error, results) => {
            if(error){
                reject(error);
            } else{
                resolve(results);
            }
        })
    })
}

export function otpUpdateModel(  otp: string , rollno: string,) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(updateOTP,[ otp , rollno ],(error, results) => {
            if(error){
                reject(error);
            } else{
                resolve(results);
            }
        })
    })
}

export function otpVerifyModel( rollno: string) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(verifyOTP,[ rollno ],(error, results) => {
            if(error){
                reject(error);
            } else{
                resolve(results);
            }
        })
    })
}

export function updatePassword( password: string, rollno: string ) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(updatePasswordByOtp,[ password, rollno ],(error, results) => {
            if(error){
                reject(error);
            } else{
                resolve(results);
            }
        })
    })
}

export function fetchStudent( program_type: string, program: string, semester: number ) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchStudentByProgramAndSemester,[ program_type, program, semester ],(error, results) => {
            if(error){
                reject(error);
            } else{
                resolve(results);
            }
        })
    })
}

export function fetchStudentCampus( campus:string, program_type: string, program: string, semester: number ) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchStudentByCampusAndProgram,[ campus, program_type, program, semester ],(error, results) => {
            if(error){
                reject(error);
            } else{
                resolve(results);
            }
        })
    })
}