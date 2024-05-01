"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: "postgres",
    password: "1234",
    host: "localhost",
    port: 5432, // default Postgres port
    database: "dseu_erp",
    ssl: false
});
exports.default = pool;
