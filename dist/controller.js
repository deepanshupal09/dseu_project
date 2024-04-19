"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCoursesBySemester = exports.addExamRegisterationByRollNo = exports.updateDetailsByRollno = exports.authenticateUserByRollnoAndPassword = exports.getUserByRollno = void 0;
const service_1 = require("./service");
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
        res.status(400).send("There is some error encountered!");
        console.log("error: ", error);
    }
};
exports.getUserByRollno = getUserByRollno;
const authenticateUserByRollnoAndPassword = (req, res) => {
    try {
        const rollno = req.headers.rollno;
        const password = req.headers.password;
        if (rollno && password) {
            (0, service_1.handleLogin)(rollno, password)
                .then((token) => {
                res.status(200).send(token);
            })
                .catch((error) => {
                if (error === "internal server error")
                    res.status(500).send("Internal Server Error!");
                else if (error === "incorrect password")
                    res.status(400).send("Incorrect Password");
                else
                    res.status(404).send("RollNo not found!");
            });
        }
        else {
            res.status(404).send("RollNo not found!");
        }
    }
    catch (error) {
        res.status(500).send("Internal Server Error!");
    }
};
exports.authenticateUserByRollnoAndPassword = authenticateUserByRollnoAndPassword;
const updateDetailsByRollno = (req, res) => {
    try {
        const { program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, program_type, rollno, } = req.body;
        console.log(req.body);
        (0, service_1.updateDetails)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, program_type).then((results) => {
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
const addExamRegisterationByRollNo = (req, res) => {
    try {
        const { rollno, course_code } = req.body;
        (0, service_1.addInExamRegisteration)(rollno, course_code).then((results) => {
            res.status(200).send("succesfully inserted!");
        }).catch((error) => {
            res.status(500).send("internal server");
        });
    }
    catch (error) {
        res.send("internal server error");
    }
};
exports.addExamRegisterationByRollNo = addExamRegisterationByRollNo;
const fetchCoursesBySemester = (req, res) => {
    try {
        const semester = parseInt(req.params.semester);
        const course_code = req.params.course_code;
        (0, service_1.fetchTheCourses)(semester, course_code).then((results) => {
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
