import { Pool } from 'pg';

const pool = new Pool({
  user: "dasad",
  password: "VhwrKPjAiF",
  host: "localhost",
  port: 5432, // default Postgres port
  database: "dseu_erp" ,
  ssl: false
});

export default pool;