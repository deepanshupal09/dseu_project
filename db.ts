import { Pool } from "pg";

const pool = new Pool({
    user: "neondb_owner",
    password: "GCekN13PVhYz",
    host: "ep-fancy-boat-a5vodunq.us-east-2.aws.neon.tech",
    port: 5432, // default Postgres port
    database: "neondb",
    ssl: true,
});

export default pool;
