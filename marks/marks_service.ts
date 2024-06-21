import { QueryResult } from "pg";
import {
    fetchStudentDetailsFromInternal,
    insertStudentDetailsFromInternal,
    updateStudentDetailsFromInternal,
    fetchStudentDetailsFromExternal,
    updateStudentDetailsFromExternal,
    insertStudentDetailsFromExternal,
    insertIntoAggregateMarks,
    insertStudentDetailsIntoAggregate,
    fetchStudentDetailsFromAggregate,
    updateStudentDetailsFromAggregate,
    fetchMarksControlModal,
    toggleMarksControlModal,
    fetchMarksInternalModal,
    fetchMarksExternalModal,
    fetchMarksAggregateModal,
    fetchStudentsCourseCodeModal,
    resetPasswordModal,
    fetchDepartDetailsByEmailidModal,
    fetchFreezeDetailsModel,
    getEmailidAdminModel,
    fetchMarkControlDetailsModal,
    updateIntoAggregateMarks,
    insertBridgeDetailsModel,
    checkDepartmentModel,
    fetchBridgeDetailsModel,
    deleteBridgeDetailsModel,
} from "./marks_model";
import bcrypt, { hash } from "bcrypt";

export interface FreezeData {
    campus: string;
    program_type: string;
    program: string;
    semester: number;
    course_name: string;
}
export function checkDepartmentService(rollno: any, depEmail: any) {
    return new Promise((resolve, reject) => {
        checkDepartmentModel(rollno, depEmail)
            .then((name) => {
                resolve(name);
            })
            .catch((error: any) => {
                console.log("Error in INTERNAL fetching course details: ", error);
                reject("Internal server error in fetchStudentDetailsFromInternal");
            });
    });
}

export function fetchBridgeDetailsService(email: string, course_code: string, academic_year: string) {
    return new Promise((resolve, reject) => {
        fetchBridgeDetailsModel(email, course_code, academic_year)
            .then((result: any) => {
                resolve(result.rows);
            })
            .catch((error: any) => {
                console.log("Error in INTERNAL fetching course details: ", error);
                reject("Internal server error in fetchStudentDetailsFromInternal");
            });
    });
}
export function deleteBridgeDetailsService(rollno: string, course_code: string, academic_year: string) {
    return new Promise((resolve, reject) => {
        deleteBridgeDetailsModel(rollno, course_code, academic_year)
            .then((result: any) => {
                resolve(true);
            })
            .catch((error: any) => {
                console.log("Error in INTERNAL fetching course details: ", error);
                reject("Internal server error in fetchStudentDetailsFromInternal");
            });
    });
}

export function insertBridgeDetailsService(listOfStudents: any[]) {
    return new Promise((resolve, reject) => {
        const promises = listOfStudents.map((student) => insertBridgeDetailsModel(student));

        Promise.all(promises)
            .then(() => {
                resolve(true);
            })
            .catch((error: any) => {
                console.log("Error at insert Bridge details service: ", error.message);
                reject(error.message);
            });
    });
}

export function fetchTheStudentDetailsFromInternal(details: any): Promise<any> {
    console.log("Fetching course details...", details);
    return new Promise((resolve, reject) => {
        fetchStudentDetailsFromInternal(details)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((error) => {
                console.log("Error in INTERNAL fetching course details: ", error);
                reject("Internal server error in fetchStudentDetailsFromInternal");
            });
    });
}
export function fetchTheStudentDetailsFromExternal(details: any): Promise<any> {
    console.log("Fetching course details...", details);

    return new Promise((resolve, reject) => {
        fetchStudentDetailsFromExternal(details)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((error) => {
                console.log("Error in EXTERNAL fetching course details: ", error);
                reject("Internal server error in fetchStudentDetailsFromInternal");
            });
    });
}

