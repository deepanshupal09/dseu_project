import { QueryResult } from "pg";
import { fetchStudentDetailsFromInternal,
     insertStudentDetailsFromInternal ,
     updateStudentDetailsFromInternal,
     fetchStudentDetailsFromExternal,
     updateStudentDetailsFromExternal,
     insertStudentDetailsFromExternal,
     insertIntoAggregateMarks,
     insertStudentDetailsIntoAggregate,
     fetchStudentDetailsFromAggregate,
     updateStudentDetailsFromAggregate,
     fetchMarksControlModal,
     toggleMarksControlModal
} from "./marks_model";

export function fetchTheStudentDetailsFromInternal(details:any): Promise<any> {
    console.log("Fetching course details...");
    return new Promise((resolve, reject) => {
        fetchStudentDetailsFromInternal(details)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((error) => {
                console.log("Error in fetching course details: ", error);
                reject("Internal server error in fetchStudentDetailsFromInternal");
            });
    });
}
export function fetchTheStudentDetailsFromExternal(details:any): Promise<any> {
    console.log("Fetching course details...");
    return new Promise((resolve, reject) => {
        fetchStudentDetailsFromExternal(details)
            .then((result) => {
                resolve(result.rows);
            })
            .catch((error) => {
                console.log("Error in fetching course details: ", error);
                reject("Internal server error in fetchStudentDetailsFromInternal");
            });
    });
}

export async function handleStudentDetailsFromInternal(details: any): Promise<any> {
    return fetchMarksControlModal(details)
        .then((controlResult) => {
            // console.log("control: ",controlResult.rows);
            if (!controlResult.rows[0].marks_control) {
                return new Promise((resolve, reject) => {
                    fetchStudentDetailsFromInternal(details)
                        .then((fetchResult) => {
                            // console.log("lenght: ",fetchResult.rows.length);
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
                                console.log("result: ", fetchResult.rows[0]);
                                if(fetchResult.rows[0].freeze_marks === false){
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
                            }
                        
                            fetchTheStudentDetailsFromExternal(details).then((externalResults)=>{
                                if(externalResults && externalResults.length>0 && externalResults[0].freeze_marks === true){
                                    if(details.freeze_marks === true){  //details
                                        const rollnoMarksMap = new Map();
                                        for(let i=0; i<details.rollno.length; i++){
                                            rollnoMarksMap.set(details.rollno[i], details.marks[i]);
                                        }
            
                                        for(let i=0; i<externalResults.length; i++){
                                            if(rollnoMarksMap.has(externalResults[i].rollno)){
                                                const aggregateDetails={
                                                    rollno: externalResults[i].rollno,
                                                    campus: details.campus,
                                                    program_type: details.program_type,
                                                    program: details.program,
                                                    marks: parseInt(rollnoMarksMap.get(externalResults[i].rollno)) + externalResults[i].marks,
                                                    semester: details.semester,
                                                    freeze_marks: true,
                                                    created_at: new Date().toISOString(),
                                                    modified_at: new Date().toISOString(),
                                                    academic_year: details.academic_year,
                                                    course_code: details.course_code
                                                }
                                                insertIntoAggregateMarks(aggregateDetails)
                                                .then((insertResult) => {
                                                    console.log("aggregate_marks populated successfully!");
                                                    resolve(insertResult.rows);
                                                })
                                                .catch((insertError) => {
                                                    console.log("Error in populating aggregate_marks: ", insertError);
                                                    reject("Internal server error in insertIntoAggregateMarks");
                                                });
                                            }
                                        }
                                    }
                                }
                            })
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
                                if(fetchResult.rows[0].freeze_marks === false){
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
                            }
                            fetchTheStudentDetailsFromInternal(details).then((internalResults)=>{
                                if(internalResults && internalResults.length>0 && internalResults[0].freeze_marks === true){
                                    if(details.freeze_marks === true){  //details
                                        const rollnoMarksMap = new Map();
                                        for(let i=0; i<details.rollno.length; i++){
                                            rollnoMarksMap.set(details.rollno[i], details.marks[i]);
                                        }
            
                                        for(let i=0; i<internalResults.length; i++){
                                            if(rollnoMarksMap.has(internalResults[i].rollno)){
                                                const aggregateDetails={
                                                    rollno: internalResults[i].rollno,
                                                    campus: details.campus,
                                                    program_type: details.program_type,
                                                    program: details.program,
                                                    marks: parseInt(rollnoMarksMap.get(internalResults[i].rollno)) + internalResults[i].marks,
                                                    semester: details.semester,
                                                    freeze_marks: true,
                                                    created_at: new Date().toISOString(),
                                                    modified_at: new Date().toISOString(),
                                                    academic_year: details.academic_year,
                                                    course_code: details.course_code
                                                }
                                                insertIntoAggregateMarks(aggregateDetails)
                                                .then((insertResult) => {
                                                    console.log("aggregate_marks populated successfully!");
                                                    resolve(insertResult.rows);
                                                })
                                                .catch((insertError) => {
                                                    console.log("Error in populating aggregate_marks: ", insertError);
                                                    reject("Internal server error in insertIntoAggregateMarks");
                                                });
                                            }
                                        }
                                    }
                                }
                            })
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
                                if(fetchResult.rows[0].freeze_marks === false){
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


export function toggleMarksControlService(details:any) : Promise<any>{
    return new Promise((resolve, reject) => {
        toggleMarksControlModal(details).then((results)=>{
            resolve(results.rows);
        }).catch((error)=>{
            console.log("error: ", error);
            reject(error);
        })
    })
}