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


export const toggleMarkControl:string =`
  UPDATE departments SET marks_control=$5 WHERE campus=$1 AND program_type=$2 AND program=$3 AND semester=$4;
`;

export const fetchMarksInternal: string = `
  SELECT im.course_code, im.marks 
  FROM internal_marks AS im
  LEFT JOIN users AS u ON im.rollno = u.rollno AND im.campus=u.campus AND im.program_type = u.program_type AND im.program= u.program AND im.semester = u.semester
  WHERE im.academic_year = $2 AND im.rollno = $1;
`;
export const fetchMarksExternal: string = `
  SELECT im.course_code, im.marks 
  FROM external_marks AS im
  INNER JOIN users AS u ON im.rollno = u.rollno AND im.campus=u.campus AND im.program_type = u.program_type AND im.program= u.program AND im.semester = u.semester
  WHERE im.academic_year = $2 AND im.rollno = $1;
`;
export const fetchMarksAggregate: string = `
  SELECT im.course_code, im.marks, im.rollno, im.campus, im.program_type, im.program, im.semester
  FROM aggregate_marks AS im
  INNER JOIN users AS u ON im.rollno = u.rollno AND im.campus=u.campus AND im.program_type = u.program_type AND im.program= u.program AND im.semester = u.semester
  WHERE im.academic_year = $2 AND im.rollno = $1;
`;