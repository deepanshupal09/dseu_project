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
  addExamRegisterationByRollno,
  fetchCoursesBySemester,
  fetchCoursesByRollNo,
  fetchExamRegistrationByRollNo,
  fetchExamRegistrationByCourseCode,
  fetchExamRegistrationByProgramAndSemester
} from "./queries";

export function fetchPasswordByRollNo(
  rollno: string
): Promise<QueryResult<any>> {
  return new Promise((resolve, reject) => {
    pool.query(getPasswordByRollno, [rollno], (error, results) => {
      if (error) {
        reject(error);
      } else {
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
  last_modified: string,
  password: string,
  program_type: string
): Promise<QueryResult<any>> {
  console.log("here");
  return new Promise((resolve, reject) => {
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
        last_modified,
        rollno,
        password,
        program_type
      ],
      (error, results) => {
        if (error) {
            console.log("model", error)
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

export function fetchUser ( rollno:string ) : Promise<QueryResult<any>> { 
  return new Promise(( resolve, reject )=> {
    pool.query(getUserByRollno, [rollno], (error, results) => {
      if (error) {
        console.log("Model error: ",error);
        reject(error);
      } else{
        resolve(results);
      }
    });
  })
}

export function addExamRegisteration ( rollno:string, course_code:string, last_modified:string ): Promise<QueryResult<any>> {
  return new Promise((resolve, reject) => {
    pool.query(addExamRegisterationByRollno, [rollno, course_code, last_modified], (error, results)=>{
      if(error) {
        console.log("Exam registeration model error: ",error);
        reject(error);
      } else {
        resolve(results);
      }
    })
  })
}


export function fetchCourses(semester: number, program: string): Promise<QueryResult<any>> {
  return new Promise((resolve, reject) => {
    pool.query(fetchCoursesBySemester, [semester, program], (error, results) => {
      if (error) {
        console.log("fetch courses error: ",error);
        reject(error);
      } else {
        resolve(results);
      }
    });
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

export function fetchExamRegistration( rollno:string ): Promise<QueryResult<any>> {
  return new Promise((resolve, reject) => {
    pool.query(fetchExamRegistrationByRollNo, [rollno], (error, results) => {
      if(error) {
        reject(error);
      } else{
        resolve(results);
      }
    })
  })
}

export function fetchExamRegistrationCourse( course_code:string) :Promise<QueryResult<any>> {
  return new Promise ((resolve, reject) => {
    pool.query(fetchExamRegistrationByCourseCode, [course_code], (error, results)=> {
      if(error) {
        reject(error);
      } else{
        resolve(results);
      }
    })
  })
}
export function fetchExamRegistrationProgramAndSemester( program:string ,semester:number) :Promise<QueryResult<any>> {
  return new Promise ((resolve, reject) => {
    pool.query(fetchExamRegistrationByProgramAndSemester, [program ,semester], (error, results)=> {
      if(error) {
        reject(error);
      } else{
        resolve(results);
      }
    })
  })
}