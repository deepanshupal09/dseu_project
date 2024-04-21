"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchExamRegistrationByProgramAndSemester = exports.fetchExamRegistrationByCourseCode = exports.fetchExamRegistrationByRollNo = exports.fetchCoursesByRollNo = exports.fetchCoursesBySemester = exports.addExamRegisterationByRollNo = exports.signup = exports.updateDetailsByRollno = exports.login = exports.getUserByRollno = void 0;
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
        res.status(400).send({ message: "There is some error encountered!" });
        console.log("error: ", error);
    }
};
exports.getUserByRollno = getUserByRollno;
const login = (req, res) => {
    try {
        const rollno = req.headers.rollno;
        const password = req.headers.password;
        console.log("rollno", password);
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
const updateDetailsByRollno = (req, res) => {
    try {
        const { program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, program_type, rollno, password } = req.body;
        console.log(req.body);
        (0, service_1.updateDetails)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, password).then((results) => {
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
    console.log('singup');
    try {
        const { program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, rollno, password } = req.body;
        console.log(101, req.body);
        (0, service_1.updateDetails)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, password).then((results) => {
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
        const semester = parseInt(req.headers.semester);
        const program = req.headers.program;
        console.log("semester , course_code :", semester, program);
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
        console.log("rolllno: ", rollno);
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
        (0, service_1.fetchTheExamRegistrationProgramAndSemester)(program, semester).then((results) => {
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