export function fetchTheStudentDetailsFromAggregate(details: any): Promise<any> {
    console.log("Fetching course details...");
    return new Promise((resolve, reject) => {
        fetchStudentDetailsFromAggregate(details)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((error) => {
                console.log("Error in AGGREGATE fetching course details: ", error);
                reject("Internal server error in fetchStudentDetailsFromAggregate");
            });
    });
}

export async function handleStudentDetailsFromInternal(details: any): Promise<any> {
    return fetchMarksControlModal(details)
        .then((controlResult) => {
            if (!controlResult.rows[0].marks_control) {
                return new Promise((resolve, reject) => {
                    fetchStudentDetailsFromInternal(details)
                        .then((fetchResult) => {
                            console.log("hello: ", fetchResult.rows);
                            if (fetchResult.rows.length === 0) {
                                console.log("Inserting student details...");

                                const currentTime = new Date().toISOString();
                                details.created_at = currentTime;
                                details.modified_at = currentTime;
                                insertStudentDetailsFromInternal(details)
                                    .then((insertResult) => {
                                        console.log("inserted successfully!");
                                        resolve(insertResult.rows);
                                    })
                                    .catch((insertError) => {
                                        console.log("Error in inserting student details: ", insertError);
                                        reject("Internal server error in insertStudentDetails");
                                    });
                            } else {
                                console.log("Updating student details...");
                                const currentTime = new Date().toISOString();
                                details.modified_at = currentTime;
                                updateStudentDetailsFromInternal(details)
                                    .then((updateResult) => {
                                        console.log("updated successfully!");
                                        resolve(updateResult.rows);
                                    })
                                    .catch((updateError) => {
                                        console.log("Error in updating student details: ", updateError);
                                        reject("Internal server error in updateStudentDetailsFromInternal");
                                    });
                            }

                            fetchTheStudentDetailsFromExternal(details).then((externalResults) => {
                                if (externalResults && externalResults.length > 0 && externalResults[0].freeze_marks === true) {
                                    if (details.freeze_marks === true) {
                                        const rollnoMarksMap = new Map();
                                        for (let i = 0; i < details.rollno.length; i++) {
                                            rollnoMarksMap.set(details.rollno[i], details.marks[i]);
                                        }

                                        for (let i = 0; i < externalResults.length; i++) {
                                            if (rollnoMarksMap.has(externalResults[i].rollno)) {
                                                const aggregateDetails = {
                                                    rollno: externalResults[i].rollno,
                                                    campus: details.campus,
                                                    program_type: details.program_type,
                                                    program: details.program,
                                                    marks: "",
                                                    semester: details.semester,
                                                    freeze_marks: true,
                                                    created_at: new Date().toISOString(),
                                                    modified_at: new Date().toISOString(),
                                                    academic_year: details.academic_year,
                                                    course_code: details.course_code,
                                                };

                                                if (externalResults[i].marks !== "U") {
                                                    if (rollnoMarksMap.get(externalResults[i].rollno) === "X" && externalResults[i].marks === "X") {
                                                        aggregateDetails.marks = "X";
                                                    } else if (rollnoMarksMap.get(externalResults[i].rollno) === "X" && externalResults[i].marks !== "X") {
                                                        aggregateDetails.marks = (parseFloat("0") + parseFloat(externalResults[i].marks)).toString();
                                                    } else if (rollnoMarksMap.get(externalResults[i].rollno) !== "X" && externalResults[i].marks === "X") {
                                                        aggregateDetails.marks = (parseFloat("0") + parseFloat(rollnoMarksMap.get(externalResults[i].rollno))).toString();
                                                    } else {
                                                        aggregateDetails.marks = (parseFloat(rollnoMarksMap.get(externalResults[i].rollno)) + parseFloat(externalResults[i].marks)).toString();
                                                    }
                                                } else {
                                                    if (rollnoMarksMap.get(externalResults[i].rollno) === "X") {
                                                        aggregateDetails.marks = "0";
                                                    } else if (rollnoMarksMap.get(externalResults[i].rollno) !== "X") {
                                                        aggregateDetails.marks = (parseFloat("0") + parseFloat(rollnoMarksMap.get(externalResults[i].rollno))).toString();
                                                    }
                                                }
                                                // if(rollnoMarksMap.get(externalResults[i].rollno) !== 'U' && externalResults[i].marks !== 'U'){
                                                // } else if(rollnoMarksMap.get(externalResults[i].rollno) !== 'X' && externalResults[i].marks !== 'X'){
                                                //     if (rollnoMarksMap.get(externalResults[i].rollno) === 'U' && externalResults[i].marks === 'U') {
                                                //         aggregateDetails.marks = 'U';
                                                //     } else if(rollnoMarksMap.get(externalResults[i].rollno) === 'U' && externalResults[i].marks !== 'U') {
                                                //         aggregateDetails.marks = (parseFloat('0') + parseFloat(externalResults[i].marks)).toString();
                                                //     } else if(rollnoMarksMap.get(externalResults[i].rollno) !== 'U' && externalResults[i].marks === 'U') {
                                                //         aggregateDetails.marks = (parseFloat('0') + parseFloat(rollnoMarksMap.get(externalResults[i].rollno))).toString();
                                                //     }
                                                // } else if(rollnoMarksMap.get(externalResults[i].rollno) !== 'X' && externalResults[i].marks !== 'X' && rollnoMarksMap.get(externalResults[i].rollno) !== 'U' && externalResults[i].marks !== 'U') {

                                                // }

                                                fetchTheStudentDetailsFromAggregate(details).then((aggreResults) => {
                                                    // console.log("agreeResults: ",aggreResults)
                                                    if (aggreResults.length === 0) {
                                                        insertIntoAggregateMarks(aggregateDetails)
                                                            .then((insertResult) => {
                                                                console.log("aggregate_marks populated successfully!");
                                                                resolve(insertResult.rows);
                                                            })
                                                            .catch((insertError) => {
                                                                console.log("Error in populating aggregate_marks: ", insertError);
                                                                reject("Internal server error in insertIntoAggregateMarks");
                                                            });
                                                    } else {
                                                        updateIntoAggregateMarks(aggregateDetails)
                                                            .then((updateResult) => {
                                                                console.log("update result:", updateResult);
                                                                resolve("Updated Aggregate");
                                                            })
                                                            .catch((error) => {
                                                                console.log("update aggregate error: ", error);
                                                                reject("Internal server error in updateIntoAggregateMarks");
                                                            });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            });
                        })
                        .catch((fetchError) => {
                            console.log("Error in fetching student details: ", fetchError);
                            reject("Internal server error in fetchStudentDetailsFromInternal");
                        });
                });
            } else {
                console.log("fetchMarksControl returned true, skipping handleStudentDetailsFromInternal");
                return Promise.resolve(null);
            }
        })
        .catch((error) => {
            console.log("Error in fetchMarksControlModal: ", error);
            return Promise.reject("Internal server error in fetchMarksControlModal");
        });
}

export async function handleStudentDetailsFromExternal(details: any): Promise<any> {
    return fetchMarksControlModal(details)
        .then((controlResult) => {
            if (!controlResult.rows[0].marks_control) {
                return new Promise((resolve, reject) => {
                    fetchStudentDetailsFromExternal(details)
                        .then((fetchResult) => {
                            if (fetchResult.rows.length === 0) {
                                console.log("Inserting student details...");

                                const currentTime = new Date().toISOString();
                                details.created_at = currentTime;
                                details.modified_at = currentTime;
                                insertStudentDetailsFromExternal(details)
                                    .then((insertResult) => {
                                        console.log("inserted successfully!");
                                        resolve(insertResult.rows);
                                    })
                                    .catch((insertError) => {
                                        console.log("Error in inserting student details: ", insertError);
                                        reject("Internal server error in insertStudentDetails");
                                    });
                            } else {
                                console.log("Updating student details...");

                                const currentTime = new Date().toISOString();

                                details.modified_at = currentTime;
                                updateStudentDetailsFromExternal(details)
                                    .then((updateResult) => {
                                        console.log("updated successfully!");
                                        resolve(updateResult.rows);
                                    })
                                    .catch((updateError) => {
                                        console.log("Error in updating student details: ", updateError);
                                        reject("Internal server error in updateStudentDetailsFromInternal");
                                    });
                            }
                            fetchTheStudentDetailsFromInternal(details).then((internalResults) => {
                                if (internalResults && internalResults.length > 0 && internalResults[0].freeze_marks === true) {
                                    if (details.freeze_marks === true) {
                                        //details
                                        const rollnoMarksMap = new Map();
                                        for (let i = 0; i < details.rollno.length; i++) {
                                            rollnoMarksMap.set(details.rollno[i], details.marks[i]);
                                        }

                                        for (let i = 0; i < internalResults.length; i++) {
                                            if (rollnoMarksMap.has(internalResults[i].rollno)) {
                                                const aggregateDetails = {
                                                    rollno: internalResults[i].rollno,
                                                    campus: details.campus,
                                                    program_type: details.program_type,
                                                    program: details.program,
                                                    marks: "",
                                                    semester: details.semester,
                                                    freeze_marks: true,
                                                    created_at: new Date().toISOString(),
                                                    modified_at: new Date().toISOString(),
                                                    academic_year: details.academic_year,
                                                    course_code: details.course_code,
                                                };

                                                //for absent X
                                                if (rollnoMarksMap.get(internalResults[i].rollno) !== "U") {
                                                    if (rollnoMarksMap.get(internalResults[i].rollno) === "X" && internalResults[i].marks === "X") {
                                                        aggregateDetails.marks = "X";
                                                    } else if (rollnoMarksMap.get(internalResults[i].rollno) === "X" && internalResults[i].marks !== "X") {
                                                        aggregateDetails.marks = (parseFloat("0") + parseFloat(internalResults[i].marks)).toString();
                                                    } else if (rollnoMarksMap.get(internalResults[i].rollno) !== "X" && internalResults[i].marks === "X") {
                                                        aggregateDetails.marks = (parseFloat("0") + parseFloat(rollnoMarksMap.get(internalResults[i].rollno))).toString();
                                                    } else {
                                                        aggregateDetails.marks = (parseFloat(rollnoMarksMap.get(internalResults[i].rollno)) + parseFloat(internalResults[i].marks)).toString();
                                                    }
                                                } else {
                                                    if (internalResults[i].marks === "X") {
                                                        aggregateDetails.marks = "0";
                                                    } else if (internalResults[i].marks !== "X") {
                                                        aggregateDetails.marks = aggregateDetails.marks = (parseFloat("0") + parseFloat(internalResults[i].marks)).toString();
                                                    }
                                                }
                                                // if(rollnoMarksMap.get(internalResults[i].rollno).trim() !== 'U' && internalResults[i].marks.trim() !== 'U'){
                                                // } else if(rollnoMarksMap.get(internalResults[i].rollno).trim() !== 'X' && internalResults[i].marks.trim() !== 'X'){
                                                //     if (rollnoMarksMap.get(internalResults[i].rollno).trim() === 'U' && internalResults[i].marks.trim() === 'U') {
                                                //         aggregateDetails.marks = 'U';
                                                //     } else if(rollnoMarksMap.get(internalResults[i].rollno) === 'U' && internalResults[i].marks !== 'U') {
                                                //         aggregateDetails.marks = (parseFloat('0') + parseFloat(internalResults[i].marks)).toString();
                                                //     } else if(rollnoMarksMap.get(internalResults[i].rollno) !== 'U' && internalResults[i].marks === 'U') {
                                                //         aggregateDetails.marks = (parseFloat('0') + parseFloat(rollnoMarksMap.get(internalResults[i].rollno))).toString();
                                                //     }
                                                // } else if(rollnoMarksMap.get(internalResults[i].rollno).trim() !== 'X' && internalResults[i].marks.trim() !== 'X' && rollnoMarksMap.get(internalResults[i].rollno).trim() !== 'U' && internalResults[i].marks.trim() !== 'U') {
                                                //     aggregateDetails.marks = (parseFloat(rollnoMarksMap.get(internalResults[i].rollno)) + parseFloat(internalResults[i].marks)).toString();
                                                // }

                                                fetchTheStudentDetailsFromAggregate(details).then((aggreResults) => {
                                                    // console.log("agreeResults: ",aggreResults)

                                                    if (aggreResults.length === 0) {
                                                        insertIntoAggregateMarks(aggregateDetails)
                                                            .then((insertResult) => {
                                                                console.log("aggregate_marks populated successfully!");
                                                                resolve(insertResult.rows);
                                                            })
                                                            .catch((insertError) => {
                                                                console.log("Error in populating aggregate_marks: ", insertError);
                                                                reject("Internal server error in insertIntoAggregateMarks");
                                                            });
                                                    } else {
                                                        updateIntoAggregateMarks(aggregateDetails)
                                                            .then((updateResult) => {
                                                                console.log("update result:", updateResult);
                                                                resolve("Updated Aggregate");
                                                            })
                                                            .catch((error) => {
                                                                console.log("update aggregate error: ", error);
                                                                reject("Internal server error in updateIntoAggregateMarks");
                                                            });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            });
                        })
                        .catch((fetchError) => {
                            console.log("Error in fetching student details: ", fetchError);
                            reject("Internal server error in fetchStudentDetailsFromInternal");
                        });
                });
            } else {
                console.log("fetchMarksControl returned true, skipping handleStudentDetailsFromInternal");
                return Promise.resolve(null);
            }
        })
        .catch((error) => {
            console.log("Error in fetchMarksControlModal: ", error);
            return Promise.reject("Internal server error in fetchMarksControlModal");
        });
}

export async function handleStudentDetailsFromAggregate(details: any): Promise<any> {
    console.log("aggregate update: ", details);
    return fetchMarksControlModal(details)
        .then((controlResult) => {
            if (!controlResult.rows[0].marks_control) {
                return new Promise((resolve, reject) => {
                    fetchStudentDetailsFromAggregate(details)
                        .then((fetchResult) => {
                            if (fetchResult.rows.length === 0) {
                                console.log("Inserting student details...");

                                const currentTime = new Date().toISOString();
                                details.created_at = currentTime;
                                details.modified_at = currentTime;
                                insertStudentDetailsIntoAggregate(details)
                                    .then((insertResult) => {
                                        console.log("inserted successfully!");
                                        resolve(insertResult.rows);
                                    })
                                    .catch((insertError) => {
                                        console.log("Error in inserting student details: ", insertError);
                                        reject("Internal server error in insertStudentDetails");
                                    });
                            } else {
                                console.log("Updating student details...");

                                const currentTime = new Date().toISOString();
                                console.log("fetch Result: ", fetchResult);
                                updateStudentDetailsFromAggregate(details)
                                    .then((updateResult) => {
                                        details.modified_at = currentTime;
                                        console.log("updated successfully!");
                                        resolve(updateResult.rows);
                                    })
                                    .catch((updateError) => {
                                        console.log("Error in updating student details: ", updateError);
                                        reject("Internal server error in updateStudentDetailsFromInternal");
                                    });
                            }
                        })
                        .catch((fetchError) => {
                            console.log("Error in fetching student details: ", fetchError);
                            reject("Internal server error in fetchStudentDetailsFromInternal");
                        });
                });
            } else {
                console.log("fetchMarksControl returned true, skipping handleStudentDetailsFromInternal");
                return Promise.resolve(null);
            }
        })
        .catch((error) => {
            console.log("Error in fetchMarksControlModal: ", error);
            return Promise.reject("Internal server error in fetchMarksControlModal");
        });
}

export function toggleMarksControlService(details: any): Promise<any> {
    // console.log(890,details);
    return new Promise((resolve, reject) => {
        toggleMarksControlModal(details)
            .then((results) => {
                resolve(results.rows);
            })
            .catch((error) => {
                console.log("error: ", error);
                reject(error);
            });
    });
}

export function fetchStudentsCourseCodeService(course_code: string, campus: string, program_type: string, program: string, semester: string, academic_year: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fetchStudentsCourseCodeModal(course_code, campus, program_type, program, semester, academic_year)
            .then((results) => {
                resolve(results.rows);
            })
            .catch((error) => {
                console.log("error: ", error);
                reject(error);
            });
    });
}

export function fetchMarksService(rollno: string, academic_year: string, semester: number): Promise<any> {
    return new Promise((resolve, reject) => {
        Promise.all([fetchMarksInternalModal(rollno, academic_year, semester), fetchMarksExternalModal(rollno, academic_year, semester), fetchMarksAggregateModal(rollno, academic_year, semester)])
            .then(([internalResults, externalResults, aggregateResults]) => {
                if (aggregateResults.rows.length > 0 && !aggregateResults.rows[0].freeze_marks) {
                    resolve({ message: "Marks not evaluated yet." });
                    return;
                }
                if (internalResults.rows.length > 0 && externalResults.rows.length > 0 && aggregateResults.rows.length > 0 && aggregateResults.rows[0].freeze_marks == true) {
                    const getGrade = (marks: string, credit: number): string => {
                        let marksFloat = parseFloat(marks);
                        if (credit === 0) {
                            return marksFloat >= 33 ? "S" : "N";
                        }
                        if (marksFloat >= 90 && marksFloat <= 100) return "O";
                        if (marksFloat >= 80 && marksFloat < 90) return "A+";
                        if (marksFloat >= 70 && marksFloat < 80) return "A";
                        if (marksFloat >= 60 && marksFloat < 70) return "B+";
                        if (marksFloat >= 50 && marksFloat < 60) return "B";
                        if (marksFloat >= 45 && marksFloat < 50) return "C";
                        if (marksFloat >= 33 && marksFloat < 45) return "P";
                        if (marksFloat >= 0 && marksFloat < 33) return "F";
                        if (marks == "X") {
                            return "X";
                        }
                        if (marks == "U") {
                            return "U";
                        }
                        return "F";
                    };

                    const getGradeSGPA = (sgpa: number): string => {
                        if (sgpa >= 9.5 && sgpa <= 10) return "O";
                        if (sgpa >= 8.5 && sgpa < 9.5) return "A+";
                        if (sgpa >= 7.5 && sgpa < 8.5) return "A";
                        if (sgpa >= 6.5 && sgpa < 7.5) return "B+";
                        if (sgpa >= 5.5 && sgpa < 6.5) return "B";
                        if (sgpa >= 4 && sgpa < 5.5) return "C";
                        if (sgpa >= 4 && sgpa < 4.5) return "P";
                        return " ";
                    };

                    const getGradePoint = (grade: string): string => {
                        switch (grade) {
                            case "O":
                                return "10";
                            case "A+":
                                return "9";
                            case "A":
                                return "8";
                            case "B+":
                                return "7";
                            case "B":
                                return "6";
                            case "C":
                                return "5";
                            case "P":
                                return "4";
                            case "F":
                                return "0";
                            case "U":
                                return "0";
                            case "W":
                                return "0";
                            case "X":
                                return "0";
                            case "S":
                                return " ";
                            case "N":
                                return " ";
                            default:
                                return "0";
                        }
                    };

                    let sgpa = 0,
                        totalEarnedCredit = 0;
                    const result = {
                        rollno: rollno,
                        academic_year: academic_year,
                        campus: aggregateResults.rows[0].campus,
                        program_type: aggregateResults.rows[0].program_type,
                        program: aggregateResults.rows[0].program,
                        semester: aggregateResults.rows[0].semester,
                        internal_marks: internalResults.rows.map((row) => ({
                            course_code: row.course_code,
                            course_name: row.course_name,
                            credit: row.credit,
                            marks: row.marks,
                            grade: getGrade(((parseFloat(row.marks) / 75) * 100).toString(), row.credit),
                        })),
                        external_marks: externalResults.rows.map((row) => ({
                            course_code: row.course_code,
                            course_name: row.course_name,
                            credit: row.credit,
                            marks: row.marks,
                            grade: getGrade(((parseFloat(row.marks) / 25) * 100).toString(), row.credit),
                        })),
                        aggregate_marks: aggregateResults.rows.map((row) => {
                            let grade = getGrade(row.marks, row.credit);
                            let gradePoint = getGradePoint(grade);
                            let earnedCredit = gradePoint !== "0" ? row.credit : 0;
                            totalEarnedCredit += parseInt(earnedCredit);
                            sgpa += parseInt(gradePoint) * parseInt(earnedCredit);
                            return {
                                course_code: row.course_code,
                                course_name: row.course_name,
                                credit: row.credit,
                                marks: row.marks,
                                grade: grade,
                                grade_point: gradePoint,
                                credit_earned: earnedCredit,
                            };
                        }),
                        Credits_earned: totalEarnedCredit,
                        sgpa_result: totalEarnedCredit === 0 ? 0 : sgpa / totalEarnedCredit,
                        sgpa_grade: getGradeSGPA(totalEarnedCredit === 0 ? 0 : sgpa / totalEarnedCredit),
                    };
                    resolve(result);
                } else {
                    // fetchMarksInternalModal(rollno, academic_year, semester).then((results) => {
                    //     console.log("results:", results);
                    // });
                    reject("No data found for the given roll number and academic year");
                }
            })
            .catch((error) => {
                console.log("Error in fetchMarksService: ", error);
                reject("Internal server error in fetchMarksService");
            });
    });
}

export function fetchDepartDetailsByEmailidService(emailid: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fetchDepartDetailsByEmailidModal(emailid)
            .then((results) => {
                resolve(results.rows);
            })
            .catch((error) => {
                console.log("error: ", error);
                reject(error);
            });
    });
}

export function resetPasswordService(password: string, emailid: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const hsh = await hash(password, 10);
        resetPasswordModal(hsh, emailid)
            .then((results) => {
                resolve(results.rows);
            })
            .catch((error) => {
                console.log("error: ", error);
                reject(error);
            });
    });
}

export function fetchFreezeDetailsService(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        fetchFreezeDetailsModel()
            .then((results) => {
                resolve(results.rows);
            })
            .catch((error) => {
                console.log("error: ", error);
                reject(error);
            });
    });
}

export function getEmailidAdminService(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let emailIds: string[] = [];
            const freezeData: FreezeData[] = await fetchFreezeDetailsService();
            const campuses = new Set(freezeData.map((data: FreezeData) => data.campus));
            for (let campus of campuses) {
                const result: QueryResult<any> = await getEmailidAdminModel(campus);

                for (let i = 0; i < (result.rowCount as number); i++) {
                    const emailId = result.rows[i].emailid;
                    // console.log("emailid",emailId)
                    emailIds.push(emailId);
                }
            }
            const campusEmailids = emailIds.join(", ");

            resolve(campusEmailids);
        } catch (error) {
            console.log("Campus email Error:", error);
            reject(error);
        }
    });
}

export function fetchMarkControlDetailsService(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        fetchMarkControlDetailsModal()
            .then((results) => {
                resolve(results.rows);
            })
            .catch((error) => {
                console.log("error: ", error);
                reject(error);
            });
    });
}
