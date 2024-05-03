"use strict";
exports.__esModule = true;
exports.getPasswordByEmailId = exports.fetchStudentByCampusAndProgram = exports.fetchStudentByProgramAndSemester = exports.updatePasswordByOtp = exports.verifyOTP = exports.updateOTP = exports.fetchEmailIdByRollno = exports.fetchProgramByProgramType = exports.fetchExamRegistrationByProgramAndSemester = exports.fetchExamRegistrationByCourseCode = exports.fetchExamRegistrationByRollNo = exports.fetchCoursesByRollNo = exports.fetchCoursesBySemester = exports.pushTokenQuery = exports.fetchToken = exports.putToken = exports.updateDetailsByRollno = exports.getPasswordByRollno = exports.getUserByRollno = void 0;
exports.getUserByRollno = "SELECT * FROM users WHERE rollno=$1";
exports.getPasswordByRollno = "SELECT * FROM users WHERE rollno=$1";
exports.updateDetailsByRollno = "\n  UPDATE users \n  SET program = COALESCE($2, program),\n      semester = COALESCE($3, semester),\n      phone = COALESCE($5, phone),\n      campus = COALESCE($6, campus),\n      emailid = COALESCE($7, emailid),\n      gender = COALESCE($8, gender),\n      alternate_phone = COALESCE($9, alternate_phone),\n      father = COALESCE($10, father),\n      mother = COALESCE($11, mother),\n      guardian = COALESCE($12, guardian),\n      aadhar = COALESCE($13, aadhar),\n      abc_id = COALESCE($14, abc_id),\n      pwbd_certificate = COALESCE($15, pwbd_certificate),\n      photo = COALESCE($16, photo),\n      last_modified = COALESCE($20, last_modified),\n      program_type = $17,\n      password = $18,\n      year_of_admission = $19,\n      dob=$4\n  WHERE rollno = $1;\n";
exports.putToken = "UPDATE user_tokens SET token=$1, last_modified=$2, expiry=$3 WHERE rollno=$4";
exports.fetchToken = "SELECT token,expiry FROM user_tokens WHERE rollno=$1";
exports.pushTokenQuery = "INSERT INTO user_tokens (rollno, token,created_at, last_modified, expiry) VALUES ($1,$2,$3,$4,$5)";
// export const addExamRegisterationByRollno: string = "INSERT INTO exam_registeration (rollno, course_code, last_modified) VALUES ($1,$2,$3)";
exports.fetchCoursesBySemester = "\n  SELECT c.course_name,c.course_code FROM semester_course sc\n  JOIN courses c ON sc.course_code = c.course_code\n  WHERE sc.campus=$1 AND sc.program=$2 AND sc.semester=$3;\n";
exports.fetchCoursesByRollNo = "\n  WITH user_info AS (\n    SELECT program, semester, campus\n    FROM users\n    WHERE rollno = $1\n  ), semester_courses AS (\n    SELECT sc.course_code, c.course_name, sc.semester, sc.course_type\n    FROM semester_course sc\n    JOIN courses c ON sc.course_code = c.course_code, user_info ui\n    WHERE sc.program = ui.program and sc.campus = ui.campus AND sc.semester <= ui.semester AND sc.semester % 2 = ui.semester % 2\n  )\n  SELECT sc.course_name, sc.course_code, sc.semester, sc.course_type\n  FROM semester_courses sc;\n";
exports.fetchExamRegistrationByRollNo = "\n    SELECT er.course_code, c.course_name, er.last_modified, sc.course_type\n    FROM exam_registeration er \n    INNER JOIN courses c ON er.course_code = c.course_code \n    INNER JOIN users u ON er.rollno = u.rollno\n    INNER JOIN semester_course sc ON er.course_code = sc.course_code AND u.program = sc.program AND u.campus = sc.campus\n    WHERE er.rollno=$1;\n";
exports.fetchExamRegistrationByCourseCode = "\n  SELECT u.name, er.rollno, u.program, u.semester FROM exam_registeration er\n  JOIN users u ON er.rollno = u.rollno\n  where u.campus=$1 AND er.course_code=$2;  \n";
exports.fetchExamRegistrationByProgramAndSemester = "\n  SELECT u.photo, u.name, er.rollno, u.dob, u.program, u.semester, er.course_code FROM exam_registeration er\n  JOIN users u ON er.rollno = u.rollno\n  where u.campus=$1 AND u.program_type=$2 AND u.program=$3 AND u.semester=$4;  \n";
// export const fetchExamRegistrationByProgramAndSemester: string = `
//    SELECT u.photo, u.name, er.rollno, u.dob, u.program, u.semester, er.course_code FROM exam_registeration er
//    JOIN users u ON er.rollno = u.rollno
//    where u.campus=$1 AND u.program_type=$2 AND u.program=$3 AND u.semester=$4;  
// `;
exports.fetchProgramByProgramType = "\n  SELECT program FROM program_programtype WHERE program_type = $1;\n";
exports.fetchEmailIdByRollno = "\n  SELECT emailid FROM users WHERE rollno = $1;\n";
exports.updateOTP = "\n  UPDATE users SET otp = $1 WHERE rollno = $2;\n";
exports.verifyOTP = "\n  SELECT otp FROM users WHERE rollno = $1; \n";
exports.updatePasswordByOtp = "\n  UPDATE users SET password = $1 WHERE rollno = $2;\n";
exports.fetchStudentByProgramAndSemester = "\n  SELECT rollno, name, semester FROM users WHERE program_type=$1 AND program=$2 AND semester=$3;\n";
exports.fetchStudentByCampusAndProgram = "\n  SELECT rollno, name, semester FROM users WHERE campus=$1 AND program_type=$2 AND program=$3 AND semester=$4;\n";
exports.getPasswordByEmailId = "SELECT * FROM admin WHERE emailid=$1";
