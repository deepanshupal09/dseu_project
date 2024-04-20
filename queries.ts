export const getUserByRollno: string = "SELECT * FROM users WHERE rollno=$1";
export const getPasswordByRollno: string = "SELECT * FROM users WHERE rollno=$1";
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
      last_modified = COALESCE($11, last_modified)
  WHERE rollno = $12;
`;
export const putToken: string = "UPDATE user_tokens SET token=$1, last_modified=$2, expiry=$3 WHERE rollno=$4";
export const fetchToken: string = "SELECT token,expiry FROM user_tokens WHERE rollno=$1";
export const pushTokenQuery: string = "INSERT INTO user_tokens (rollno, token,created_at, last_modified, expiry) VALUES ($1,$2,$3,$4,$5)";

 