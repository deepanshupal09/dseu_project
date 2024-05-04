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
  insertTheExamRegisterations,
  fetchTheProgram,
  fetchTheEmailId,
  otpUpdateService,
  otpVerifyService,
  updateThePassword,
  fetchTheStudent,
  fetchTheStudentCampus,
  handleLoginByEmailId,
  fetchTheCourseDetails
} from "./service";
import generateOTP from "./otp_generator"
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
dotenv.config();



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
    console.log("rollno",  rollno)

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

const loginByEmailId = (
  req: Request,
  res: Response
): void => {
  try {
    const emailid: string = req.headers.emailid as string;
    const password: string = req.headers.password as string;
    console.log("email id",  emailid)

    if (emailid && password) {
      handleLoginByEmailId(emailid, password)
        .then(({token}) => {
          res.status(200).send({token});
        })
        .catch((error: string) => {
          if (error === "internal server error")
            res.status(500).send({message: "Internal Server Error!"});
          else if (error === "incorrect password")
            res.status(400).send({message: "Incorrect Password"});
          else res.status(404).send({message: "admin email id not found!"});
        });
      } else {
        res.status(404).send({message: "email id not found!"});
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
      year_of_admission,
      date_of_birth
    } = req.body;
    console.log(req.body)
    updateDetails(date_of_birth,rollno, program, semester, phone,campus,emailid, gender, alternate_phone, father, mother, guardian,aadhar,abc_id,pwbd_certificate, photo, program_type, password,year_of_admission).then((results)=>{
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
      date_of_birth,
      pwbd_certificate,
      photo,
      program_type,
      password,
      rollno,
      year_of_admission
    } = req.body;
    console.log(101,req.body)
    updateDetails(rollno, program, semester,date_of_birth, phone,campus,emailid, gender, alternate_phone, father, mother, guardian,aadhar,abc_id,pwbd_certificate, photo, program_type,password,year_of_admission).then((results)=>{
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
    const campus: string = req.headers.campus as string;
    console.log("semester , course_code :", semester, program);
    fetchTheCourses(campus, program, semester).then((results) => {
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
      // console.log("results: ", results)
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
    // console.log("exam registration: ", rollno)
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
    const campus:string =req.headers.campus as string;
    fetchTheExamRegistrationCourse(campus, course_code).then((results) => {
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
    const campus: string = req.headers.campus as string;
    const programtype:string = req.headers.programtype as string;

    console.log("program_type: ", req.headers)
    fetchTheExamRegistrationProgramAndSemester(campus, programtype, program, semester).then((results) => {
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
    console.log("users: ", users)
    insertTheUsers(users).then((results) => {
      res.status(200).send({message: "succesfully inserted!"});
    }).catch((error) => {
      res.status(500).send({messge: "Internal server error insert in users 2"});
    })
  } catch (error) {
    res.send({message: "Internal server error insert in users 3"});
  }
}

const addExamRegisterations = (req: Request, res: Response): void => {
  try {
    const registeration = req.body;
    console.log("registration: ", req.body)
    insertTheExamRegisterations(registeration).then((results) => {
      res.status(200).send("Successfully inserted!");
    }).catch((error) => {
      res.status(500).send("Internal server error in insertExamRegisterations");
    })
  } catch (error) {
    res.send("Internal server error in addExamRegisterations");
  }
}

const fetchProgramByProgramType = (req: Request, res: Response): void => {
  try{
    const program_type:string = req.headers.program_type as string;
    fetchTheProgram(program_type).then((results)=> {
      res.status(200).send(results);
    }).catch((error)=>{
      res.status(500).send("Internal server error in fetchProgramByProgramType");
    })
  }
  catch(error){
    res.send("Internal server error in fetchProgram controller");
  }
}

const fetchEmailIdByRollno = (req: Request, res: Response): void => {
  try{
    const rollno: string = req.headers.rollno as string;
    fetchTheEmailId(rollno).then((results)=> {
      res.status(200).send({email: results});
    }).catch((error)=>{
      res.status(500).send({error: "Internal server error in fetchemailid"});
    })
  }
  catch(error){
    res.send({error: "Internal server error in fetchProgram controller"});
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

const sendEmail = asyncHandler(async (req: Request, res: Response) => {
  try {
    const rollno: string = req.headers.rollno as string;
    const otp = generateOTP(); 

    await otpUpdateService(otp,rollno);
    const email = await fetchTheEmailId(rollno);
    
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: 'OTP for Password Change',
      text: `Your OTP for password change is ${otp}. Please ignore this email if you did not request a password change.`, 
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Internal Server Error!' });
      } else {
        console.log('Email sent successfully!');
        res.status(200).send({message: 'Email sent successfully!'});
      }
    });
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(404).send({email: 'Email not found!'});
  }
});

const updatePasswordByOtp = (req: Request, res: Response)=>{
  try{
    const {rollno, password} = req.headers;
    console.log("rollno, ",rollno, "password: ",password)
    updateThePassword(password as string, rollno as string).then((results)=> {
      res.status(200).send({message: "Password updated successfully!"});
    }).catch((error)=>{
      res.status(500).send({message: "Internal server error in password updation 1"});
    })
  }
  catch(error){
    res.status(500).send({message: "Internal server error in password updation 2"});
  }
}

const verifyOtpAndPassword = (async(req: Request, res: Response)=>{
  try{
    const{rollno, otp} = req.headers; 
    console.log(otp);
    const storedOTPResult = await otpVerifyService(rollno as string);
    const storedOTP: string = storedOTPResult.rows[0]?.otp;
    console.log(storedOTP);

    if(otp === storedOTP ){
      res.status(200).send({message: "OTP verified successfully!"});
    } else{
      res.status(400).send({message: "Invalid OTP"});
    }
  }
  catch(error){
    res.status(500).send({message: 'Internal server error in verifying otp and password!'});
  }
})

const fetchStudentByProgramAndSemester = (async(req: Request, res: Response)=>{
  try{
    const program_type:string = req.headers.program_type as string;
    const program:string = req.headers.program as string;
    const semester: number = parseInt(req.headers.semester as string); 
    fetchTheStudent(program_type, program, semester).then((results)=>{
      res.status(200).send(results);
    }).catch(()=>{
      res.status(500).send("Internal server error fetch students program and semester 2")
    })
  }
  catch(error){
    res.status(500).send('Internal server error in fetch students 3');
  }
})

const fetchStudentByCampusAndProgram = (async(req: Request, res: Response)=>{
  try{
    const campus:string = req.headers.campus as string;
    const program_type:string = req.headers.program_type as string;
    const program:string = req.headers.program as string;
    const semester: number = parseInt(req.headers.semester as string); 
    fetchTheStudentCampus(campus, program_type, program, semester).then((results)=>{
      res.status(200).send(results);
    }).catch(()=>{
      res.status(500).send("Internal server error fetch students program and semester 2")
    })
  }
  catch(error){
    res.status(500).send('Internal server error in fetch students 3');
  }
})

const fetchCourseDetailsByCourseCode =(req: Request, res: Response)=>{
  try{
    const courseDetails = req.body;
    fetchTheCourseDetails(courseDetails).then((results)=>{
      res.status(200).send(results);
    }).catch(()=>{
      res.status(500).send("Internal server error fetch course details 2")
    })
  }
  catch(error){
    res.status(500).send('Internal server error in fetch course details 3');
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
  addExamRegisterations,
  fetchProgramByProgramType,
  fetchEmailIdByRollno,
  sendEmail,
  verifyOtpAndPassword,
  updatePasswordByOtp,
  fetchStudentByProgramAndSemester,
  fetchStudentByCampusAndProgram,
  loginByEmailId,
  fetchCourseDetailsByCourseCode
};
