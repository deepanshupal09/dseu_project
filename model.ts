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
    fetchStudentByCampusAndProgram,
    getPasswordByEmailId,
    updateMultipleDetailsByRollno,
    updateExamControl,
    fetchCampusDetails,
    deleteExamRegisterationByRollno,
    fetchExamControl,
    fetchEmailQuery,
    updatePasswordByOtpAdmin,
    verifyOTPAdmin,
    updateOTPAdmin
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

export function fetchPasswordByEmailId(
    emailid: string
): Promise<QueryResult<any>> {
    console.log("model admin emailid: ", emailid)
    return new Promise((resolve, reject) => {
        pool.query(getPasswordByEmailId, [emailid], (error, results) => {
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
    date_of_birth: string,
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
    program_type: string,
    password: string,
    year_of_admission: string,
    last_modified: string,
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
                rollno,
                program,
                semester,
                date_of_birth,
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
                program_type,
                password,
                year_of_admission,
                last_modified,
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
    campus: string,
    program: string,
    semester: number,
    program_type: string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(
            fetchCoursesBySemester,
            [campus, program, semester,program_type],
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
    campus: string,
    course_code: string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(
            fetchExamRegistrationByCourseCode,
            [campus, course_code],
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

// export function insertExamRegisterations(registeration: {
//     rollno: string;
//     course_code: Array<string>;
// }): Promise<QueryResult<any>> {
//     return new Promise((resolve, reject) => {
//         const last_modified: string = new Date().toString();

//         //last modified format = Fri May 03 2024 21:52:13 GMT+0530 (India Standard Time)
//         const query = `
//       INSERT INTO exam_registeration (rollno, course_code, last_modified)
//       VALUES ${registeration.course_code
//           ?.map((courseCode) => {
//               return `('${registeration.rollno}', '${courseCode}', '${last_modified}')`;
//           })
//           .join(", ")}
//     `;
//         console.log("query: ",query);
//         pool.query(query, (error, results) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// }

export function insertExamRegisterations(registeration: {
    rollno: string;
    semester: number;
    course_code: Array<string>;
}): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {

        const last_modified: Date = new Date();

        const endYear: number = last_modified.getFullYear();
        let startYear: number;
        let end:number;
        let academic_year: string;

        if (registeration.semester % 2 == 0) {
            startYear = endYear - 1;
            academic_year = `${startYear}-${endYear}`;
        } else {
            startYear = endYear;
            end= startYear+1;
            academic_year = `${startYear}-${end}`;
        }

        console.log("academic year: ",academic_year);


        const query = `
        INSERT INTO exam_registeration (rollno, course_code, last_modified, academic_year)
        VALUES ${registeration.course_code
            .map((courseCode) => {
                return `('${registeration.rollno}', '${courseCode}', '${last_modified}', '${academic_year}')`;
            })
            .join(", ")}
        `;
        console.log("query: ",query);

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
export function otpUpdateModelAdmin(  otp: string , emailid: string,) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(updateOTPAdmin,[ otp , emailid ],(error, results) => {
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
export function otpVerifyModelAdmin( emailid: string) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(verifyOTPAdmin,[ emailid ],(error, results) => {
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

export function updatePasswordAdmin( password: string, emailid: string ) : Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(updatePasswordByOtpAdmin,[ password, emailid ],(error, results) => {
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

export function fetchCourseDetails( courseDetails:{
    campus:string, program:string, coursecode: Array<string>}
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT sc.course_code, sc.course_type, sc.credit, c.course_name,sc.semester
            FROM semester_course sc
            JOIN courses c ON sc.course_code = c.course_code
            WHERE sc.campus='${courseDetails.campus}' AND sc.program='${courseDetails.program}' AND sc.course_code IN (${courseDetails.coursecode.map(coursecode => `'${coursecode}'`).join(", ")})
        `;
        console.log("query:",query);
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



export function updateMultipleDetails (
    rollno: string,
    father: string,
    mother: string,
    aadhar: string,
    abc_id: string
):Promise<QueryResult<any>>{
    return new Promise((resolve, reject) => {
        pool.query(updateMultipleDetailsByRollno, [rollno, father, mother, aadhar, abc_id], (error, results) =>{
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}

export function updateExam (
    campus: string,
    program: string,
    semester: number,
    exam_control: boolean,
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(updateExamControl, [campus, program, semester, exam_control], (error, results)=>{
            if(error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}


export function fetchEmailID( 
    campus:string, 
    program:string,
    semester:number
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(fetchEmailQuery, [campus, program, semester], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


export function fetchCampus (): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(fetchCampusDetails, (error, results)=>{
            if(error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}

export function deleteExamRegisteration(rollno: string): Promise<QueryResult<any>>{
    return new Promise((resolve, reject) =>{
        pool.query(deleteExamRegisterationByRollno,[rollno], (error, results)=>{
            if(error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}

export function fetchExamControlModal(campus: string, program:string, semester:number, program_type:string): Promise<QueryResult<any>>{
    return new Promise((resolve, reject) =>{
        pool.query(fetchExamControl,[campus, program, semester, program_type], (error, results)=>{
            if(error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}