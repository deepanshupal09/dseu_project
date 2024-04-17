"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: "dseu_erp_user",
    password: "yKxI7KeRgHSXATJ2uZ8c6M5tgilwOZgD",
    host: "dpg-cof6u7i1hbls7397fskg-a.singapore-postgres.render.com",
    port: 5432, // default Postgres port
    database: "dseu_erp",
    ssl: true
});
exports.default = pool;
