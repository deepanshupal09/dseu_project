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
  fetchTheCourseDetails,
  updateMultipleUsersDetails,
  updateTheExam,
  fetchTheCampus,
  fetchTheExamControl,
  deleteExam
} from "./service";
import generateOTP from "./otp_generator"
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
dotenv.config();


interface Course {
  course_code: string,
  course_name: string,
  last_modified: Date,
  course_type: string
}


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
          console.log("login error: ", error)
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
    updateDetails(rollno, program, semester, date_of_birth, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, aadhar, abc_id, pwbd_certificate, photo, program_type, password, year_of_admission).then((results)=>{
        res.status(200).send({message: "successfully updated!"})
    }).catch((error)=>{
        res.status(500).send({message: "internal server error"});
    })
} catch (error) {
      res.send({message: "internal server error"});    
  }
};

// const updateMultipleDetailsByRollno = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Extract the list of user details from the request body
//     const userList: UserDetails[] = req.body;
//     console.log(userList);

//     // Call the updateSelectedDetails service function with the provided user list
//     const updateResults = await updateSelectedDetails(userList);

//     // Send back the results of the update operations
//     res.status(200).json({
//       message: "Update operations completed",
//       results: updateResults
//     });
//   } catch (error) {
//     console.error(`Error updating multiple user details: ${error}`);
//     res.status(500).send("Internal server error");
//   }
// };

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
const updateMultipleDetailsByRollno = (req: Request, res: Response): void => {
  console.log('updateMultipleUsers');
  try {
      const users = req.body; // Assuming req.body is an array of user objects
      console.log('Received users to update: ', users);

      updateMultipleUsersDetails(users).then((message) => {
          res.status(200).send({ message });
      }).catch((error) => {
          console.error('Error in updateMultipleUsers: ', error);
          res.status(500).send({ message: "internal server error" });
      });
  } catch (error) {
      console.error('Catch block error in updateMultipleUsers: ', error);
      res.status(500).send({ message: "internal server error" });
  }
}


