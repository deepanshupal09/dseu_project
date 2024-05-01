"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordByEmailId = exports.fetchStudentByCampusAndProgram = exports.fetchStudentByProgramAndSemester = exports.updatePasswordByOtp = exports.verifyOTP = exports.updateOTP = exports.fetchEmailIdByRollno = exports.fetchProgramByProgramType = exports.fetchExamRegistrationByProgramAndSemester = exports.fetchExamRegistrationByCourseCode = exports.fetchExamRegistrationByRollNo = exports.fetchCoursesByRollNo = exports.fetchCoursesBySemester = exports.pushTokenQuery = exports.fetchToken = exports.putToken = exports.updateDetailsByRollno = exports.getPasswordByRollno = exports.getUserByRollno = void 0;
exports.getUserByRollno = "SELECT * FROM users WHERE rollno=$1";
exports.getPasswordByRollno = "SELECT * FROM users WHERE rollno=$1";
exports.updateDetailsByRollno = `
  UPDATE users 
  SET program = COALESCE($1, program),
      semester = COALESCE($2, semester),
      phone = COALESCE($3, phone),
      campus = COALESCE($4, campus),
      emailid = COALESCE($5, emailid),
      gender = COALESCE($6, gender),
      alternate_phone = COALESCE($7, alternate_phone),
      father = COALESCE($8, father),
      mother = COALESCE($9, mother),
      guardian = COALESCE($10, guardian),
      aadhar = COALESCE($11, aadhar),
      abc_id = COALESCE($12, abc_id),
      pwbd_certificate = COALESCE($13, pwbd_certificate),
      photo = COALESCE($14, photo),
      last_modified = COALESCE($15, last_modified),
      program_type = $16,
      password = $17,
      year_of_admission = $19
  WHERE rollno = $18;
`;
exports.putToken = "UPDATE user_tokens SET token=$1, last_modified=$2, expiry=$3 WHERE rollno=$4";
exports.fetchToken = "SELECT token,expiry FROM user_tokens WHERE rollno=$1";
exports.pushTokenQuery = "INSERT INTO user_tokens (rollno, token,created_at, last_modified, expiry) VALUES ($1,$2,$3,$4,$5)";
// export const addExamRegisterationByRollno: string = "INSERT INTO exam_registeration (rollno, course_code, last_modified) VALUES ($1,$2,$3)";
exports.fetchCoursesBySemester = `
  SELECT sc.course_code, sc.program, c.course_name, sc.semester FROM semester_course sc
  JOIN courses c ON sc.course_code = c.course_code
  WHERE sc.semester=$1 AND sc.program=$2;
`;
exports.fetchCoursesByRollNo = `
  WITH user_info AS (
    SELECT program, semester, campus
    FROM users
    WHERE rollno = $1
  ), semester_courses AS (
    SELECT sc.course_code, c.course_name, sc.semester, sc.course_type
    FROM semester_course sc
    JOIN courses c ON sc.course_code = c.course_code, user_info ui
    WHERE sc.program = ui.program and sc.campus = ui.campus AND sc.semester <= ui.semester AND sc.semester % 2 = ui.semester % 2
  )
  SELECT sc.course_name, sc.course_code, sc.semester, sc.course_type
  FROM semester_courses sc;
`;
exports.fetchExamRegistrationByRollNo = `
    SELECT er.course_code, c.course_name, er.last_modified, sc.course_type
    FROM exam_registeration er 
    INNER JOIN courses c ON er.course_code = c.course_code 
    INNER JOIN users u ON er.rollno = u.rollno
    INNER JOIN semester_course sc ON er.course_code = sc.course_code AND u.program = sc.program AND u.campus = sc.campus
    WHERE er.rollno=$1;
`;
exports.fetchExamRegistrationByCourseCode = `
  SELECT u.name, er.rollno, u.program, u.semester FROM exam_registeration er
  JOIN users u ON er.rollno = u.rollno
  where er.course_code=$1;  
`;
exports.fetchExamRegistrationByProgramAndSemester = `
  SELECT u.photo, u.name, er.rollno, u.dob, u.program, u.semester, er.course_code FROM exam_registeration er
  JOIN users u ON er.rollno = u.rollno
  where u.campus=$1 AND u.program_type=$2 AND u.program=$3 AND u.semester=$4;  
`;
exports.fetchProgramByProgramType = `
  SELECT program FROM program_programtype WHERE program_type = $1;
`;
exports.fetchEmailIdByRollno = `
  SELECT emailid FROM users WHERE rollno = $1;
`;
exports.updateOTP = `
  UPDATE users SET otp = $1 WHERE rollno = $2;
`;
exports.verifyOTP = `
  SELECT otp FROM users WHERE rollno = $1; 
`;
exports.updatePasswordByOtp = `
  UPDATE users SET password = $1 WHERE rollno = $2;
`;
exports.fetchStudentByProgramAndSemester = `
  SELECT rollno, name, semester FROM users WHERE program_type=$1 AND program=$2 AND semester=$3;
`;
exports.fetchStudentByCampusAndProgram = `
  SELECT rollno, name, semester FROM users WHERE campus=$1 AND program_type=$2 AND program=$3 AND semester=$4;
`;
exports.getPasswordByEmailId = "SELECT * FROM admin WHERE emailid=$1";
