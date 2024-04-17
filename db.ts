import { Pool } from 'pg';

const pool = new Pool({
  user: "dseu_erp_user",
  password: "yKxI7KeRgHSXATJ2uZ8c6M5tgilwOZgD",
  host: "dpg-cof6u7i1hbls7397fskg-a.singapore-postgres.render.com",
  port: 5432, // default Postgres port
  database: "dseu_erp" ,
  ssl: true
});

export default pool;