const fetchCoursesBySemester = (req: Request, res: Response):void => {
  try{
    const semester: number = parseInt(req.headers.semester as string);
    const program: string = req.headers.program as string;
    const campus: string = req.headers.campus as string;
    const program_type: string = req.headers.program_type as string;
    console.log("semester , course_code :", semester, program);
    fetchTheCourses(campus, program, semester, program_type).then((results) => {
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
    const course_code:string =req.headers.coursecode as string;
    const campus:string =req.headers.campus as string;
    console.log("course: ",course_code, " ",campus)
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

const sendUserDetailsEmail = asyncHandler(async (req: Request, res: Response) => {
  try {
    const rollno: string = req.headers.rollno as string;
    const userDetails = await fetchUserByRollno(rollno);
    const examRegistrationDetails = await fetchTheExamRegistration(rollno);
    console.log("userdetails: ",userDetails);
    console.log("userdetails 2: ",examRegistrationDetails);
    // Check if user details were found
    if (userDetails.rowCount === 0) {
      throw new Error('No user found with the provided roll number.');
    }
    if (examRegistrationDetails.rowCount === 0) {
      throw new Error('User with the provided roll number has not registered for exam registration.');
    }

    const user = userDetails[0];
    console.log("user: ",user);
    const examUser = examRegistrationDetails;
    console.log("examUser: ",examUser);

    let coursesText = 'Here are the courses you registered in your exam for:\n';
    examUser.forEach((course:Course) => {
      coursesText += `${course.course_name}\n`;
    });


    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: user.emailid, // Assuming 'emailid' is the column name for email in the 'users' table
      subject: 'Your Details',
      text: `Here are your details Rollno: ${user.rollno} entered:\n\n` +
            `Name: ${user.name}\n` +
            `Program: ${user.program}\n` +
            `Semester: ${user.semester}\n` +
            `Phone: ${user.phone}\n` +
            `Campus: ${user.campus}\n` +
            `Email ID: ${user.emailid}\n` +
            `Gender: ${user.gender}\n` +
            `Alternate Phone: ${user.alternate_phone}\n` +
            `Father's Name: ${user.father}\n` +
            `Mother's Name: ${user.mother}\n` +
            `Guardian's Name: ${user.guardian}\n` +
            `ABC ID: ${user.abc_id}\n` +
            `Aadhar Number: ${user.aadhar}\n` +
            `PWBD Certificate: ${user.pwbd_certificate}\n` +
            `Program Type: ${user.program_type}\n` +
            `Year of Admission: ${user.year_of_admission}\n` +
            `Date of Birth: ${user.dob}\n\n` +
            coursesText + // Add the courses text here
            `\nPlease verify your details.` 
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Internal Server Error!' });
      } else {
        console.log('Email sent successfully!');
        res.status(200).send({ message: 'Email sent successfully!' });
      }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(404).send({ message: 'User not found!' });
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
    const coursedetails = req.body;
    console.log("coursedetails: ",coursedetails)
    fetchTheCourseDetails(coursedetails).then((results)=>{
      res.status(200).send(results);
    }).catch(()=>{
      res.status(500).send("Internal server error fetch course details 2")
    })
  }
  catch(error){
    res.status(500).send('Internal server error in fetch course details 3');
  }
}

const updateExamControl = (req: Request, res: Response) => {
  try{
    const users =req.body;
    updateTheExam(users).then((results)=>{
      res.status(200).send({message: "successfully updated!"});
    }).catch((error)=>{
      console.error('Error in updateMultipleUsers: ', error);
      res.status(500).send({message: "internal server error"});
    })
  }
  catch(error){
    res.send({message: "internal server error"});    
  }
}

// const fetchExamControl = (req: Request, res: Response) => {
//   try{
//     const campus:string = req.headers.campus as string;
//     const program:string = req.headers.program as string;
//     const program_type:string = req.headers.program_type as string;
//     const semester: number = parseInt(req.headers.semester as string); 
//     console.log("campus: ",campus, program, semester)
//     fetchTheExamControl(campus, program, semester, program_type).then((results)=>{
//       res.status(200).send(results);
//     }).catch((error)=>{
//       console.error('Error in updateMultipleUsers: ', error);
//       res.status(500).send({message: "internal server error in fetch exam control"});
//     })
//   }
//   catch(error){
//     res.send({message: "internal server error"});    
//   }
// }

const fetchExamControl = (req: Request, res: Response) => {
  try{
    const campus:string = req.headers.campus as string;
    const program:string = req.headers.program as string;
    // const program_type:string = req.headers.program_type as string;
    const semester: number = parseInt(req.headers.semester as string); 
    console.log("campus: ",campus, program, semester)
    fetchTheExamControl(campus, program, semester).then((results)=>{
      res.status(200).send(results);
    }).catch((error)=>{
      console.error('Error in updateMultipleUsers: ', error);
      res.status(500).send({message: "internal server error in fetch exam control"});
    })
  }
  catch(error){
    res.send({message: "internal server error"});    
  }
}

const fetchCampusDetails = (req:Request, res:Response) => {
  try{
    fetchTheCampus().then((results)=>{
      res.status(200).send(results)
    }).catch((error)=>{
      res.status(500).send("Internal server error fetch campus details")
    })
  }
  catch(error){
    res.send({message: "internal server error"});
  }
}

const deleteExamRegistrationByRollno = (req:Request, res:Response) => {
  try{
    const rollno:string = req.headers.rollno as string;
    deleteExam(rollno).then((results)=>{
      res.status(200).send({message:"exam registration deleted!"})
    }).catch((error)=>{
      res.status(500).send("Internal server error exam reg. delete")
    })
  }
  catch(error){
    res.send({message: "internal server error"});
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
  fetchCourseDetailsByCourseCode,
  sendUserDetailsEmail,
  updateMultipleDetailsByRollno,
  updateExamControl,
  fetchCampusDetails,
  fetchExamControl,
  deleteExamRegistrationByRollno
};
