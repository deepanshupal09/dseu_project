"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginByEmailId = exports.fetchStudentByCampusAndProgram = exports.fetchStudentByProgramAndSemester = exports.updatePasswordByOtp = exports.verifyOtpAndPassword = exports.sendEmail = exports.fetchEmailIdByRollno = exports.fetchProgramByProgramType = exports.addExamRegisterations = exports.addUsers = exports.fetchExamRegistrationByProgramAndSemester = exports.fetchExamRegistrationByCourseCode = exports.fetchExamRegistrationByRollNo = exports.fetchCoursesByRollNo = exports.fetchCoursesBySemester = exports.signup = exports.updateDetailsByRollno = exports.login = exports.getUserByRollno = void 0;
const service_1 = require("./service");
const otp_generator_1 = __importDefault(require("./otp_generator"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
dotenv_1.default.config();
const getUserByRollno = (req, res) => {
    try {
        const rollno = req.headers.rollno;
        if (rollno) {
            (0, service_1.fetchUserByRollno)(rollno).then((results) => {
                res.status(200).send(results);
            })
                .catch((error) => {
                res.status(500).send("internal server error");
            });
        }
    }
    catch (error) {
        res.status(400).send({ message: "There is some error encountered!" });
        
    }
};
exports.getUserByRollno = getUserByRollno;
const login = (req, res) => {
    try {
        const rollno = req.headers.rollno;
        const password = req.headers.password;
        
        if (rollno && password) {
            (0, service_1.handleLogin)(rollno, password)
                .then(({ token, defaultPass }) => {
                res.status(200).send({ token, defaultPass });
            })
                .catch((error) => {
                if (error === "internal server error")
                    res.status(500).send({ message: "Internal Server Error!" });
                else if (error === "incorrect password")
                    res.status(400).send({ message: "Incorrect Password" });
                else
                    res.status(404).send({ message: "RollNo not found!" });
            });
        }
        else {
            res.status(404).send({ message: "RollNo not found!" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error!" });
    }
};
exports.login = login;
const loginByEmailId = (req, res) => {
    try {
        const emailid = req.headers.emailid;
        const password = req.headers.password;
        
        if (emailid && password) {
            (0, service_1.handleLoginByEmailId)(emailid, password)
                .then(({ token }) => {
                res.status(200).send({ token });
            })
                .catch((error) => {
                if (error === "internal server error")
                    res.status(500).send({ message: "Internal Server Error!" });
                else if (error === "incorrect password")
                    res.status(400).send({ message: "Incorrect Password" });
                else
                    res.status(404).send({ message: "admin email id not found!" });
            });
        }
        else {
            res.status(404).send({ message: "email id not found!" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error!" });
    }
};
exports.loginByEmailId = loginByEmailId;
const updateDetailsByRollno = (req, res) => {
    try {
        const { program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, aadhar, abc_id, pwbd_certificate, photo, program_type, password, rollno, year_of_admission } = req.body;
        
        (0, service_1.updateDetails)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, aadhar, abc_id, pwbd_certificate, photo, program_type, password, year_of_admission).then((results) => {
            res.status(200).send("successfully updated!");
        }).catch((error) => {
            res.status(500).send("internal server error");
        });
    }
    catch (error) {
        res.send("internal server error");
    }
};
exports.updateDetailsByRollno = updateDetailsByRollno;
function signup(req, res) {
    
    try {
        const { program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, aadhar, abc_id, pwbd_certificate, photo, program_type, password, rollno, year_of_admission } = req.body;
        
        (0, service_1.updateDetails)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, aadhar, abc_id, pwbd_certificate, photo, program_type, password, year_of_admission).then((results) => {
            res.status(200).send({ message: "successfully updated!" });
        }).catch((error) => {
            res.status(500).send({ message: "internal server error" });
            res.status(500).send({ message: "internal server error" });
        });
    }
    catch (error) {
        res.send({ message: "internal server error" });
    }
}
exports.signup = signup;
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
const fetchCoursesBySemester = (req, res) => {
    try {
        const semester = parseInt(req.headers.semester);
        const program = req.headers.program;
        
        (0, service_1.fetchTheCourses)(semester, program).then((results) => {
            res.status(200).send(results);
        }).catch((error) => {
            res.status(500).send("internal server 2");
        });
    }
    catch (error) {
        res.send("Internal server error 3");
    }
};
exports.fetchCoursesBySemester = fetchCoursesBySemester;
const fetchCoursesByRollNo = (req, res) => {
    try {
        const rollno = req.headers.rollno;
        
        (0, service_1.fetchTheCoursesRollNo)(rollno).then((results) => {
            
            res.status(200).send(results);
        }).catch((error) => {
            res.status(500).send("internal server error roll 2");
        });
    }
    catch (error) {
        res.send("Internal server error roll 3");
    }
};
exports.fetchCoursesByRollNo = fetchCoursesByRollNo;
const fetchExamRegistrationByRollNo = (req, res) => {
    try {
        const rollno = req.headers.rollno;
        
        (0, service_1.fetchTheExamRegistration)(rollno).then((results) => {
            res.status(200).send(results);
        }).catch((error) => {
            res.status(500).send("internal server error exam registeration 2");
        });
    }
    catch (error) {
        res.send("Internal server error exam registeration 3");
    }
};
exports.fetchExamRegistrationByRollNo = fetchExamRegistrationByRollNo;
const fetchExamRegistrationByCourseCode = (req, res) => {
    try {
        const course_code = req.headers.course_code;
        (0, service_1.fetchTheExamRegistrationCourse)(course_code).then((results) => {
            res.status(200).send(results);
        }).catch((error) => {
            res.status(500).send("Internal server error fetch exam registeration course 2");
        });
    }
    catch (error) {
        res.send("Internal server error fetch exam registeration course 3");
    }
};
exports.fetchExamRegistrationByCourseCode = fetchExamRegistrationByCourseCode;
const fetchExamRegistrationByProgramAndSemester = (req, res) => {
    try {
        const semester = parseInt(req.headers.semester);
        const program = req.headers.program;
        const campus = req.headers.campus;
        const program_type = req.headers.program_type;
        (0, service_1.fetchTheExamRegistrationProgramAndSemester)(campus, program_type, program, semester).then((results) => {
            res.status(200).send(results);
        }).catch((error) => {
            res.status(500).send("Internal server error fetch exam registeration program and semester 2");
        });
    }
    catch (error) {
        res.send("Internal server error fetch exam registeration program and semester 3");
    }
};
exports.fetchExamRegistrationByProgramAndSemester = fetchExamRegistrationByProgramAndSemester;
const addUsers = (req, res) => {
    try {
        const users = req.body;
        
        (0, service_1.insertTheUsers)(users).then((results) => {
            res.status(200).send({ message: "succesfully inserted!" });
        }).catch((error) => {
            res.status(500).send({ messge: "Internal server error insert in users 2" });
        });
    }
    catch (error) {
        res.send({ message: "Internal server error insert in users 3" });
    }
};
exports.addUsers = addUsers;
const addExamRegisterations = (req, res) => {
    try {
        const registeration = req.body;
        (0, service_1.insertTheExamRegisterations)(registeration).then((results) => {
            res.status(200).send("Successfully inserted!");
        }).catch((error) => {
            res.status(500).send("Internal server error in insertExamRegisterations");
        });
    }
    catch (error) {
        res.send("Internal server error in addExamRegisterations");
    }
};
exports.addExamRegisterations = addExamRegisterations;
const fetchProgramByProgramType = (req, res) => {
    try {
        const program_type = req.headers.program_type;
        (0, service_1.fetchTheProgram)(program_type).then((results) => {
            res.status(200).send(results);
        }).catch((error) => {
            res.status(500).send("Internal server error in fetchProgramByProgramType");
        });
    }
    catch (error) {
        res.send("Internal server error in fetchProgram controller");
    }
};
exports.fetchProgramByProgramType = fetchProgramByProgramType;
const fetchEmailIdByRollno = (req, res) => {
    try {
        const rollno = req.headers.rollno;
        (0, service_1.fetchTheEmailId)(rollno).then((results) => {
            res.status(200).send({ email: results });
        }).catch((error) => {
            res.status(500).send({ error: "Internal server error in fetchemailid" });
        });
    }
    catch (error) {
        res.send({ error: "Internal server error in fetchProgram controller" });
    }
};
exports.fetchEmailIdByRollno = fetchEmailIdByRollno;
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_MAIL, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
});
const sendEmail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rollno = req.headers.rollno;
        const otp = (0, otp_generator_1.default)();
        yield (0, service_1.otpUpdateService)(otp, rollno);
        const email = yield (0, service_1.fetchTheEmailId)(rollno);
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
            }
            else {
                
                res.status(200).send({ message: 'Email sent successfully!' });
            }
        });
    }
    catch (error) {
        console.error('Error fetching email:', error);
        res.status(404).send({ email: 'Email not found!' });
    }
}));
exports.sendEmail = sendEmail;
const updatePasswordByOtp = (req, res) => {
    try {
        const { rollno, password } = req.headers;
        
        (0, service_1.updateThePassword)(password, rollno).then((results) => {
            res.status(200).send({ message: "Password updated successfully!" });
        }).catch((error) => {
            res.status(500).send({ message: "Internal server error in password updation 1" });
        });
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error in password updation 2" });
    }
};
exports.updatePasswordByOtp = updatePasswordByOtp;
const verifyOtpAndPassword = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { rollno, otp } = req.headers;
        
        const storedOTPResult = yield (0, service_1.otpVerifyService)(rollno);
        const storedOTP = (_a = storedOTPResult.rows[0]) === null || _a === void 0 ? void 0 : _a.otp;
        
        if (otp === storedOTP) {
            res.status(200).send({ message: "OTP verified successfully!" });
        }
        else {
            res.status(400).send({ message: "Invalid OTP" });
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Internal server error in verifying otp and password!' });
    }
}));
exports.verifyOtpAndPassword = verifyOtpAndPassword;
const fetchStudentByProgramAndSemester = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const program_type = req.headers.program_type;
        const program = req.headers.program;
        const semester = parseInt(req.headers.semester);
        (0, service_1.fetchTheStudent)(program_type, program, semester).then((results) => {
            res.status(200).send(results);
        }).catch(() => {
            res.status(500).send("Internal server error fetch students program and semester 2");
        });
    }
    catch (error) {
        res.status(500).send('Internal server error in fetch students 3');
    }
}));
exports.fetchStudentByProgramAndSemester = fetchStudentByProgramAndSemester;
const fetchStudentByCampusAndProgram = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campus = req.headers.campus;
        const program_type = req.headers.program_type;
        const program = req.headers.program;
        const semester = parseInt(req.headers.semester);
        (0, service_1.fetchTheStudentCampus)(campus, program_type, program, semester).then((results) => {
            res.status(200).send(results);
        }).catch(() => {
            res.status(500).send("Internal server error fetch students program and semester 2");
        });
    }
    catch (error) {
        res.status(500).send('Internal server error in fetch students 3');
    }
}));
exports.fetchStudentByCampusAndProgram = fetchStudentByCampusAndProgram;
