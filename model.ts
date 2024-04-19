// model.ts

import { QueryResult } from "pg";
import pool from "./db";
import {
  getPasswordByRollno,
  putToken,
  fetchToken,
  pushTokenQuery,
  updateDetailsByRollno,
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
  last_modified: string
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
