import { QueryResult } from "pg";
import pool from "../db";
import { insertStudentDetailsToAggregateQuery, fetchMarkControl, toggleMarkControl, fetchMarksInternal, fetchMarksExternal, fetchMarksAggregate, fetchUsersByCourseCode, fetchDepartDetailsByEmailid, resetPassword, fetchFreezeDetailsQuery, getEmailidAdminQuery, fetchMarkControlDetailsQuery, updateStudentDetailsToAggregateQuery } from "./marks_queries";


export function fetchStudentDetailsFromInternal( details:{
    campus:string,
    program_type: string, 
    program:string, 
    semester: number,
    academic_year:string,
    course_code:string,
    rollno: Array<string>
}
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.name, im.rollno, im.campus, im.program_type, im.program, im.semester, im.academic_year, im.marks, im.freeze_marks, im.course_code,  im.created_at
            FROM internal_marks im
            JOIN users u ON im.rollno = u.rollno
            WHERE im.campus='${details.campus}' AND im.program_type='${details.program_type}' AND im.program='${details.program}' AND im.semester='${details.semester}' AND im.course_code='${details.course_code}'AND im.academic_year='${details.academic_year}' AND im.rollno IN (${details.rollno.map(roll => `'${roll}'`).join(", ")})
            ORDER BY im.rollno
        `;
        console.log("INTERNAL query:",query);
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export function fetchStudentDetailsFromExternal( details:{
    campus:string,
    program_type: string, 
    program:string, 
    semester: number,
    academic_year:string,
    course_code:string,
    rollno: Array<string>
}
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.name, im.rollno, im.campus, im.program_type, im.program, im.semester, im.academic_year, im.marks, im.freeze_marks, im.course_code,  im.created_at
            FROM external_marks im
            JOIN users u ON im.rollno = u.rollno
            WHERE im.campus='${details.campus}' AND im.program_type='${details.program_type}' AND im.program='${details.program}' AND im.semester='${details.semester}' AND im.course_code='${details.course_code}'AND im.academic_year='${details.academic_year}' AND im.rollno IN (${details.rollno.map(roll => `'${roll}'`).join(", ")})
            ORDER BY im.rollno
        `;
        // console.log("query:",query);
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export function updateStudentDetailsFromInternal(details: {
    campus: string,
    program_type: string, 
    program: string, 
    semester: number,
    course_code: string,
    academic_year: string,
    rollno: Array<string>,
    marks: Array<string>,
    freeze_marks: boolean,
    modified_at: string,
}): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        console.log("details: ", details);
        // console.log("created: ", details.created_at);
        console.log("modified: ", details.modified_at);

        for (let i = 0; i < details.rollno.length; i++) {
            let query = `UPDATE internal_marks SET marks = '${details.marks[i]}', freeze_marks = '${details.freeze_marks}', modified_at = '${details.modified_at}' WHERE rollno = '${details.rollno[i]}' AND campus = '${details.campus}' AND course_code = '${details.course_code}' AND program = '${details.program}' AND semester = ${details.semester} AND program_type = '${details.program_type}' AND academic_year = '${details.academic_year}';`;

            console.log("query: ",query);
            pool.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        }
    });
}


export function updateStudentDetailsFromExternal(details: {
    campus: string,
    program_type: string, 
    program: string, 
    semester: number,
    course_code: string,
    academic_year: string,
    rollno: Array<string>,
    marks: Array<string>,
    freeze_marks: boolean,
    modified_at: string,
}): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        console.log("details: ", details);
        // console.log("created: ", details.created_at);
        console.log("modified: ", details.modified_at);

        for (let i = 0; i < details.rollno.length; i++) {
            let query = `UPDATE external_marks SET marks = '${details.marks[i]}', freeze_marks = '${details.freeze_marks}', modified_at = '${details.modified_at}' WHERE rollno = '${details.rollno[i]}' AND campus = '${details.campus}' AND course_code = '${details.course_code}' AND program = '${details.program}' AND semester = ${details.semester} AND program_type = '${details.program_type}' AND academic_year = '${details.academic_year}';`;

            // console.log("query:", query);

            pool.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        }
    });
}


export function insertStudentDetailsFromInternal(details: {
    campus: string,
    program_type: string, 
    program: string, 
    semester: number,
    course_code: string,
    academic_year: string,
    rollno: Array<string>,
    marks: Array<string>,
    freeze_marks: boolean,
    created_at: string,
    modified_at: string,
}): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        console.log("details: ", details);
        console.log("created: ", details.created_at);
        console.log("modified: ", details.modified_at);

        let query = `INSERT INTO internal_marks (campus, program_type, program, semester, course_code, academic_year, rollno, marks, freeze_marks, created_at, modified_at) VALUES `;

        for (let i = 0; i < details.rollno.length; i++) {
            query += `('${details.campus}', '${details.program_type}', '${details.program}', ${details.semester}, '${details.course_code}', '${details.academic_year}', '${details.rollno[i]}', '${details.marks[i]}', '${details.freeze_marks}',  '${details.created_at}', '${details.modified_at}'),`;
        }

        // Remove the last comma and add a semicolon to end the query
        query = query.slice(0, -1) + ';';

        // console.log("query:", query);

        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


