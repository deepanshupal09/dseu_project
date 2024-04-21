// service.ts

import { Request, Response } from "express"; // Assuming you're using Express

import { QueryResult } from "pg";
import {
  fetchPasswordByRollNo,
  fetchTokenByRollNo,
  putDetailsByRollno,
  updateToken,
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
            bcrypt.hash("anan41521005", 10).then(function(hash) {
              console.log(hash)
          });
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
  password: string
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
