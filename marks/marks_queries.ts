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
