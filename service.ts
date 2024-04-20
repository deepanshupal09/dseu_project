// service.ts

import { Request, Response } from "express"; // Assuming you're using Express

import { QueryResult } from "pg";
import {
  fetchPasswordByRollNo,
  putDetailsByRollno,
  updateToken,
  fetchUser,
  addExamRegisteration,
  fetchCourses,
  fetchCoursesRollNo,
  fetchExamRegistration,
  fetchExamRegistrationCourse,
  fetchExamRegistrationProgramAndSemester
} from "./model";

function generateToken() {
  const tokenLength = 20; // Adjust the length of the random part of the token as needed
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomPartLength = 20; // 13 characters are for the timestamp

  // Generate random part of the token
  let randomPart = "";
  for (let i = 0; i < randomPartLength; i++) {
    randomPart += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  const timestamp = new Date().getTime().toString().substr(-5);
  const token = randomPart + timestamp;
  return token;
}

export function handleLogin(rollno: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetchPasswordByRollNo(rollno)
      .then((results: QueryResult<any>) => {
        if (results.rows.length > 0) {
          const dbPassword = results.rows[0].password;
          if (dbPassword === password) {
            const token: string = generateToken();
            const last_modified: string = new Date().toString();
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 2);
            const expiry: string = currentDate.toString();

            updateToken(token, rollno, last_modified, expiry)
              .then((results: QueryResult<any>) => {
                resolve(token);
              })
              .catch((error) => {
                reject("internal server error");
              });
          } else {
            reject("incorrect password");
          }
        } else {
          reject("roll no. doesn't exist");
        }
      })
      .catch((error) => {
        reject("internal server error");
      });
  });
}

export function updateDetails(
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
  program_type: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const last_modified: string = new Date().toString();
    putDetailsByRollno(
      rollno,
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
      last_modified
    )
      .then((results) => {
        resolve("successfully updated!");
      })
      .catch((error) => {
        console.log(error);
        reject("internal server error");
      });
  });
}


export function fetchUserByRollno ( rollno:string ) : Promise<any> {
  return new Promise((resolve, reject) => {
    fetchUser(rollno) .then((results) => {
      resolve(results.rows);
    })
    .catch((error) => {
      console.log("Service error: ", error);
      reject("internal server error");
    })
  })
}

export function addInExamRegisteration ( rollno:string, course_code:string) : Promise<string> {
  return new Promise((resolve, reject) => {
    const last_modified: string = new Date().toString();
    addExamRegisteration(rollno, course_code, last_modified).then((results) => {
      resolve("Successfully inserted in Exam Registeration!");
    }).catch((error) => {
      console.log("Exam registeration service error: ",error);
      reject("Internal server error");
    })
  })
}


export function fetchTheCourses ( semester:number, program:string ): Promise<any> {
  return new Promise((resolve, reject) => {
    fetchCourses(semester,program). then((results) => {
      resolve(results.rows);
    }).catch((error) => {
      console.log("error in fetching courses: ",error);
      reject("Internal server error 1");
    })
  })
}

export function fetchTheCoursesRollNo ( rollno:string ) : Promise<any> {
  return new Promise((resolve, reject) => {
    fetchCoursesRollNo(rollno). then((results) => {
      resolve(results.rows);
    }).catch ((error) => {
      console.log("error in fetching courses by rollno: ",error);
      reject("Internal server error roll 1");
    })
  })
}

export function fetchTheExamRegistration ( rollno:string ) :Promise<any> {
  return new Promise((resolve, reject) => {
    fetchExamRegistration(rollno). then((result) => {
      resolve(result.rows);
    }).catch((error) => {
      console.log("error in fetching exam registeration: ",error);
      reject("Internal server error fetch exam registeration 1");
    })
  })
}

export function fetchTheExamRegistrationCourse (course_code:string) :Promise<any> {
  return new Promise((resolve, reject) => {
    fetchExamRegistrationCourse(course_code). then((result) => {
      resolve(result.rows);
    }).catch((error) => {
      console.log("error in fetching exam registeration by course: ",error);
      reject("Internal server error fetch exam registeration course 1");
    })
  })
}

export function fetchTheExamRegistrationProgramAndSemester (program:string ,semester:number) :Promise<any> {
  return new Promise((resolve, reject) => {
    fetchExamRegistrationProgramAndSemester(program ,semester). then((result) => {
      resolve(result.rows);
    }).catch((error) => {
      console.log("error in fetching exam registeration by program and course: ",error);
      reject("Internal server error fetch exam registeration progrtam and semester 1");
    })
  })
}