import generateOTP from "./otp_generator"

export const getUserByRollno: string = "SELECT * FROM users WHERE rollno=$1";
export const getPasswordByRollno: string =
  "SELECT * FROM users WHERE rollno=$1";
export const updateDetailsByRollno: string = `
  UPDATE users 
  SET program = COALESCE($2, program),
      semester = COALESCE($3, semester),
      phone = COALESCE($5, phone),
      campus = COALESCE($6, campus),
      emailid = COALESCE($7, emailid),
      gender = COALESCE($8, gender),
      alternate_phone = COALESCE($9, alternate_phone),
      father = COALESCE($10, father),
      mother = COALESCE($11, mother),
      guardian = COALESCE($12, guardian),
      aadhar = COALESCE($13, aadhar),
      abc_id = COALESCE($14, abc_id),
      pwbd_certificate = COALESCE($15, pwbd_certificate),
      photo = COALESCE($16, photo),
      last_modified = COALESCE($20, last_modified),
      program_type = $17,
      password = $18,
      year_of_admission = $19,
      dob=$4
  WHERE rollno = $1;
`;

export const putToken: string =
  "UPDATE user_tokens SET token=$1, last_modified=$2, expiry=$3 WHERE rollno=$4";
export const fetchToken: string =
  "SELECT token,expiry FROM user_tokens WHERE rollno=$1";
export const pushTokenQuery: string =
  "INSERT INTO user_tokens (rollno, token,created_at, last_modified, expiry) VALUES ($1,$2,$3,$4,$5)";
// export const addExamRegisterationByRollno: string = "INSERT INTO exam_registeration (rollno, course_code, last_modified) VALUES ($1,$2,$3)";

export const fetchCoursesBySemester: string = `
  SELECT c.course_name,c.course_code, sc.credit,sc.course_type FROM semester_course sc
  JOIN courses c ON sc.course_code = c.course_code
  WHERE sc.campus=$1 AND sc.program=$2 AND sc.semester=$3;
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


export const fetchExamRegistrationByRollNo: string = `
    SELECT er.course_code, c.course_name, er.last_modified, sc.course_type
    FROM exam_registeration er 
    INNER JOIN courses c ON er.course_code = c.course_code 
    INNER JOIN users u ON er.rollno = u.rollno
    INNER JOIN semester_course sc ON er.course_code = sc.course_code AND u.program = sc.program AND u.campus = sc.campus
    WHERE er.rollno=$1;
`;



export const fetchExamRegistrationByCourseCode: string = `
  SELECT u.name, er.rollno, u.program, u.semester FROM exam_registeration er
  JOIN users u ON er.rollno = u.rollno
  where u.campus=$1 AND er.course_code=$2;  
`;

export const fetchExamRegistrationByProgramAndSemester: string = `
  SELECT u.photo, u.name, er.rollno, u.dob, u.program, u.semester, er.course_code FROM exam_registeration er
  JOIN users u ON er.rollno = u.rollno
  where u.campus=$1 AND u.program_type=$2 AND u.program=$3 AND u.semester=$4;  
`;
// export const fetchExamRegistrationByProgramAndSemester: string = `
//    SELECT u.photo, u.name, er.rollno, u.dob, u.program, u.semester, er.course_code FROM exam_registeration er
//    JOIN users u ON er.rollno = u.rollno
//    where u.campus=$1 AND u.program_type=$2 AND u.program=$3 AND u.semester=$4;  
// `;

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

export const fetchStudentByProgramAndSemester: string =`
  SELECT rollno, name, semester FROM users WHERE program_type=$1 AND program=$2 AND semester=$3;
`;

export const fetchStudentByCampusAndProgram: string =`
  SELECT rollno, name, semester FROM users WHERE campus=$1 AND program_type=$2 AND program=$3 AND semester=$4;
`;

export const getPasswordByEmailId: string =
  "SELECT * FROM admin WHERE emailid=$1";