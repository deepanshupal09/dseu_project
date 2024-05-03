"use strict";
exports.__esModule = true;
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    user: "postgres",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "dseu_erp",
    ssl: false
});
exports["default"] = pool;
