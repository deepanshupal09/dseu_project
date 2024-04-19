// service.ts

import { Request, Response } from "express"; // Assuming you're using Express

import { QueryResult } from "pg";
import {
  fetchPasswordByRollNo,
  putDetailsByRollno,
  updateToken,
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
  guardian: string
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
