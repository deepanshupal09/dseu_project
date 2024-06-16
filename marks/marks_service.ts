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
     toggleMarksControlModal,
     fetchMarksInternalModal,
     fetchMarksExternalModal,
     fetchMarksAggregateModal,
     fetchStudentsCourseCodeModal,
     resetPasswordModal,
     fetchDepartDetailsByEmailidModal,
     fetchFreezeDetailsModel,
     getEmailidAdminModel
} from "./marks_model";
import bcrypt, { hash } from "bcrypt";

export interface FreezeData {
    campus: string;
    program_type: string;
    program: string;
    semester: number;
    course_name: string;
}

export function fetchTheStudentDetailsFromInternal(details:any): Promise<any> {
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
export function fetchTheStudentDetailsFromExternal(details:any): Promise<any> {
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

export function fetchTheStudentDetailsFromAggregate(details:any): Promise<any> {
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
                            console.log("hello: ",fetchResult.rows);
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
                                } else{
                                    resolve("Internal marks are freezed!");
                                }
                            }
                        
                            fetchTheStudentDetailsFromExternal(details).then((externalResults)=>{
                                if(externalResults && externalResults.length>0 && externalResults[0].freeze_marks === true){
                                    if(details.freeze_marks === true){
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
                                                    marks: '',
                                                    semester: details.semester,
                                                    freeze_marks: true,
                                                    created_at: new Date().toISOString(),
                                                    modified_at: new Date().toISOString(),
                                                    academic_year: details.academic_year,
                                                    course_code: details.course_code
                                                }

                                                if (rollnoMarksMap.get(externalResults[i].rollno) === 'A' && externalResults[i].marks === 'A') {
                                                    aggregateDetails.marks = 'A';
                                                } else if(rollnoMarksMap.get(externalResults[i].rollno) === 'A' && externalResults[i].marks !== 'A') {
                                                    aggregateDetails.marks = (parseFloat('0') + parseFloat(externalResults[i].marks)).toString();
                                                } else if(rollnoMarksMap.get(externalResults[i].rollno) !== 'A' && externalResults[i].marks === 'A') {
                                                    aggregateDetails.marks = (parseFloat('0') + parseFloat(rollnoMarksMap.get(externalResults[i].rollno))).toString();
                                                } else {
                                                    aggregateDetails.marks = (parseFloat(rollnoMarksMap.get(externalResults[i].rollno)) + parseFloat(externalResults[i].marks)).toString();
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
                                } else{
                                    resolve("Internal marks are freezed!");
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
                                                    marks: '',
                                                    semester: details.semester,
                                                    freeze_marks: true,
                                                    created_at: new Date().toISOString(),
                                                    modified_at: new Date().toISOString(),
                                                    academic_year: details.academic_year,
                                                    course_code: details.course_code
                                                }

                                                if (rollnoMarksMap.get(internalResults[i].rollno).trim() === 'A' && internalResults[i].marks.trim() === 'A') {
                                                    aggregateDetails.marks = 'A';
                                                } else if(rollnoMarksMap.get(internalResults[i].rollno) === 'A' && internalResults[i].marks !== 'A') {
                                                    aggregateDetails.marks = (parseFloat('0') + parseFloat(internalResults[i].marks)).toString();
                                                } else if(rollnoMarksMap.get(internalResults[i].rollno) !== 'A' && internalResults[i].marks === 'A') {
                                                    aggregateDetails.marks = (parseFloat('0') + parseFloat(rollnoMarksMap.get(internalResults[i].rollno))).toString();
                                                } else {
                                                    aggregateDetails.marks = (parseFloat(rollnoMarksMap.get(internalResults[i].rollno)) + parseFloat(internalResults[i].marks)).toString();
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

export function fetchStudentsCourseCodeService(course_code:string, campus: string, program_type: string, program: string, semester: string, academic_year: string) : Promise<any>{
    return new Promise((resolve, reject) => {
        fetchStudentsCourseCodeModal(course_code, campus, program_type, program, semester, academic_year).then((results)=>{
            resolve(results.rows);
        }).catch((error)=>{
            console.log("error: ", error);
            reject(error);
        })
    })
}

export function fetchMarksService(rollno:string, academic_year:string): Promise<any> {
    return new Promise((resolve, reject) => {
        Promise.all([
            fetchMarksInternalModal(rollno,academic_year),
            fetchMarksExternalModal(rollno,academic_year),
            fetchMarksAggregateModal(rollno,academic_year)
        ])
        .then(([internalResults, externalResults, aggregateResults]) => {
            if (internalResults.rows.length > 0 && externalResults.rows.length > 0 && aggregateResults.rows.length > 0) {
                const result = {
                    rollno: rollno,
                    academic_year: academic_year,
                    campus: aggregateResults.rows[0].campus,
                    program_type: aggregateResults.rows[0].program_type,
                    program: aggregateResults.rows[0].program,
                    semester: aggregateResults.rows[0].semester,
                    internal_marks: internalResults.rows.map(row => ({course_code: row.course_code, course_name:row.course_name, credit:row.credit, marks: row.marks})),
                    external_marks: externalResults.rows.map(row => ({course_code: row.course_code, course_name:row.course_name, credit:row.credit, marks: row.marks})),
                    aggregate_marks: aggregateResults.rows.map(row => ({course_code: row.course_code, course_name:row.course_name, credit:row.credit, marks: row.marks}))
                };
                resolve(result);
            } else {
                fetchMarksInternalModal(rollno,academic_year).then((results)=>{
                    console.log("results:", results);
                })
                reject("No data found for the given roll number and academic year");
            }
        })
        .catch((error) => {
            console.log("Error in fetchMarksService: ", error);
            reject("Internal server error in fetchMarksService");
        });
    });
}

export function fetchDepartDetailsByEmailidService(
    emailid:string
) : Promise<any>{
    return new Promise((resolve, reject) => {
        fetchDepartDetailsByEmailidModal(emailid).then((results)=>{
            resolve(results.rows);
        }).catch((error)=>{
            console.log("error: ", error);
            reject(error);
        })
    })
}

export function resetPasswordService(
    password:string,
    emailid:string
) : Promise<any>{
    return new Promise(async(resolve, reject) => {
        const hsh = await hash(password, 10);
        resetPasswordModal(hsh, emailid).then((results)=>{
            resolve(results.rows);
        }).catch((error)=>{
            console.log("error: ", error);
            reject(error);
        })
    })
}

export function fetchFreezeDetailsService() : Promise<any>{
    return new Promise(async(resolve, reject) => {
        fetchFreezeDetailsModel().then((results)=>{
            resolve(results.rows);
        }).catch((error)=>{
            console.log("error: ", error);
            reject(error);
        })
    })
}



export function getEmailidAdminService(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let emailIds: string[] = [];
            const freezeData: FreezeData[] = await fetchFreezeDetailsService();
            const campuses = new Set(freezeData.map((data: FreezeData) => data.campus));
            for (let campus of campuses) {
                const result: QueryResult<any> = await getEmailidAdminModel(campus); 
                
                for (let i = 0; i < (result.rowCount as number) ; i++){
                    const emailId = result.rows[i].emailid;
                    // console.log("emailid",emailId)
                    emailIds.push(emailId); 
                }
            }
            const campusEmailids = emailIds.join(', ');

            resolve(campusEmailids);
        } catch (error) {
            console.log("Campus email Error:", error);
            reject(error); 
        }
    });
}




