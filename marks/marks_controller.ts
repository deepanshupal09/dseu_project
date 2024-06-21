import { Request, Response } from "express";
import {
    fetchTheStudentDetailsFromInternal,
    insertBridgeDetailsService,
    handleStudentDetailsFromInternal,
    fetchTheStudentDetailsFromExternal,
    handleStudentDetailsFromExternal,
    handleStudentDetailsFromAggregate,
    toggleMarksControlService,
    fetchMarksService,
    fetchStudentsCourseCodeService,
    fetchDepartDetailsByEmailidService,
    resetPasswordService,
    fetchTheStudentDetailsFromAggregate,
    fetchFreezeDetailsService,
    getEmailidAdminService,
    fetchMarkControlDetailsService,
    checkDepartmentService,
    fetchBridgeDetailsService,
} from "./marks_service";
import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

const insertBridgeDetails = (req: Request, res: Response): void => {
    const listOfStudents = req.body.students;
    insertBridgeDetailsService(listOfStudents)
        .then(() => {
            res.status(200).send({ message: "Operation Successfull!" });
        })
        .catch((error: any) => {
            res.status(500).send({ message: "Internal Server Error" });
        });
};

const fetchBridgeDetails = (req: Request, res: Response): void => {
    const { email, course_code, academic_year } = req.body;
    fetchBridgeDetailsService(email, course_code, academic_year)
        .then((list: any) => {
            res.status(200).send(list);
        })
        .catch((error: any) => {
            res.status(500).send({ message: "Internal Server Error" });
        });
};

const checkDepartment = (req: Request, res: Response): void => {
    const rollno = req.headers.rollno;
    const depEmail = req.headers.email;
    checkDepartmentService(rollno, depEmail)
        .then((name) => {
            res.status(200).send({ name: name });
        })
        .catch((error: any) => {
            res.status(500).send({ message: error.message });
        });
};

const fetchStudentDetailsFromInternalController = (req: Request, res: Response): void => {
    try {
        const details = req.body;
        //   console.log("semester , course_code :", semester, program);
        fetchTheStudentDetailsFromInternal(details)
            .then((results) => {
                res.status(200).send(results);
            })
            .catch((error) => {
                res.status(500).send({ message: "internal server fetch internal 2" });
            });
    } catch (error) {
        res.send({ message: "Internal server error internal 3" });
    }
};

const fetchStudentDetailsFromExternalController = (req: Request, res: Response): void => {
    try {
        const details = req.body;
        //   console.log("semester , course_code :", semester, program);
        fetchTheStudentDetailsFromExternal(details)
            .then((results) => {
                res.status(200).send(results);
            })
            .catch((error) => {
                res.status(500).send({ message: "internal server fetch internal 2" });
            });
    } catch (error) {
        res.send({ message: "Internal server error internal 3" });
    }
};
const fetchStudentDetailsFromAggregateController = (req: Request, res: Response): void => {
    try {
        const details = req.body;
        //   console.log("semester , course_code :", semester, program);
        fetchTheStudentDetailsFromAggregate(details)
            .then((results) => {
                res.status(200).send(results);
            })
            .catch((error) => {
                res.status(500).send({ message: "internal server fetch internal 2" });
            });
    } catch (error) {
        res.send({ message: "Internal server error internal 3" });
    }
};

const handleStudentDetailsFromInternalController = (req: Request, res: Response): void => {
    try {
        const details = req.body;
        //   console.log("semester , course_code :", semester, program);
        handleStudentDetailsFromInternal(details)
            .then((results) => {
                res.status(200).send({ message: "Operation Successfull!" });
            })
            .catch((error) => {
                res.status(500).send({ message: "internal server insert internal 2" });
            });
    } catch (error) {
        res.send({ message: "Internal server error insert internal 3" });
    }
};

const handleStudentDetailsFromExternalController = (req: Request, res: Response): void => {
    try {
        const details = req.body;
        //   console.log("semester , course_code :", semester, program);
        handleStudentDetailsFromExternal(details)
            .then((results) => {
                res.status(200).send({ message: "Operation Successfull!" });
            })
            .catch((error) => {
                res.status(500).send({ message: "internal server insert internal 2" });
            });
    } catch (error) {
        res.send({ message: "Internal server error insert internal 3" });
    }
};

const handleStudentDetailsFromAggregateController = (req: Request, res: Response): void => {
    try {
        const details = req.body;
        //   console.log("semester , course_code :", semester, program);
        handleStudentDetailsFromAggregate(details)
            .then((results) => {
                res.status(200).send({ message: "Operation Successfull!" });
            })
            .catch((error) => {
                res.status(500).send({ message: "internal server insert internal 2" });
            });
    } catch (error) {
        res.send({ message: "Internal server error insert internal 3" });
    }
};

