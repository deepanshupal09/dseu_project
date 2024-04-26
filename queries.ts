import generateOTP from "./otp_generator"

export const getUserByRollno: string = "SELECT * FROM users WHERE rollno=$1";
export const getPasswordByRollno: string =
  "SELECT * FROM users WHERE rollno=$1";
export const updateDetailsByRollno: string = `
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

export const putToken: string =
  "UPDATE user_tokens SET token=$1, last_modified=$2, expiry=$3 WHERE rollno=$4";
export const fetchToken: string =
  "SELECT token,expiry FROM user_tokens WHERE rollno=$1";
export const pushTokenQuery: string =
  "INSERT INTO user_tokens (rollno, token,created_at, last_modified, expiry) VALUES ($1,$2,$3,$4,$5)";
// export const addExamRegisterationByRollno: string = "INSERT INTO exam_registeration (rollno, course_code, last_modified) VALUES ($1,$2,$3)";

export const fetchCoursesBySemester: string = `
  SELECT sc.course_code, sc.program, c.course_name, sc.semester FROM semester_course sc
  JOIN courses c ON sc.course_code = c.course_code
  WHERE sc.semester=$1 AND sc.program=$2;
`;

export const fetchCoursesByRollNo: string = `
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

// export const fetchExamRegistrationByRollNo: string = `
//   SELECT er.rollno, u.semester ,c.course_name, er.course_code FROM exam_registeration er
//   JOIN courses c ON er.course_code = c.course_code
//   JOIN users u ON er.rollno = u.rollno
//   WHERE er.rollno=$1;
// `;
export const fetchExamRegistrationByRollNo: string = `
    SELECT er.course_code, c.course_name, er.last_modified, sc.course_type
    FROM exam_registeration er 
    INNER JOIN courses c ON er.course_code = c.course_code 
    INNER JOIN users u ON er.rollno = u.rollno
    INNER JOIN semester_course sc ON er.course_code = sc.course_code AND u.program = sc.program AND u.semester = sc.semester AND u.campus = sc.campus
    WHERE er.rollno=$1;
`;



export const fetchExamRegistrationByCourseCode: string = `
  SELECT u.name, er.rollno, u.program, u.semester FROM exam_registeration er
  JOIN users u ON er.rollno = u.rollno
  where er.course_code=$1;  
`;

export const fetchExamRegistrationByProgramAndSemester: string = `
  SELECT u.name, er.rollno, u.program, u.semester ,er.course_code FROM exam_registeration er
  JOIN users u ON er.rollno = u.rollno
  where u.program=$1 AND u.semester=$2;  
`;


export const fetchProgramByProgramType: string = `
  SELECT program FROM program_programtype WHERE program_type = $1;
`;

export const fetchEmailIdByRollno: string = `
  SELECT emailid FROM users WHERE rollno = $1;
`;

export const updateOTP: string = `
  UPDATE users SET otp = $1 WHERE rollno = $2;
`;

export const verifyOTP: string = `
  SELECT otp FROM users WHERE rollno = $1; 
`;

export const updatePasswordByOtp: string = `
  UPDATE users SET password = $1 WHERE rollno = $2;
`;