export function insertStudentDetailsFromExternal(details: {
    campus: string,
    program_type: string, 
    program: string, 
    semester: number,
    course_code: string,
    academic_year: string,
    rollno: Array<string>,
    marks: Array<string>,
    freeze_marks: boolean,
    created_at: string,
    modified_at: string,
}): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        console.log("details: ", details);
        console.log("created: ", details.created_at);
        console.log("modified: ", details.modified_at);

        let query = `INSERT INTO external_marks (campus, program_type, program, semester, course_code, academic_year, rollno, marks, freeze_marks, created_at, modified_at) VALUES `;

        for (let i = 0; i < details.rollno.length; i++) {
            query += `('${details.campus}', '${details.program_type}', '${details.program}', ${details.semester}, '${details.course_code}', '${details.academic_year}', '${details.rollno[i]}', '${details.marks[i]}', '${details.freeze_marks}',  '${details.created_at}', '${details.modified_at}'),`;
        }

        // Remove the last comma and add a semicolon to end the query
        query = query.slice(0, -1) + ';';

        // console.log("query:", query);

        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}


export function insertStudentDetailsIntoAggregate(details: {
    campus: string,
    program_type: string, 
    program: string, 
    semester: number,
    course_code: string,
    academic_year: string,
    rollno: Array<string>,
    marks: Array<string>,
    freeze_marks: boolean,
    created_at: string,
    modified_at: string,
}): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        console.log("details: ", details);
        console.log("created: ", details.created_at);
        console.log("modified: ", details.modified_at);

        let query = `INSERT INTO aggregate_marks (campus, program_type, program, semester, course_code, academic_year, rollno, marks, freeze_marks, created_at, modified_at) VALUES `;

        for (let i = 0; i < details.rollno.length; i++) {
            query += `('${details.campus}', '${details.program_type}', '${details.program}', ${details.semester}, '${details.course_code}', '${details.academic_year}', '${details.rollno[i]}', '${details.marks[i]}', '${details.freeze_marks}',  '${details.created_at}', '${details.modified_at}'),`;
        }

        // Remove the last comma and add a semicolon to end the query
        query = query.slice(0, -1) + ';';

        // console.log("query:", query);

        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export function updateStudentDetailsFromAggregate(details: {
    campus: string,
    program_type: string, 
    program: string, 
    semester: number,
    course_code: string,
    academic_year: string,
    rollno: Array<string>,
    marks: Array<string>,
    freeze_marks: boolean,
    created_at: string,
    modified_at: string,
}): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        console.log("details: ", details);
        console.log("created: ", details.created_at);
        console.log("modified: ", details.modified_at);

        for (let i = 0; i < details.rollno.length; i++) {
            let query = `UPDATE aggregate_marks SET marks = '${details.marks[i]}', freeze_marks = '${details.freeze_marks}', modified_at = '${details.modified_at}' WHERE rollno = '${details.rollno[i]}' AND campus = '${details.campus}' AND course_code = '${details.course_code}' AND program = '${details.program}' AND semester = ${details.semester} AND program_type = '${details.program_type}' AND academic_year = '${details.academic_year}';`;

            console.log("query:", query);

            pool.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        }
    });
}

