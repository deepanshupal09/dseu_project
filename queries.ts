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

export const updateNameByRollno: string = `
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
      name = COALESCE($21, name),
      dob=$4,
      category= $22,
      is_lateral= $23
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
  WHERE sc.campus=$1 AND sc.program=$2 AND sc.semester=$3 AND sc.program_type=$4
`;

// export const fetchCoursesBySemester: string = `
//   SELECT sc.program_type, sc.program, c.course_name, c.course_code, sc.credit, sc.course_type, sp.program AS special_program,
//          spc.course_name AS special_course_name, spc.course_code AS special_course_code
//   FROM semester_course sc
//   JOIN courses c ON sc.course_code = c.course_code
//   LEFT JOIN specialization sp ON sc.program = sp.special
//   LEFT JOIN semester_course spsc ON sp.program = spsc.program
//   LEFT JOIN courses spc ON spsc.course_code = spc.course_code
//   WHERE sc.campus=$1 AND sc.program=$2 AND sc.semester=$3 AND sc.program_type=$4
// `;


// export const fetchCoursesBySemester: string = `
//   SELECT c.course_name,c.course_code, sc.credit,sc.course_type FROM semester_course sc
//   JOIN courses c ON sc.course_code = c.course_code
//   WHERE sc.campus=$1 AND sc.program=$2 AND sc.semester=$3;
// `;


export const fetchCoursesByRollNo: string = `
  WITH user_info AS (
    SELECT program, semester, campus, program_type
    FROM users
    WHERE rollno = $1
  ), semester_courses AS (
    SELECT sc.program, sc.course_code, c.course_name, sc.semester, sc.course_type
    FROM semester_course sc
    JOIN courses c ON sc.course_code = c.course_code, user_info ui
    WHERE ui.program_type = sc.program_type AND sc.program = ui.program and sc.campus = ui.campus AND sc.semester <= ui.semester AND sc.semester % 2 = ui.semester % 2 AND sc.program_type = ui.program_type
  )
  SELECT sc.program, sc.course_name, sc.course_code, sc.semester, sc.course_type
  FROM semester_courses sc;
`;

export const fetchCoursesByProgramAndSemester: string = `
  WITH user_info AS (
    SELECT program, semester, campus, program_type
    FROM users
    WHERE rollno = $1
  ), semester_courses AS (
    SELECT sc.program, sc.course_code, c.course_name, sc.semester, sc.course_type
    FROM semester_course sc
    JOIN courses c ON sc.course_code = c.course_code, user_info ui
    WHERE sc.program_type = ui.program_type AND sc.program = $2 and sc.campus = ui.campus AND sc.semester <= ui.semester AND sc.semester % 2 = ui.semester % 2 AND sc.program_type = ui.program_type
  )
  SELECT sc.program, sc.course_name, sc.course_code, sc.semester, sc.course_type
  FROM semester_courses sc;
`;

// export const fetchCoursesByProgramAndSemester: string = `
//   WITH semester_courses AS (
//     SELECT sc.program, sc.course_code, c.course_name, sc.semester, sc.course_type
//     FROM semester_course sc
//     JOIN courses c ON sc.course_code = c.course_code
//     WHERE sc.program = $1 AND sc.semester <= $2 AND sc.semester % 2 = $2 % 2 AND 
//   )
//   SELECT sc.program, sc.course_name, sc.course_code, sc.semester, sc.course_type
//   FROM semester_courses sc;
// `;


export const fetchSpecialization: string = `
  SELECT program FROM specialization WHERE special=$1;
`;

//currently not used below query
export const fetchExamRegistrationByRollNo: string = `
    SELECT er.course_code, c.course_name, er.last_modified, sc.course_type
    FROM exam_registeration er 
    INNER JOIN courses c ON er.course_code = c.course_code 
    INNER JOIN users u ON er.rollno = u.rollno
    INNER JOIN semester_course sc ON er.course_code = sc.course_code AND u.program_type = sc.program_type AND u.program = sc.program AND u.campus = sc.campus
    WHERE er.rollno=$1;
`;

export const fetchExamRegistrationByRoll: string = `
    SELECT course_code, last_modified
    FROM exam_registeration
    WHERE rollno = $1;
`;

export const fetchCourseDetailsByRoll: string = `
    SELECT course_code, course_name
    FROM courses
    WHERE course_code = ANY($1);
`;

export const fetchUserDetailsByRoll: string = `
    SELECT rollno, program_type, program, campus
    FROM users
    WHERE rollno = $1;
`;

export const fetchSemesterCourseDetailsByRoll: string = `
    SELECT course_code, course_type
    FROM semester_course
    WHERE course_code = ANY($1)
    AND program_type = $2
    AND program = $3
    AND campus = $4;
`;

export const fetchExamRegistrationByCourseCode: string = `
  SELECT u.name, er.rollno, u.program, u.semester FROM exam_registeration er
  JOIN users u ON er.rollno = u.rollno
  where u.campus=$1 AND er.course_code=$2;  
`;

