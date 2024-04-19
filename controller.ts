import { Request, Response } from "express";
import { handleLogin, updateDetails, fetchUserByRollno, addInExamRegisteration, fetchTheCourses} from "./service";

const getUserByRollno = (req: Request, res: Response): void => {
  try {
    const rollno: string = req.headers.rollno as string;
    if (rollno) {
      fetchUserByRollno(rollno).then((results)=> {
        res.status(200).send(results);
      }) 
      .catch ((error)=> {
        res.status(500).send("internal server error");
      })
    }
  } catch (error) {
    res.status(400).send("There is some error encountered!");
    console.log("error: ", error);
  }
};

const authenticateUserByRollnoAndPassword = (
  req: Request,
  res: Response
): void => {
  try {
    const rollno: string = req.headers.rollno as string;
    const password: string = req.headers.password as string;

    if (rollno && password) {
      handleLogin(rollno, password)
        .then((token: string) => {
          res.status(200).send(token);
        })
        .catch((error: string) => {
          if (error === "internal server error")
            res.status(500).send("Internal Server Error!");
          else if (error === "incorrect password")
            res.status(400).send("Incorrect Password");
          else res.status(404).send("RollNo not found!");
        });
    } else {
      res.status(404).send("RollNo not found!");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error!");
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
      program_type,
      rollno,
    } = req.body;
    console.log(req.body)
    updateDetails(rollno, program, semester, phone,campus,emailid, gender, alternate_phone, father, mother, guardian, program_type).then((results)=>{
        res.status(200).send("successfully updated!")
    }).catch((error)=>{
        res.status(500).send("internal server error");
    })
} catch (error) {
      res.send("internal server error");    
  }
};

const addExamRegisterationByRollNo = (req: Request, res: Response):void => {
  try {
    const {rollno, course_code} =req.body;
    addInExamRegisteration(rollno, course_code). then((results) =>{
      res.status(200).send("succesfully inserted!");
    }).catch((error) => {
      res.status(500).send("internal server");
    })
  }
  catch(error) {
    res.send("internal server error");
  }
}

const fetchCoursesBySemester = (req: Request, res: Response):void => {
  try{
    const semester: number = parseInt(req.params.semester);
    const course_code: string = req.params.course_code as string;
    fetchTheCourses(semester, course_code).then((results) => {
      res.status(200).send(results);
    }).catch((error) => {
      res.status(500).send("internal server 2");
    })
  }
  catch(error) {
    res.send("Internal server error 3");
  }
}

export {
  getUserByRollno,
  authenticateUserByRollnoAndPassword,
  updateDetailsByRollno,
  addExamRegisterationByRollNo,
  fetchCoursesBySemester
};