const toggleMarksControlController = (req: Request, res: Response) => {
    try {
        const details = req.body;
        // console.log("789",details);
        toggleMarksControlService(details)
            .then((results) => {
                res.status(200).send({ message: "Marks control toggled!" });
            })
            .catch((error) => {
                res.status(500).send({ message: "internal server error at toggle marks control 1" });
            });
    } catch (error) {
        res.send({ message: "internal server error at toggle marks control 2" });
    }
};

const fetchMarksController = (req: Request, res: Response) => {
    try {
        const rollno: string = req.headers.rollno as string;
        const academic_year: string = req.headers.academicyear as string;
        const semester: number = parseInt(req.headers.semester as string);
        fetchMarksService(rollno, academic_year, semester)
            .then((results) => {
                res.status(200).send(results);
            })
            .catch((error) => {
                console.log("error:", error);
                res.status(500).send({ message: "internal server error at marks fetch 1" });
            });
    } catch (error) {
        res.send({ message: "internal server error at marks fetch 2" });
    }
};

const fetchDepartDetailsByEmailidController = (req: Request, res: Response) => {
    try {
        const emailid: string = req.headers.emailid as string;
        console.log(1, req.headers);
        // const academic_year: string = req.headers.academicyear as string;
        fetchDepartDetailsByEmailidService(emailid)
            .then((results) => {
                res.status(200).send(results);
            })
            .catch((error) => {
                console.log("error:", error);
                res.status(500).send({ message: "internal server error at fetch department 1" });
            });
    } catch (error) {
        res.send({ message: "internal server error at fetch department 2" });
    }
};

const resetPasswordController = (req: Request, res: Response) => {
    try {
        const emailid: string = req.headers.emailid as string;
        const password: string = req.headers.password as string;
        // const academic_year: string = req.headers.academicyear as string;
        resetPasswordService(password, emailid)
            .then((results) => {
                res.status(200).send(results);
            })
            .catch((error) => {
                console.log("error:", error);
                res.status(500).send({ message: "internal server error at reset password 1" });
            });
    } catch (error) {
        res.send({ message: "internal server error at reset password 2" });
    }
};

const fetchStudentsCourseCodeController = (req: Request, res: Response) => {
    try {
        const course_code: string = req.headers.coursecode as string;
        const campus: string = req.headers.campus as string;
        const program_type: string = req.headers.programtype as string;
        const program: string = req.headers.program as string;
        const semester: string = req.headers.semester as string;
        const academic_year: string = req.headers.academicyear as string;

        fetchStudentsCourseCodeService(course_code, campus, program_type, program, semester, academic_year)
            .then((results) => {
                res.status(200).send(results);
            })
            .catch((error) => {
                console.log("error:", error);
                res.status(500).send({ message: "internal server error at student fetch" });
            });
    } catch (error) {
        res.send({ message: "internal server error at student fetch 2" });
    }
};

const fetchFreezeDetailsController = (req: Request, res: Response) => {
    try {
        fetchFreezeDetailsService()
            .then((results) => {
                res.status(200).send(results);
            })
            .catch((error) => {
                console.log("error:", error);
                res.status(500).send("internal server error at freeze details 1");
            });
    } catch (error) {
        res.send("internal server error at freeze details 2");
    }
};

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_MAIL, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
});

//have to get campus
const sendEmailMarksController = asyncHandler(async (req: Request, res: Response) => {
    try {
        const email = await getEmailidAdminService();
        console.log("emails: ", email);

        //need to change the subject and text

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            bcc: email,
            subject: "all is well",
            text: `testing mail`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).send({ message: "Internal Server Error!" });
            } else {
                console.log("Email sent successfully!");
                res.status(200).send({ message: "Email sent successfully!" });
            }
        });
    } catch (error) {
        console.error("Error fetching email:", error);
        res.status(404).send({ email: "Email not found!" });
    }
});

const fetchMarkControlDetailsController = (req: Request, res: Response) => {
    try {
        // const details= req.body;
        fetchMarkControlDetailsService()
            .then((results) => {
                res.status(200).send(results);
            })
            .catch((error) => {
                console.log("error:", error);
                res.status(500).send("internal server error at freeze details 1");
            });
    } catch (error) {
        res.send("internal server error at freeze details 2");
    }
};

export {
    fetchStudentDetailsFromInternalController,
    handleStudentDetailsFromInternalController,
    fetchStudentDetailsFromExternalController,
    handleStudentDetailsFromExternalController,
    handleStudentDetailsFromAggregateController,
    toggleMarksControlController,
    fetchMarksController,
    fetchStudentsCourseCodeController,
    fetchDepartDetailsByEmailidController,
    resetPasswordController,
    fetchStudentDetailsFromAggregateController,
    fetchFreezeDetailsController,
    sendEmailMarksController,
    fetchMarkControlDetailsController,
    checkDepartment,
    insertBridgeDetails,
    fetchBridgeDetails,
};
