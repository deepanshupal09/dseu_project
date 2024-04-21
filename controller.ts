import pool from "./db";
import {
  getUserByRollno as getUserByRollnoQuery,
  getPasswordByRollno as getPasswordByRollnoQuery,
  updateDetailsByRollno as updateDetailsByRollnoQuery,
} from "./queries";
import { Request, Response } from "express";
import { handleLogin, updateDetails } from "./service";

const getUserByRollno = (req: Request, res: Response): void => {
  try {
    const rollno = req.headers.rollno;
    if (rollno) {
      pool.query(getUserByRollnoQuery, [rollno], (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
      });
    } else {
      res.status(400).send({message:"RollNo Is required!"});
    }
  } catch (error) {
    res.status(400).send({message: "There is some error encountered!"});
    console.log("error: ", error);
  }
};

const login = (
  req: Request,
  res: Response
): void => {
  try {
    const rollno: string = req.headers.rollno as string;
    const password: string = req.headers.password as string;
    console.log("rollno", password)

    if (rollno && password) {
      handleLogin(rollno, password)
        .then(({token, defaultPass}) => {
          res.status(200).send({token, defaultPass});
        })
        .catch((error: string) => {
          if (error === "internal server error")
            res.status(500).send({message: "Internal Server Error!"});
          else if (error === "incorrect password")
            res.status(400).send({message: "Incorrect Password"});
          else res.status(404).send({message: "RollNo not found!"});
        });
      } else {
        res.status(404).send({message: "RollNo not found!"});
      }
    } catch (error) {
    res.status(500).send({message: "Internal Server Error!"});
  }
};

const updateDetailsByRollno = (req: Request, res: Response): void => {
  try {
    const {
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
      rollno,
      password
    } = req.body;
    console.log(req.body)
    updateDetails(rollno, program, semester, phone,campus,emailid, gender, alternate_phone, father, mother, guardian,password).then((results)=>{
        res.status(200).send("successfully updated!")
    }).catch((error)=>{
        res.status(500).send("internal server error");
    })
} catch (error) {
      res.send("internal server error");    
  }
};

function signup(req: Request, res: Response):void {
  console.log('singup')
  try {
    const {
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
      rollno,
      password
    } = req.body;
    console.log(101,req.body)
    updateDetails(rollno, program, semester, phone,campus,emailid, gender, alternate_phone, father, mother, guardian,password).then((results)=>{
        res.status(200).send({message: "successfully updated!"})
    }).catch((error)=>{
        res.status(500).send({message: "internal server error"});
    })
} catch (error) {
      res.send({message: "internal server error"});    
  }
}

export {
  getUserByRollno,
  login,
  updateDetailsByRollno,
  signup
};
