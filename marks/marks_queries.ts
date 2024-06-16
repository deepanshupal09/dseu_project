export const insertStudentDetailsToAggregateQuery:string = `
    INSERT INTO aggregate_marks(
        rollno, 
        campus, 
        program_type, 
        program, 
        marks, 
        semester, 
        freeze_marks, 
        created_at, 
        modified_at, 
        academic_year, 
        course_code
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
`;

export const fetchMarkControl:string = `
  SELECT marks_control FROM departments WHERE campus=$1 AND program_type=$2 AND program=$3 AND semester=$4; 
`;

export const fetchMarkControlDetailsQuery:string = `
  SELECT DISTINCT campus, program, semester, marks_control FROM departments; 
`;


export const toggleMarkControl:string =`
  UPDATE departments SET marks_control=$5 WHERE campus=$1 AND program_type=$2 AND program=$3 AND semester=$4;
`;

export const fetchMarksInternal: string = `
  SELECT im.course_code, im.marks, sc.credit, c.course_name
  FROM internal_marks AS im
  INNER JOIN users AS u ON im.rollno = u.rollno AND im.campus=u.campus AND im.program_type = u.program_type AND im.program= u.program AND im.semester = u.semester
  INNER JOIN semester_course AS sc ON im.course_code=sc.course_code
  INNER JOIN courses AS c ON im.course_code=c.course_code
  WHERE im.academic_year = $2 AND im.rollno = $1;
`;
export const fetchMarksExternal: string = `
  SELECT im.course_code, im.marks ,sc.credit, c.course_name
  FROM external_marks AS im
  INNER JOIN users AS u ON im.rollno = u.rollno AND im.campus=u.campus AND im.program_type = u.program_type AND im.program= u.program AND im.semester = u.semester
  INNER JOIN semester_course AS sc ON im.course_code=sc.course_code
  INNER JOIN courses AS c ON im.course_code=c.course_code
  WHERE im.academic_year = $2 AND im.rollno = $1;
`;
export const fetchMarksAggregate: string = `
  SELECT im.course_code, im.marks, im.rollno, im.campus, im.program_type, im.program, im.semester, sc.credit, c.course_name
  FROM aggregate_marks AS im
  INNER JOIN users AS u ON im.rollno = u.rollno AND im.campus=u.campus AND im.program_type = u.program_type AND im.program= u.program AND im.semester = u.semester
  INNER JOIN semester_course AS sc ON im.course_code=sc.course_code
  INNER JOIN courses AS c ON im.course_code=c.course_code 
  WHERE im.academic_year = $2 AND im.rollno = $1;
`;


export const fetchUsersByCourseCode: string =`
    SELECT er.rollno, u.name FROM exam_registeration AS er 
    INNER JOIN users AS u ON er.rollno=u.rollno
    WHERE er.course_code=$1 AND u.campus=$2 AND u.program_type=$3 AND u.program=$4 AND u.semester=$5 AND er.academic_year=$6 order by er.rollno ;
`;

export const fetchDepartDetailsByEmailid: string=`
  SELECT campus, program, program_type, semester FROM departments WHERE emailid=$1;
`;

export const resetPassword: string=`
  UPDATE admin SET password=$1 WHERE emailid=$2;
`;

export const fetchFreezeDetailsQuery: string=`
  SELECT ag.campus, ag.program_type, ag.program, ag.semester, c.course_name FROM 
  (SELECT DISTINCT 
    campus, 
    program_type, 
    program, 
    semester,
    academic_year,
    course_code
  FROM aggregate_marks WHERE freeze_marks = false) ag
  JOIN courses c ON ag.course_code = c.course_code;
`;


export const getEmailidAdminQuery: string=`
  SELECT emailid FROM admin WHERE campus=$1;
`;