export const fetchExamRegistrationByProgramAndSemester: string = `
  SELECT u.photo, u.name, er.rollno, u.dob, u.program, u.semester, er.course_code FROM exam_registeration er
  JOIN users u ON er.rollno = u.rollno
  where u.campus=$1 AND u.program_type=$2 AND u.program=$3 AND u.semester=$4 ORDER BY er.rollno;  
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
  UPDATE users SET otp = $1 , otp_time=$3 , login_tries=10 WHERE rollno = $2;
`;

export const fetchOtpTime:string =`SELECT otp_time from users where rollno = $1`

export const updateOTPAdmin: string = `
  UPDATE admin SET otp = $1 WHERE emailid = $2;
`;

export const verifyOTP: string = `
  WITH updated_users AS (
    UPDATE users 
    SET login_tries = login_tries - 1 
    WHERE rollno = $1 
    RETURNING otp, login_tries, otp_time
  )
  SELECT otp, login_tries, otp_time 
  FROM updated_users;
`;

export const verifyOTPAdmin: string = `
  SELECT otp FROM admin WHERE emailid = $1; 
`;


export const updatePasswordByOtp: string = `
  UPDATE users SET password = $1 WHERE rollno = $2;
`;

export const updatePasswordByOtpAdmin: string = `
  UPDATE admin SET password = $1 WHERE emailid = $2;
`;

export const fetchStudentByProgramAndSemester: string =`
  SELECT rollno, name, semester FROM users WHERE program_type=$1 AND program=$2 AND semester=$3;
`;

export const fetchStudentByCampusAndProgram: string =`
  SELECT rollno, name, semester FROM users WHERE campus=$1 AND program_type=$2 AND program=$3 AND semester=$4;
`;

export const getPasswordByEmailId: string =
  "SELECT * FROM admin WHERE emailid=$1";

export const updateMultipleDetailsByRollno: string =
`UPDATE users SET father = COALESCE($2, father), mother = COALESCE($3, mother), aadhar = COALESCE($4, aadhar), abc_id = COALESCE($5, abc_id) WHERE rollno = $1`;

export const updateExamControl: string = `
  UPDATE semester_course SET exam_control=$4 WHERE campus=$1 AND program=$2 AND semester=$3;
`;

export const fetchCampusDetails: string =`
SELECT DISTINCT program_type, campus, program, semester,exam_control FROM semester_course GROUP BY program_type,campus, program, semester, exam_control ORDER BY campus,program,semester;
`;

export const deleteExamRegisterationByRollno: string = `
  DELETE FROM exam_registeration WHERE rollno=$1;
`;

// export const fetchExamControl: string = `
//   SELECT DISTINCT exam_control FROM semester_course WHERE campus=$1 AND program=$2 AND semester=$3 AND program_type=$4 
// `;

export const fetchExamControl: string = `
  SELECT DISTINCT exam_control FROM semester_course WHERE campus=$1 AND program=$2 AND program_type=$4 AND semester=$3;
`;

export const fetchAllExamControlDetailsQuery: string = `
  SELECT DISTINCT campus, program, semester, exam_control FROM semester_course;
`;

export const resetStudentRegistration: string= `
  UPDATE users SET 
    program = null,
    semester = null,
    phone = null,
    campus = null,
    emailid = null,
    gender = null,
    alternate_phone = null,
    father = null,
    mother = null,
    guardian = null,
    aadhar = null,
    abc_id = null,
    pwbd_certificate = null,
    photo = null,
    last_modified = $4,
    program_type = null,
    password = $3,
    year_of_admission = null,
    dob=null
  WHERE rollno = $1 AND name=$2;
`;

export const fetchEmailQuery: string = `
SELECT DISTINCT u.name ,u.emailid
FROM users u
JOIN semester_course sc ON sc.campus = u.campus AND sc.program = u.program AND sc.semester = u.semester 
WHERE sc.campus =$1 AND sc.program = $2 AND sc.semester = $3;
`;



//charts queries

export const fetchAllStudents: string=`
  SELECT COUNT(DISTINCT rollno) FROM users;
`;

export const fetchAllRegisterStudents: string=`
  SELECT COUNT(DISTINCT rollno) FROM exam_registeration;
`;

export const fetchAllStudentCampus: string=`
  SELECT COUNT(DISTINCT rollno) FROM users WHERE campus=$1;
`;

export const fetchAllRegisterStudentCampus: string=`
  SELECT COUNT(DISTINCT er.rollno) FROM exam_registeration er 
  JOIN users u ON u.rollno=er.rollno
  WHERE u.campus=$1;
`;

export const fetchAllUsers: string=`
  SELECT * FROM users;
`;


export const categoryLateralQuery: string=`
  INSERT INTO users (rollno, name, category, is_lateral)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (rollno)
    DO UPDATE SET
        category = EXCLUDED.category,
        is_lateral = EXCLUDED.is_lateral;`;