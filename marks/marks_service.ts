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
    fetchBridgeStudentDetailsModal,
    toggleResultControlModal,
    fetchResultControlModal,
    fetchAllResultModal,
    fetchAllResultBridgeModal,
    fetchExternalResultModal,
    fetchInternalResultModal,
    fetchAllMarkSheetModal,
    departmentAggregateDetailsModal,
    departmentEmailsModal,
    fetchSemesterCoursesModal,
    fetchCoursesModal,
    fetchInternalMarksModal,
    fetchExternalMarksModal,
    fetchAggregateMarksModal
} from "./marks_model";
import bcrypt, { hash } from "bcrypt";
import { fetchTheExamRegistration } from "../service";


export interface FreezeData {
    campus: string;
    program_type: string;
    program: string;
    semester: number;
    course_name: string;
}
 
export interface EmailRow {
    emailid: string;
}

export interface DetailRow {
    campus: string;
    program_type: string;
    program: string;
    semester: number;
    freeze_marks: boolean | null;
    course_name: string;
    }

export interface AggregateWithEmails extends DetailRow {
    emails: string[];
}

export interface InfoGroup {
    campus: string;
    program_type: string;
    program: string;
    semester: number;
    course_names: string[];
}

export interface EmailGroupInfo {
    infoGroups: InfoGroup[];
    count: number;
}

