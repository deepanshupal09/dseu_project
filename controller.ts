import { Request, Response } from "express";
import { 
  handleLogin, 
  updateDetails, 
  fetchUserByRollno, 
  // addInExamRegisteration, 
  fetchTheCourses, 
  fetchTheCoursesRollNo,
  fetchTheExamRegistration,
  fetchTheExamRegistrationCourse,
  fetchTheExamRegistrationProgramAndSemester,
  insertTheUsers,
  insertTheExamRegisterations
} from "./service";

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
      aadhar,
      abc_id,
      pwbd_certificate,
      photo,
      program_type,
      password,
      rollno,
      year_of_admission
    } = req.body;
    console.log(req.body)
    updateDetails(rollno, program, semester, phone,campus,emailid, gender, alternate_phone, father, mother, guardian,aadhar,abc_id,pwbd_certificate, photo, program_type, password,year_of_admission).then((results)=>{
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
      aadhar,
      abc_id,
      pwbd_certificate,
      photo,
      program_type,
      password,
      rollno,
      year_of_admission
    } = req.body;
    console.log(101,req.body)
    updateDetails(rollno, program, semester, phone,campus,emailid, gender, alternate_phone, father, mother, guardian,aadhar,abc_id,pwbd_certificate, photo, program_type,password,year_of_admission).then((results)=>{
        res.status(200).send({message: "successfully updated!"})
    }).catch((error)=>{
        res.status(500).send({message: "internal server error"});
        res.status(500).send({message: "internal server error"});
    })
} catch (error) {
      res.send({message: "internal server error"});    
  }
}

// const addExamRegisterationByRollNo = (req: Request, res: Response):void => {
//   try {
//     const {rollno, course_code} =req.body;
//     addInExamRegisteration(rollno, course_code). then((results) =>{
//       res.status(200).send("succesfully inserted!");
//     }).catch((error) => {
//       res.status(500).send("internal server");
//     })
//   }
//   catch(error) {
//     res.send("internal server error");
//   }
// }

const fetchCoursesBySemester = (req: Request, res: Response):void => {
  try{
    const semester: number = parseInt(req.headers.semester as string);
    const program: string = req.headers.program as string;
    console.log("semester , course_code :", semester, program);
    fetchTheCourses(semester, program).then((results) => {
      res.status(200).send(results);
    }).catch((error) => {
      res.status(500).send("internal server 2");
    })
  }
  catch(error) {
    res.send("Internal server error 3");
  }
}

const fetchCoursesByRollNo = (req: Request, res: Response):void => {
  try{
    const rollno: string = req.headers.rollno as string;
    console.log("rolllno courses: ",rollno);
    fetchTheCoursesRollNo(rollno). then((results) => {
      console.log("results: ", results)
      res.status(200).send(results);
    }).catch((error) => {
      res.status(500).send("internal server error roll 2");
    })
  }
  catch(error){
    res.send("Internal server error roll 3");
  }
}

const fetchExamRegistrationByRollNo = (req: Request, res: Response):void => {
  try{
    const rollno: string = req.headers.rollno as string;
    console.log("exam registration: ", rollno)
    fetchTheExamRegistration(rollno).then((results) => {
      
      res.status(200).send(results);
    }).catch((error) => {
      res.status(500).send("internal server error exam registeration 2");
    })
  }
  catch(error){
    res.send("Internal server error exam registeration 3");
  }
}

const fetchExamRegistrationByCourseCode = (req: Request, res: Response):void => {
  try{
    const course_code:string =req.headers.course_code as string;
    fetchTheExamRegistrationCourse(course_code).then((results) => {
      res.status(200).send(results);
    }).catch((error) => {
      res.status(500).send("Internal server error fetch exam registeration course 2");
    })
  }
  catch(error){
    res.send("Internal server error fetch exam registeration course 3");
  }
}

const fetchExamRegistrationByProgramAndSemester = (req: Request, res: Response):void => {
  try{
    const semester: number = parseInt(req.headers.semester as string);
    const program: string = req.headers.program as string;
    fetchTheExamRegistrationProgramAndSemester(program, semester).then((results) => {
      res.status(200).send(results);
    }).catch((error) => {
      res.status(500).send("Internal server error fetch exam registeration program and semester 2");
    })
  }
  catch(error){
    res.send("Internal server error fetch exam registeration program and semester 3");
  }
}

const addUsers = (req: Request, res: Response): void => {
  try {
    const users = req.body;
    insertTheUsers(users).then((results) => {
      res.status(200).send("succesfully inserted!");
    }).catch((error) => {
      res.status(500).send("Internal server error insert in users 2");
    })
  } catch (error) {
    res.send("Internal server error insert in users 3");
  }
}

const addExamRegisterations = (req: Request, res: Response): void => {
  try {
    const registeration = req.body;
    insertTheExamRegisterations(registeration).then((results) => {
      res.status(200).send("Successfully inserted!");
    }).catch((error) => {
      res.status(500).send("Internal server error in insertExamRegisterations");
    })
  } catch (error) {
    res.send("Internal server error in addExamRegisterations");
  }
}

export {
  getUserByRollno,
  login,
  updateDetailsByRollno,
  signup,
  // addExamRegisterationByRollNo,
  fetchCoursesBySemester,
  fetchCoursesByRollNo,
  fetchExamRegistrationByRollNo,
  fetchExamRegistrationByCourseCode,
  fetchExamRegistrationByProgramAndSemester,
  addUsers,
  addExamRegisterations
};
