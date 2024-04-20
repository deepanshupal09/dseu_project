"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDetailsByRollno = exports.login = exports.getUserByRollno = void 0;
const db_1 = __importDefault(require("./db"));
const queries_1 = require("./queries");
const service_1 = require("./service");
const getUserByRollno = (req, res) => {
    try {
        const rollno = req.headers.rollno;
        if (rollno) {
            db_1.default.query(queries_1.getUserByRollno, [rollno], (error, results) => {
                if (error)
                    throw error;
                res.status(200).json(results.rows);
            });
        }
        else {
            res.status(400).send("RollNo Is required!");
        }
    }
    catch (error) {
        res.status(400).send("There is some error encountered!");
        console.log("error: ", error);
    }
};
exports.getUserByRollno = getUserByRollno;
const login = (req, res) => {
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
exports.login = login;
const updateDetailsByRollno = (req, res) => {
    try {
        const { program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian, rollno, } = req.body;
        console.log(req.body);
        (0, service_1.updateDetails)(rollno, program, semester, phone, campus, emailid, gender, alternate_phone, father, mother, guardian).then((results) => {
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
