// service.ts

import { Request, Response } from "express"; // Assuming you're using Express

import { QueryResult } from "pg";
import {
  fetchPasswordByRollNo,
  fetchTokenByRollNo,
  putDetailsByRollno,
  updateToken,
  fetchUser,
  // addExamRegisteration,
  fetchCourses,
  fetchCoursesRollNo,
  fetchExamRegistration,
  fetchExamRegistrationCourse,
  fetchExamRegistrationProgramAndSemester,
  insertUsers,
  insertExamRegisterations
} from "./model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export function handleLogin(
  rollno: string,
  password: string
): Promise<{ token: string; defaultPass: boolean }> {
  return new Promise((resolve, reject) => {
    fetchPasswordByRollNo(rollno)
      .then((results: QueryResult<any>) => {
        if (results.rows.length > 0) {
          const dbPassword = results.rows[0].password;
          bcrypt.compare(password, dbPassword).then(function (result) {
          //   bcrypt.hash("anan41521005", 10).then(function(hash) {
          //     console.log(hash)
          // });
            if (result) {
              const token = jwt.sign({ user: results.rows[0] }, "chotahathi", {
                expiresIn: "2h",
              });
              const default_pass =
                (results.rows[0].name + "0000").substring(0, 4) + rollno;

              const result = {
                token: token,
                defaultPass: password === default_pass,
              };
              resolve(result);
            } else {
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
  password: string,
  program_type: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const last_modified: string = new Date().toString();
    console.log("rollno ", rollno);
    fetchPasswordByRollNo(rollno).then((result) => {
      console.log("service ", result.rows);
      if (result.rows.length > 0) {
        bcrypt.hash(password, 10).then(function (hash) {
          // Store hash in your password DB.
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
            last_modified,
            program_type,
            hash
          )
            .then((results) => {
              resolve("successfully updated!");
            })
            .catch((error) => {
              console.log(error);
              reject("internal server error");
            });
        });
      } else {
        reject("rollno not found!");
      }
    });
  });
}

export async function verifyTokenByRollNo(rollno: string) {
  try {
    const result = await fetchTokenByRollNo(rollno);
    return result.rows[0]; // Return token data or null if not found
  } catch (error) {
    throw new Error("Error verifying token");
  }
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

export function insertTheUsers(users: any): Promise<any> {
  console.log("hello");
  return new Promise((resolve, reject) => {
    let data:any=[];
    // Use Promise.all to wait for all bcrypt hash operations to complete
    Promise.all(users.map((user:any) => {
      const password = (user.name.toUpperCase()+'0000').substring(0, 4) + user.rollno;
      return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function(err, hash) {
          data.push({...user,password:hash});
          resolve(data);
        });
      });
    })).then(() => {
      console.log("data: ",data);
      // Assuming insertUsers returns a Promise
      insertUsers(data).then((result) => {
        resolve(result.rows);
      }).catch((error) => {
        console.log("Error in inserting users: ", error);
        reject("Internal server error in insertUsers 1");
      });
    }).catch((error) => {
      console.log("Error in hashing passwords: ", error);
      reject("Internal server error in hashing passwords");
    });
  });
}

export function insertTheExamRegisterations(registeration: any): Promise<any> {
  console.log("hello");
  return new Promise((resolve, reject) => {
    insertExamRegisterations(registeration).then((result) => {
      resolve(result.rows);
    }).catch((error) => {
      console.log("Error in inserting exam registerations: ", error);
      reject("Internal server error in insertExamRegisterations");
    });
  });
}