export function fetchStudentDetailsFromAggregate( details:{
    campus:string,
    program_type: string, 
    program:string, 
    semester: number,
    academic_year:string,
    course_code:string,
    rollno: Array<string>
}
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.name, im.rollno, im.campus, im.program_type, im.program, im.semester, im.academic_year, im.marks, im.freeze_marks, im.course_code,  im.created_at
            FROM aggregate_marks im
            JOIN users u ON im.rollno = u.rollno
            WHERE im.campus='${details.campus}' AND im.program_type='${details.program_type}' AND im.program='${details.program}' AND im.semester='${details.semester}' AND im.course_code='${details.course_code}'AND im.academic_year='${details.academic_year}' AND im.rollno IN (${details.rollno.map(roll => `'${roll}'`).join(", ")})
            ORDER BY im.rollno
        `;
        // console.log("query:",query);
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

export function insertIntoAggregateMarks(aggregateDetails:{
    rollno: string
    campus: string, 
    program_type:string, 
    program:string, 
    marks:string, 
    semester:number, 
    freeze_marks:boolean, 
    created_at:string, 
    modified_at:string, 
    academic_year:string, 
    course_code:string
}
): Promise<QueryResult<any>> {
    // console.log("model rollno: ",rollno)
    return new Promise((resolve, reject) => {
        pool.query(insertStudentDetailsToAggregateQuery, [aggregateDetails.rollno,aggregateDetails.campus, aggregateDetails.program_type, aggregateDetails.program, aggregateDetails.marks, aggregateDetails.semester, aggregateDetails.freeze_marks, aggregateDetails.created_at, aggregateDetails.modified_at, aggregateDetails.academic_year, aggregateDetails.course_code  ], (error, results) => {
            if (error) {
                console.log("eror: ", error)    
                reject(error);
            } else {
                // console.log("error mode: ",results)
                resolve(results);
            }
        });
    });
}

export function updateIntoAggregateMarks(aggregateDetails:{
    rollno: string,
    campus: string, 
    program_type:string, 
    program:string, 
    marks:string, 
    semester:number, 
    freeze_marks:boolean, 
    modified_at:string, 
    academic_year:string, 
    course_code:string
}
): Promise<QueryResult<any>> {
    // console.log("model rollno: ",rollno)
    return new Promise((resolve, reject) => {
        pool.query(updateStudentDetailsToAggregateQuery, [aggregateDetails.rollno,aggregateDetails.campus, aggregateDetails.program_type, aggregateDetails.program, aggregateDetails.semester, aggregateDetails.academic_year, aggregateDetails.course_code, aggregateDetails.marks, aggregateDetails.freeze_marks, aggregateDetails.modified_at  ], (error, results) => {
            if (error) {
                console.log("eror: ", error)    
                reject(error);
            } else {
                // console.log("error mode: ",results)
                resolve(results);
            }
        });
    });
}


export function fetchMarksControlModal(details:{
    campus:string,
    program_type:string,
    program:string,
    semester:number
}): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchMarkControl, [details.campus, details.program_type, details.program, details.semester], (error, results)=>{
            if(error) {
                console.log("error: ", error);
                reject(error);
            } else{
                resolve(results);
            }
        });
    });
}

export function toggleMarksControlModal(details:{
    campus:string,
    program:string,
    semester:number,
    marks_control:boolean
}[]): Promise<QueryResult<any>> {
    console.log(124,details);
    return new Promise((resolve, reject)=>{

        details.map((detail)=>{
            pool.query(toggleMarkControl, [detail.campus, detail.program, detail.semester, detail.marks_control], (error, results)=>{
                if(error) {
                    console.log("error: ", error);
                    reject(error);
                } else{
                    resolve(results);
                }
            });
            
        })
    });
}

export function fetchMarksInternalModal(
    rollno:string,
    academic_year:string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchMarksInternal, [rollno, academic_year], (error, results)=>{
            if(error) {
                console.log("error: ", error);
                reject(error);
            } else{
                resolve(results);
            }
        });
    });
}
export function fetchMarksExternalModal(
    rollno:string,
    academic_year:string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchMarksExternal, [rollno, academic_year], (error, results)=>{
            if(error) {
                console.log("error: ", error);
                reject(error);
            } else{
                resolve(results);
            }
        });
    });
}
export function fetchMarksAggregateModal(
    rollno:string,
    academic_year:string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchMarksAggregate, [rollno, academic_year], (error, results)=>{
            if(error) {
                console.log("error: ", error);
                reject(error)
            } else{
                resolve(results);
            }
        });
    });
}

export function fetchStudentsCourseCodeModal(
    course_code:string,
    campus: string, program_type: string, program: string, semester: string, academic_year: string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchUsersByCourseCode, [course_code, campus,program_type, program, semester, academic_year], (error, results)=>{
            if(error) {
                console.log("error: ", error);
                reject(error)
            } else{
                resolve(results);
            }
        });
    });
}

export function fetchDepartDetailsByEmailidModal(
    emailid:string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchDepartDetailsByEmailid, [emailid], (error, results)=>{
            if(error) {
                console.log("error: ", error);
                reject(error)
            } else{
                resolve(results);
            }
        });
    });
}
export function resetPasswordModal(
    password:string,
    emailid:string
): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(resetPassword, [password, emailid], (error, results)=>{
            if(error) {
                console.log("error:  ", error);
                reject(error)
            } else{
                resolve(results);
            }
        });
    });
}


export function fetchFreezeDetailsModel(): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchFreezeDetailsQuery, (error, results)=>{
            if(error) {
                console.log("error:  ", error);
                reject(error)
            } else{
                resolve(results);
            }
        });
    });
}


export function getEmailidAdminModel(campus:string): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(getEmailidAdminQuery,[campus], (error, results)=>{
            if(error){
                console.log("error: ", error);
                reject(error);
            } else{
                resolve(results);
            }
        });
    });
}


export function fetchMarkControlDetailsModal(): Promise<QueryResult<any>> {
    return new Promise((resolve, reject)=>{
        pool.query(fetchMarkControlDetailsQuery, (error, results)=>{
            if(error){
                console.log("error: ", error);
                reject(error);
            } else{
                resolve(results);
            }
        });
    });
}