export interface ResultObject {
    aggregate_marks: AggregateWithEmails[];
    emailGroups: { [email: string]: EmailGroupInfo };
    aggregate_marks_length: number;
    emailGroups_length: number;
    emailGroupsCounts: { [email: string]: number };
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

export function fetchBridgeDetailsService(email: string, course_code: string, academic_year: string, campus:string, program: string, program_type:string, semester: string) {
    return new Promise((resolve, reject) => {
        fetchBridgeDetailsModel(email, course_code, academic_year, campus, program, program_type, semester)
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
            if (controlResult.rows[0].marks_control) {
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
                                        console.log("3. inserted successfully!");
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
                                        console.log(rollnoMarksMap);
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

                                                if(externalResults[i].marks === "U" && rollnoMarksMap.get(externalResults[i].rollno) === "U"){
                                                    console.log(1)
                                                    aggregateDetails.marks = "U";
                                                } else if(externalResults[i].marks === "U" && rollnoMarksMap.get(externalResults[i].rollno) === "X") {
                                                    console.log(2)
                                                    aggregateDetails.marks = "U";
                                                } else if(externalResults[i].marks === "X" && rollnoMarksMap.get(externalResults[i].rollno) === "U") {
                                                    console.log(3)
                                                    aggregateDetails.marks = "U";
                                                } else if(externalResults[i].marks === "X" && rollnoMarksMap.get(externalResults[i].rollno) === "X") {
                                                    console.log(4)
                                                    aggregateDetails.marks = "X";
                                                } else {
                                                    console.log(5)
                                                    aggregateDetails.marks = externalResults[i].marks === "U" || externalResults[i].marks === "X" ? parseFloat(rollnoMarksMap.get(externalResults[i].rollno)).toString() : rollnoMarksMap.get(externalResults[i].rollno) === "U" || rollnoMarksMap.get(externalResults[i].rollno) === "X" ? parseFloat(externalResults[i].marks).toString() : (parseFloat(rollnoMarksMap.get(externalResults[i].rollno)) + parseFloat(externalResults[i].marks)).toString();
                                                }


                                                // if (externalResults[i].marks !== "U" && rollnoMarksMap.get(externalResults[i].rollno) !== "U") {
                                                //     if (rollnoMarksMap.get(externalResults[i].rollno) === "X" && externalResults[i].marks === "X") {
                                                //         console.log(1)
                                                //         aggregateDetails.marks = "X";
                                                //     } else if (rollnoMarksMap.get(externalResults[i].rollno) === "X" && externalResults[i].marks !== "X") {
                                                //         console.log(2)
                                                //         aggregateDetails.marks = (parseFloat("0") + parseFloat(externalResults[i].marks)).toString();
                                                //     } else if (rollnoMarksMap.get(externalResults[i].rollno) !== "X" && externalResults[i].marks === "X") {
                                                //         console.log(3)
                                                //         aggregateDetails.marks = (parseFloat("0") + parseFloat(rollnoMarksMap.get(externalResults[i].rollno))).toString();
                                                //     } else {
                                                //         console.log(4)
                                                //         aggregateDetails.marks = (parseFloat(rollnoMarksMap.get(externalResults[i].rollno)) + parseFloat(externalResults[i].marks)).toString();
                                                //     }
                                                // } else if (externalResults[i].marks !== "U" && rollnoMarksMap.get(externalResults[i].rollno) === "U"){
                                                //     if (externalResults[i].marks === "X"){
                                                //         console.log(5)
                                                //         aggregateDetails.marks = "U";
                                                //     } else {
                                                //         console.log(6)
                                                //         aggregateDetails.marks = (parseFloat("0") + parseFloat(externalResults[i].marks)).toString();
                                                //     }
                                                // } else if (externalResults[i].marks === "U" && rollnoMarksMap.get(externalResults[i].rollno) !== "U"){
                                                //     if (rollnoMarksMap.get(externalResults[i].rollno) === "X"){
                                                //         console.log(7)
                                                //         aggregateDetails.marks = "U";
                                                //     } else {
                                                //         console.log(8)
                                                //         aggregateDetails.marks = (parseFloat("0") + parseFloat(rollnoMarksMap.get(externalResults[i].rollno))).toString();
                                                //     }
                                                // } else if(externalResults[i].marks === "U" && rollnoMarksMap.get(externalResults[i].rollno) === "U"){
                                                //     console.log(9)
                                                //     aggregateDetails.marks = "U";
                                                // }
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
                                                    console.log(aggreResults);
                                                    
                                                    updateIntoAggregateMarks(aggregateDetails)
                                                        .then((updateResult) => {
                                                            console.log("update result:", updateResult);
                                                            resolve("Updated Aggregate");
                                                        })
                                                        .catch((error) => {
                                                            console.log("update aggregate error: ", error);
                                                            reject("Internal server error in updateIntoAggregateMarks");
                                                        });
                                                    
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
            if (controlResult.rows[0].marks_control) {
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
                                        console.log("2. inserted successfully!");
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
                                        console.log(rollnoMarksMap);
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


                                                if(internalResults[i].marks === "U" && rollnoMarksMap.get(internalResults[i].rollno) === "U"){
                                                    aggregateDetails.marks = "U";
                                                } else if(internalResults[i].marks === "U" && rollnoMarksMap.get(internalResults[i].rollno) === "X") {
                                                    aggregateDetails.marks = "U";
                                                } else if(internalResults[i].marks === "X" && rollnoMarksMap.get(internalResults[i].rollno) === "U") {
                                                    aggregateDetails.marks = "U";
                                                } else if(internalResults[i].marks === "X" && rollnoMarksMap.get(internalResults[i].rollno) === "X") {
                                                    aggregateDetails.marks = "X";
                                                } else {
                                                    aggregateDetails.marks = internalResults[i].marks === "U" || internalResults[i].marks === "X" ? parseFloat(rollnoMarksMap.get(internalResults[i].rollno)).toString() : rollnoMarksMap.get(internalResults[i].rollno) === "U" || rollnoMarksMap.get(internalResults[i].rollno) === "X" ? parseFloat(internalResults[i].marks).toString() : (parseFloat(rollnoMarksMap.get(internalResults[i].rollno)) + parseFloat(internalResults[i].marks)).toString();
                                                }

                                                //for absent X
                                                // if (rollnoMarksMap.get(internalResults[i].rollno) !== "U" && internalResults[i].marks !== "U") {
                                                //     if (rollnoMarksMap.get(internalResults[i].rollno) === "X" && internalResults[i].marks === "X") {
                                                //         console.log(10)
                                                //         aggregateDetails.marks = "X";
                                                //     } else if (rollnoMarksMap.get(internalResults[i].rollno) === "X" && internalResults[i].marks !== "X") {
                                                //         console.log(20)
                                                //         aggregateDetails.marks = (parseFloat("0") + parseFloat(internalResults[i].marks)).toString();
                                                //     } else if (rollnoMarksMap.get(internalResults[i].rollno) !== "X" && internalResults[i].marks === "X") {
                                                //         console.log(30)
                                                //         aggregateDetails.marks = (parseFloat("0") + parseFloat(rollnoMarksMap.get(internalResults[i].rollno))).toString();
                                                //     } else {
                                                //         console.log(40)
                                                //         aggregateDetails.marks = (parseFloat(rollnoMarksMap.get(internalResults[i].rollno)) + parseFloat(internalResults[i].marks)).toString();
                                                //     }
                                                // } else if(rollnoMarksMap.get(internalResults[i].rollno) === "U" &&  internalResults[i].marks !== "U"){
                                                //     if (internalResults[i].marks === "X"){
                                                //         console.log(50)
                                                //         aggregateDetails.marks = "U";
                                                //     } else {
                                                //         console.log(60)
                                                //         aggregateDetails.marks = (parseFloat("0") + parseFloat(internalResults[i].marks)).toString();
                                                //     } 
                                                // } else if(rollnoMarksMap.get(internalResults[i].rollno) !== "U" &&  internalResults[i].marks === "U"){
                                                //     if (rollnoMarksMap.get(internalResults[i].rollno) === "X"){
                                                //         console.log(70)
                                                //         aggregateDetails.marks = "U";
                                                //     } else {
                                                //         console.log(80)
                                                //         aggregateDetails.marks = (parseFloat("0") + parseFloat(rollnoMarksMap.get(internalResults[i].rollno))).toString();
                                                //     } 
                                                // } else if(rollnoMarksMap.get(internalResults[i].rollno) === "U" &&  internalResults[i].marks === "U"){
                                                //     console.log(90)
                                                //     aggregateDetails.marks = "U";
                                                // }

                                                
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
                                                    // console.log("5", details);
                                                    console.log("ok",aggregateDetails);
                                                   
                                                    updateIntoAggregateMarks(aggregateDetails)
                                                        .then((updateResult) => {
                                                            console.log("update result:", updateResult);
                                                            resolve("Updated Aggregate");
                                                        })
                                                        .catch((error) => {
                                                            console.log("update aggregate error: ", error);
                                                            reject("Internal server error in updateIntoAggregateMarks");
                                                        });
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
            if (controlResult.rows[0].marks_control) {
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
                                        console.log("1. inserted successfully!");
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

export function toggleResultControlService(details: any): Promise<any> {
    // console.log(890,details);
    return new Promise((resolve, reject) => {
        toggleResultControlModal(details)
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

interface InternalMarkRow {
    course_code: string;
    course_name: string;
    credit: number;
    marks: string;
}

interface ExternalMarkRow {
    course_code: string;
    course_name: string;
    credit: number;
    marks: string;
}

interface AggregateMarkRow {
    course_code: string;
    course_name: string;
    credit: number;
    marks: string;
    freeze_marks: boolean;
    campus: string;
    program_type: string;
    program: string;
    semester: number;
}

export async function fetchMarksService(rollno: string, academic_year: string, semester: number): Promise<any> {
    try {
        const resultControl = await fetchResultControlModal(rollno);
        if (!resultControl.rows[0].result_control) {
            return resultControl.rows[0].result_control;
        }

        const [internalResults, externalResults, aggregateResults, bridgeResults, examRegistration] = await Promise.all([
            fetchMarksInternalModal(rollno, academic_year, semester),
            fetchMarksExternalModal(rollno, academic_year, semester),
            fetchMarksAggregateModal(rollno, academic_year, semester),
            fetchBridgeStudentDetailsModal(rollno, academic_year),
            fetchTheExamRegistration(rollno)
        ]);

        const allFreezeMarksTrue = aggregateResults.every((row: AggregateMarkRow) => row.freeze_marks);

        if (!allFreezeMarksTrue || aggregateResults.length < examRegistration.length) {
            return { message: "Marks not evaluated yet." };
        }

        if (internalResults.length > 0 && externalResults.length > 0 && aggregateResults.length > 0 && allFreezeMarksTrue) {
            const getGrade = (marks: string, credit: number): string => {
                let marksFloat = parseFloat(marks);
                if (credit === 0) {
                    return marksFloat >= 33 ? 'S' : 'N';
                }
                if (marksFloat >= 90 && marksFloat <= 100) return 'O';
                if (marksFloat >= 80 && marksFloat < 90) return 'A+';
                if (marksFloat >= 70 && marksFloat < 80) return 'A';
                if (marksFloat >= 60 && marksFloat < 70) return 'B+';
                if (marksFloat >= 50 && marksFloat < 60) return 'B';
                if (marksFloat >= 45 && marksFloat < 50) return 'C';
                if (marksFloat >= 33 && marksFloat < 45) return 'P';
                if (marksFloat >= 0 && marksFloat < 33) return 'F';
                if (marks == 'X') return 'X';
                if (marks == 'U') return 'U';
                return 'F';
            };

            const getGradeSGPA = (sgpa: number): string => {
                if (sgpa >= 9.5 && sgpa <= 10) return 'O';
                if (sgpa >= 8.5 && sgpa < 9.5) return 'A+';
                if (sgpa >= 7.5 && sgpa < 8.5) return 'A';
                if (sgpa >= 6.5 && sgpa < 7.5) return 'B+';
                if (sgpa >= 5.5 && sgpa < 6.5) return 'B';
                if (sgpa >= 4 && sgpa < 5.5) return 'C';
                if (sgpa >= 4 && sgpa < 4.5) return 'P';
                return ' ';
            };

            const getGradePoint = (grade: string): string => {
                switch (grade) {
                    case 'O': return '10';
                    case 'A+': return '9';
                    case 'A': return '8';
                    case 'B+': return '7';
                    case 'B': return '6';
                    case 'C': return '5';
                    case 'P': return '4';
                    case 'F': return '0';
                    case 'U': return '0';
                    case 'W': return '0';
                    case 'X': return '0';
                    case 'S': return ' ';
                    case 'N': return ' ';
                    default: return '0';
                }
            };

            let sgpa = 0, totalEarnedCredit = 0;
            const result = {
                rollno: rollno,
                academic_year: academic_year,
                campus: aggregateResults[0].campus,
                program_type: aggregateResults[0].program_type,
                program: aggregateResults[0].program,
                semester: aggregateResults[0].semester,
                internal_marks: internalResults.map((row: InternalMarkRow) => {
                    let marks = row.marks.trim();
                    let grade = getGrade(marks, row.credit);
                    if (marks === "U") {
                        grade = "U";
                    } else if (marks === "X") {
                        grade = "X";
                    } else {
                        grade = getGrade(((parseFloat(row.marks) / 75) * 100).toString(), row.credit);
                    }
                    return {
                        course_code: row.course_code,
                        course_name: row.course_name,
                        credit: row.credit,
                        marks: row.marks.trim(),
                        grade: grade
                    };
                }),
                external_marks: externalResults.map((row: ExternalMarkRow) => {
                    let marks = row.marks.trim();
                    let grade = getGrade(marks, row.credit);
                    if (marks === "U") {
                        grade = "U";
                    } else if (marks === "X") {
                        grade = "X";
                    } else {
                        grade = getGrade(((parseFloat(row.marks) / 25) * 100).toString(), row.credit);
                    }
                    return {
                        course_code: row.course_code,
                        course_name: row.course_name,
                        credit: row.credit,
                        marks: row.marks.trim(),
                        grade: grade
                    };
                }),
                aggregate_marks: aggregateResults.map((row: AggregateMarkRow) => {
                    let marks = row.marks.trim();
                    let grade = getGrade(marks, row.credit);
                    let gradePoint = '0';
                    if (getGradePoint(grade) !== ' ') {
                        gradePoint = getGradePoint(grade);
                    } else {
                        gradePoint = '0';
                    }
                    let earnedCredit = gradePoint !== '0' ? row.credit : 0;
                    totalEarnedCredit += earnedCredit; // No need for parseInt here
                    sgpa += (parseFloat(gradePoint) * earnedCredit);
                    return {
                        course_code: row.course_code,
                        course_name: row.course_name,
                        credit: row.credit,
                        marks: marks,
                        grade: grade,
                        grade_point: gradePoint,
                        credit_earned: earnedCredit,
                        sgpa: sgpa,
                        yo: parseFloat(gradePoint),
                        he: earnedCredit // No need for parseFloat here
                    };
                }),
                bridge_marks: bridgeResults.rows.map(row => {
                    if (row.freeze === true) {
                        let marks = row.marks.trim();
                        let cred = 0;
                        let grade = getGrade(marks, cred);
                        let gradePoint = '0';
                        if (getGradePoint(grade) !== ' ') {
                            gradePoint = getGradePoint(grade);
                        } else {
                            gradePoint = '0';
                        }
                        return {
                            course_code: row.course_code,
                            course_name: row.course_name,
                            credit: cred,
                            marks: marks,
                            grade: grade,
                            grade_point: gradePoint
                        };
                    }
                }).filter(Boolean), // Filter out undefined values
                Credits_earned: totalEarnedCredit,
                sgpa_result: totalEarnedCredit === 0 ? 0 : (sgpa / totalEarnedCredit),
                sgpa_grade: getGradeSGPA((totalEarnedCredit === 0 ? 0 : (sgpa / totalEarnedCredit)))
            };
            return result;
        } else {
            throw new Error("No data found for the given roll number and academic year");
        }
    } catch (error) {
        console.log("Error in fetchMarksService: ", error);
        throw new Error("Internal server error in fetchMarksService");
    }
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

export function fetchAllResultService(academic_year: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.all([
        fetchAllResultModal(academic_year),
        fetchExternalResultModal(academic_year),
        fetchInternalResultModal(academic_year),
        fetchAllResultBridgeModal(academic_year)
      ]).then(([aggregateMarksResults, internalMarksResults, externalMarksResults, bridgeResults]) => {
  
        const studentDataMap: Record<string, any> = {};
  
        // Helper function to create a composite key
        const createCompositeKey = (student: any) => {
          return `${student.rollno}-${student.course_code}-${student.campus}-${student.program}-${student.program_type}-${student.semester}`;
        };
  
        // Helper function to add marks to the student data map
        const addMarksToStudent = (marksData: any[], marksType: string) => {
          marksData.forEach(student => {
            const compositeKey = createCompositeKey(student);
            if (!studentDataMap[compositeKey]) {
              studentDataMap[compositeKey] = {
                rollno: student.rollno,
                course_code: student.course_code,
                campus: student.campus,
                program: student.program,
                program_type: student.program_type,
                semester: student.semester,
                name: student.name,
                father: student.father,
                mother: student.mother,
                guardian: student.guardian,
                abc_id: student.abc_id,
                aadhar: student.aadhar,
                year_of_admission: student.year_of_admission,
                academic_year: student.academic_year,
                credits: student.credit,
                course_name: student.course_name, 
                aggregate_marks: null,
                continuous_evaluation: null,
                endSem_evaluation: null,
                bridge: null,
                exam_type: parseInt(student.semester) === parseInt(student.user_semester) ? 'regular' : 'reappear'
              };
            }
            studentDataMap[compositeKey][marksType] = student.marks;
            
            // Ensure credits and course_name are set even if they come from a different result set
            if (student.credits) {
              studentDataMap[compositeKey].credits = student.credits;
            }
            if (student.course_name) {
              studentDataMap[compositeKey].course_name = student.course_name;
            }
          });
        };
  
        addMarksToStudent(aggregateMarksResults.rows, 'aggregate_marks');
        addMarksToStudent(internalMarksResults.rows, 'continuous_evaluation');
        addMarksToStudent(externalMarksResults.rows, 'endSem_evaluation');
        addMarksToStudent(bridgeResults.rows, 'bridge');
  
        const combinedResults = Object.values(studentDataMap);
        resolve(combinedResults);
      }).catch((error) => {
        console.log("error: ", error);
        reject(error);
      });
    });
  }
  


  export function fetchAllMarkSheetsService(academic_year: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fetchAllMarkSheetModal()
            .then((users) => {
                const markSheetPromises = users.rows.map(user => {
                    const personalDetails = {
                        name: user.name,
                        program: user.program,
                        semester: user.semester,
                        phone: user.phone,
                        campus: user.campus,
                        emailid: user.emailid,
                        gender: user.gender,
                        alternate_phone: user.alternate_phone,
                        father: user.father,
                        mother: user.mother,
                        guardian: user.guardian,
                        abc_id: user.abc_id,
                        aadhar: user.aadhar,
                        pwbd_certificate: user.pwbd_certificate,
                        last_modified: user.last_modified,
                        program_type: user.program_type,
                        photo: user.photo,
                        year_of_admission: user.year_of_admission,
                        dob: user.dob
                    };

                    return fetchMarksService(user.rollno, academic_year, user.semester)
                        .then(markSheet => {
                            if (markSheet && markSheet.message !== "Marks not evaluated yet.") {
                                return {
                                    personalDetails,
                                    markSheet
                                };
                            }
                            return null;
                        })
                        .catch(error => {
                            console.error(`Error fetching marks for user ${user.rollno}:`, error);
                            return null; // Return null for failed fetches
                        });
                });

                Promise.all(markSheetPromises)
                    .then(results => {
                        const filteredResults = results.filter(result => result !== null);
                        console.log(`Successfully fetched ${filteredResults.length} mark sheets out of ${users.rows.length} users`);
                        resolve(filteredResults);
                    })
                    .catch(error => {
                        console.error("Error in Promise.all for mark sheets:", error);
                        reject("Error processing mark sheets");
                    });
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                reject("Error fetching users");
            });
    });
}


export function fetchDepartmentDetailsService(): Promise<ResultObject> {
    return new Promise((resolve, reject) => {
      Promise.all([
        departmentAggregateDetailsModal(),
      ]).then(([aggregateResults]) => {
        const emailPromises = aggregateResults.rows.map((detail: DetailRow) => 
          departmentEmailsModal(detail.campus, detail.program_type, detail.program, detail.semester)
        );
  
        Promise.all(emailPromises)
          .then(emailResults => {
            const aggregateWithEmails: AggregateWithEmails[] = aggregateResults.rows.map((detail: DetailRow, index: number) => ({
              ...detail,
              emails: emailResults[index].rows.map((row: EmailRow) => row.emailid)
            }));
  
            const emailGroups: { [email: string]: EmailGroupInfo } = {};
  
            aggregateWithEmails.forEach((detail: AggregateWithEmails) => {
              detail.emails.forEach((email: string) => {
                if (!emailGroups[email]) {
                  emailGroups[email] = { infoGroups: [], count: 0 };
                }
                
                let infoGroup = emailGroups[email].infoGroups.find(
                  group => 
                    group.campus === detail.campus &&
                    group.program_type === detail.program_type &&
                    group.program === detail.program &&
                    group.semester === detail.semester
                );
  
                if (!infoGroup) {
                  infoGroup = {
                    campus: detail.campus,
                    program_type: detail.program_type,
                    program: detail.program,
                    semester: detail.semester,
                    course_names: []
                  };
                  emailGroups[email].infoGroups.push(infoGroup);
                  emailGroups[email].count++;
                }
  
                if (detail.course_name && !infoGroup.course_names.includes(detail.course_name)) {
                  infoGroup.course_names.push(detail.course_name);
                }
              });
            });
  
            const emailGroupsCounts: { [email: string]: number } = {};
            Object.entries(emailGroups).forEach(([email, groupInfo]) => {
              emailGroupsCounts[email] = groupInfo.count;
            });
  
            const resultObject: ResultObject = {
              aggregate_marks: aggregateWithEmails,
              emailGroups: emailGroups,
              aggregate_marks_length: aggregateWithEmails.length,
              emailGroups_length: Object.keys(emailGroups).length,
              emailGroupsCounts: emailGroupsCounts
            };
  
            console.log("Individual email group entry counts:");
            Object.entries(emailGroupsCounts).forEach(([email, count]) => {
              console.log(`${email}: ${count}`);
            });
  
            resolve(resultObject);
          })
          .catch(error => {
            console.log("Error fetching emails: ", error);
            reject(error);
          });
      }).catch(error => {
        console.log("Error fetching details: ", error);
        reject(error);
      });
    });
  }

  export function fetchMarksDetailsServiceSecond(): Promise<any> {
    return new Promise((resolve, reject) => {
        Promise.all([
            fetchSemesterCoursesModal(),
            fetchCoursesModal(),
            fetchInternalMarksModal(),
            fetchExternalMarksModal(),
            fetchAggregateMarksModal()
        ]).then(([semesterCourses, courses, internalMarks, externalMarks, aggregateMarks]) => {
            // Combine the results here
            const result = semesterCourses.rows.map(sc => {
                const course = courses.rows.find(c => c.course_code === sc.course_code);
                const internal = internalMarks.rows.find(im => 
                    im.campus === sc.campus && 
                    im.program_type === sc.program_type && 
                    im.program === sc.program && 
                    im.semester === sc.semester && 
                    im.course_code === sc.course_code
                );
                const external = externalMarks.rows.find(em => 
                    em.campus === sc.campus && 
                    em.program_type === sc.program_type && 
                    em.program === sc.program && 
                    em.semester === sc.semester && 
                    em.course_code === sc.course_code
                );
                const aggregate = aggregateMarks.rows.find(am => 
                    am.campus === sc.campus && 
                    am.program === sc.program && 
                    am.semester === sc.semester && 
                    am.course_code === sc.course_code
                );

                return {
                    ...sc,
                    course_name: course ? course.course_name : null,
                    internal: internal ? internal.internal : false,
                    external: external ? external.external : false,
                    aggregate: aggregate ? aggregate.aggregate : false
                };
            });

            resolve(result);
        }).catch((error) => {
            console.log("error: ", error);
            reject(error);
        });
    });
}