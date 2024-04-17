"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDetailsByRollno = exports.getPasswordByRollno = exports.getUserByRollno = void 0;
exports.getUserByRollno = "SELECT * FROM users WHERE rollno=$1";
exports.getPasswordByRollno = "SELECT password FROM users WHERE rollno=$1";
exports.updateDetailsByRollno = "UPDATE users SET program=$1,semester=$2,phone=$3,campus=$4,emailid=$5,gender=$6,alternate_phone=$7,father=$8,mother=$9,guardian=$10 WHERE rollno=$11";
