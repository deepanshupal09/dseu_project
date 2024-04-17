"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordByRollno = exports.getUserByRollno = void 0;
const db_1 = __importDefault(require("./db"));
const queries_1 = require("./queries");
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
            res.status(400).send('RollNo Is required!');
        }
    }
    catch (error) {
        res.status(400).send('There is some error encountered!');
        console.log("error: ", error);
    }
};
exports.getUserByRollno = getUserByRollno;
const getPasswordByRollno = (req, res) => {
    try {
        const rollno = req.headers.rollno;
        const password = req.headers.password;
        if (rollno && password) {
            // First, check if the roll number exists
            db_1.default.query(queries_1.getPasswordByRollno, [rollno], (error, results) => {
                if (error)
                    throw error;
                // If the roll number exists
                if (results.rows.length > 0) {
                    const dbPassword = results.rows[0].password;
                    // Check if the entered password matches the one in the database
                    if (dbPassword === password) {
                        res.status(200).send('Authentication successful!');
                    }
                    else {
                        res.status(401).send('Incorrect password!');
                    }
                }
                else {
                    res.status(404).send('Roll number not found!');
                }
            });
        }
        else {
            res.status(400).send('Roll number and password are required!');
        }
    }
    catch (error) {
        res.status(400).send('There was an error processing your request.');
        console.log("error: ", error);
    }
};
exports.getPasswordByRollno = getPasswordByRollno;
