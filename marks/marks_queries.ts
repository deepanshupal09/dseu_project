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
export const updateStudentDetailsToAggregateQuery:string = `
    UPDATE aggregate_marks SET marks=$8, freeze_marks=$9, modified_at=$10 WHERE 
        rollno=$1 AND
        campus=$2 AND
        program_type=$3 AND
        program=$4 AND 
        semester=$5 AND
        academic_year=$6 AND
        course_code=$7 ;
`;

export const fetchMarkControl:string = `
  SELECT marks_control FROM departments WHERE campus=$1 AND program_type=$2 AND program=$3 AND semester=$4; 
`;

export const fetchMarkControlDetailsQuery:string = `
  SELECT DISTINCT campus, program, semester, marks_control FROM departments; 
`;


export const toggleMarkControl:string =`
  UPDATE departments SET marks_control=$4 WHERE campus=$1 AND program=$2 AND semester=$3;
`;

export const fetchMarksInternal: string = `
  SELECT DISTINCT im.course_code, im.marks, sc.credit, c.course_name
  FROM internal_marks AS im
  JOIN users AS u ON im.rollno = u.rollno 
  JOIN semester_course AS sc ON im.course_code=sc.course_code
  JOIN courses AS c ON im.course_code=c.course_code
  WHERE im.academic_year = $2 AND im.rollno = $1 AND im.semester=$3;
`;

export const fetchMarksExternal: string = `
  SELECT DISTINCT im.course_code, im.marks ,sc.credit, c.course_name
  FROM external_marks AS im
  JOIN users AS u ON im.rollno = u.rollno 
  JOIN semester_course AS sc ON im.course_code=sc.course_code
  JOIN courses AS c ON im.course_code=c.course_code
  WHERE im.academic_year = $2 AND im.rollno = $1 AND im.semester=$3;
`;

export const fetchMarksAggregate: string = `
  SELECT DISTINCT im.course_code, im.marks, im.rollno, im.campus, im.program_type, im.program, im.semester, sc.credit, c.course_name, im.freeze_marks
  FROM aggregate_marks AS im
  JOIN users AS u ON im.rollno = u.rollno 
  JOIN semester_course AS sc ON im.course_code=sc.course_code
  JOIN courses AS c ON im.course_code=c.course_code 
  WHERE im.academic_year = $2 AND im.rollno = $1 AND im.semester=$3;
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
export const fetchMarksDetailsQuery: string = `
  SELECT
  DISTINCT
    sc.campus,
    sc.program,
    sc.program_type,
    sc.semester,
    sc.course_code,
    c.course_name,
    
    CASE
        WHEN im.course_code IS NULL OR im.freeze_marks = false THEN false
        ELSE true
    END AS internal,
    CASE
        WHEN em.course_code IS NULL OR em.freeze_marks = false THEN false
        ELSE true
    END AS external,
    CASE
        WHEN am.course_code IS NULL OR am.freeze_marks = false THEN false
        ELSE true
    END AS aggregate
FROM
    semester_course sc
LEFT JOIN
    courses c ON sc.course_code = c.course_code
LEFT JOIN
    internal_marks im ON sc.campus = im.campus AND sc.program_type = im.program_type AND sc.program = im.program AND sc.semester = im.semester AND sc.course_code = im.course_code
LEFT JOIN
    external_marks em ON sc.campus = em.campus AND sc.program_type = im.program_type AND sc.program = em.program AND sc.semester = em.semester AND sc.course_code = em.course_code
LEFT JOIN
    aggregate_marks am ON sc.campus = am.campus AND sc.program = am.program AND sc.semester = am.semester AND sc.course_code = am.course_code
ORDER BY
    sc.campus,
    sc.program,
    sc.program_type,
    sc.semester,
    sc.course_code;
`;

export const fetchBridgeStudentDetails: string=`
    SELECT DISTINCT bc.rollno, bc.course_code, c.course_name, bc.academic_year, bc.marks, bc."freeze" 
    FROM bridge_course AS bc
    JOIN users AS u ON bc.rollno = u.rollno 
    JOIN semester_course AS sc ON bc.course_code=sc.course_code
    JOIN courses AS c ON bc.course_code=c.course_code
    WHERE bc.academic_year = $2 AND bc.rollno = $1;
`; 