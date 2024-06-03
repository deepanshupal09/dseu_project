"use client";
import React, { useEffect, useState } from "react";
import Head from "../dashboard/Head";
import Nav from "../dashboard/Nav";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button, { ButtonProps } from "@mui/material/Button";
import { fetchCourseDetailsByCourseCode, fetchCoursesBySemester, fetchExamRegistrationByCourseCode, fetchExamRegistrationByProgramAndSemester } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import AdmitCard from "./AdmitCard";
import Image from "next/image";
import { useData } from "@/contexts/DataContext";

interface ProgramList {
    [key: string]: string[];
}

interface Course {
    course_name: string;
    course_code: string;
    course_type: string;
    credit: number;
    semester: number;
    exam_type: string;
}

interface CourseResponse {
    course_name: string;
    course_code: string;
    course_type: string;
    credit: number;
    semester: number;
}

interface Student {
    name: string;
    rollno: string;
    program: string;
    semester: number;
    photo: string;
    dob: string;
    course_codes: string[];
}

export interface User {
    emailid: string;
    role: string;
    campus: string;
}

export interface StudentData {
    campus: string;
    programName: string;
    name: string;
    rollno: string;
    dob: string;
    papers: Paper[];
    photo: string;
}

interface Paper {
    sno: number | null;
    paperCode: string;
    paperName: string;
    semester: string;
    examType: string;
}

export default function Registration() {
    const [selected, setSelected] = useState(0);
    const options = ["Dashboard", "Registration Chart", "Admit Card", "Query"];

    const [isIFrameLoaded, setIsIFrameLoaded] = useState<boolean>(false);

    const [selectedProgramCategory, setSelectedProgramCategory] = useState<string>("");
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [courseList, setCourseList] = useState<string[]>([]);
    //   const [courseCodes, setCourseCodes] = useState<Course[]>([]);
    const [studentList, setStudentList] = useState<Student[]>([]);
    const [selectedCampus, setSelectedCampus] = useState<string>("");
    const [courseCodes, setCourseCodes] = useState<string[]>([]);
    const [admitCardData, setAdmitCardData] = useState<StudentData[]>([]);

    const { data } = useData();
    useEffect(() => {
        setSelectedProgramCategory("");
        setSelectedProgram("");
        setSelectedSemester("");
    }, [selectedCampus]);
    useEffect(() => {
        setSelectedProgram("");
        setSelectedSemester("");
    }, [selectedProgramCategory]);
    useEffect(() => {
        setSelectedSemester("");
    }, [selectedProgram]);

    useEffect(() => {
        getAuthAdmin().then(async (t: any) => {
            if (t) {
                setToken(t.value);
                const data = await parseJwt(t.value);
                setUser(data.user);
                if (data.user.role === "admin") {
                    setSelectedCampus(data.user.campus);
                }
            }
        });
    }, []);

    const semesters = ["2", "4", "6"];
    function mapCourseCodesToPapers(courseCodes: string[], courseData: Course[]): Paper[] {
        const papers: Paper[] = courseCodes.map((code, index) => {
            const course = courseData.find((course) => course.course_code === code);
            if (course) {
                return {
                    sno: index + 1,
                    paperCode: code,
                    paperName: course.course_name,
                    semester: course.semester.toString(),
                    examType: course.exam_type,
                };
            } else {
                // Handle the case where course details are not found for a course code
                return {
                    sno: index + 1,
                    paperCode: code,
                    paperName: "Course Name Not Found",
                    semester: "Semester Not Found",
                    examType: "Exam Type Not Found",
                };
            }
        });

        // Pad the papers array with empty papers if it has less than 10 papers
        const paddedPapers: Paper[] = papers.concat(
            Array.from({ length: Math.max(0, 10 - papers.length) }, () => ({
                sno: null,
                paperCode: "",
                paperName: "",
                semester: "",
                examType: "",
            }))
        );

        return paddedPapers;
    }

    // useEffect(() => {
    //   if (selectedSemester) {
    //     handleApplyFilters();
    //   } else {
    //     setStudentList([]);
    //   }
    // }, [selectedSemester]);

    useEffect(() => {
        if (user && selectedProgram !== "" && selectedSemester !== "") {
            fetchCourseDetailsByCourseCode(token, {
                coursecode: courseCodes,
                campus: selectedCampus,
                program: selectedProgram,
            })
                .then((response: CourseResponse[]) => {
                    const courseData: Course[] = [];
                    response.map((course: CourseResponse) => {
                        courseData.push({
                            exam_type: course.semester < parseInt(selectedSemester) ? "Reappear" : "Regular",
                            ...course,
                        });
                    });

                    const users: StudentData[] = studentList.map((student) => ({
                        campus: selectedCampus, // Update with your campus name or fetch from student data if available
                        programName: student.program,
                        name: student.name,
                        rollno: student.rollno,
                        dob: student.dob,
                        papers: mapCourseCodesToPapers(student.course_codes, courseData),
                        photo: `${process.env.NEXT_PUBLIC_PHOTO_URL}/` + student.photo + "?" + Date.now(),
                    }));

                    setAdmitCardData(users);
                })
                .catch((error) => {});
        }
    }, [courseCodes]);

    useEffect(() => {
        setAdmitCardData([]);
    }, [selectedCampus, selectedProgramCategory, selectedProgram, selectedSemester]);

    const handleApplyFilters = async () => {
        setAdmitCardData([]);
        fetchExamRegistrationByProgramAndSemester(token, selectedCampus, selectedProgramCategory, selectedProgram, selectedSemester)
            .then((res) => {
                setStudentList(res);
                let set = new Set<string>();
                res.map((student: Student) => {
                    student.course_codes.map((courseCode: string) => {
                        set.add(courseCode);
                    });
                });
                const array = Array.from(set);
                setCourseCodes(array);
                setStudentList(res);
            })
            .catch((error) => {});
    };

    const handleChangeSelectedCampus = (event: SelectChangeEvent) => {
        setSelectedCampus(event.target.value);
        // setSelectedProgramCategory("");
    };
    const handleChangeProgramCategory = (event: SelectChangeEvent) => {
        setSelectedProgramCategory(event.target.value);
    };

    const handleChangeProgram = (event: SelectChangeEvent) => {
        setSelectedProgram(event.target.value);
    };

    const handleChangeSemester = (event: SelectChangeEvent) => {
        setSelectedSemester(event.target.value);
    };

    return (
        <>
            <div className="bg-[#dfdede] mt-2"></div>
            <div className="announcement  mx-2 bg-dseublue py-2 px-4 rounded shadow absolute top-[130px] sm:left-[250px] left-0 right-0 sm:mx-12 mt-6">
                <h1 className="text-2xl text-white font-bold text-center">Admit Card</h1>
            </div>
            <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0 mx-2 sm:mx-12 mt-6">
                <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">SELECT</h2>
                {data && (
                    <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
                        {user?.role === "super" && (
                            <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                                <InputLabel id="program-category-label">Campus</InputLabel>
                                <Select labelId="program-category-label" id="program-category" value={selectedCampus} label="Program category" onChange={handleChangeSelectedCampus}>
                                    {data &&
                                        Object.keys(data).map((campus, index) => (
                                            <MenuItem key={index} value={campus}>
                                                {campus}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        )}
                        <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                            <InputLabel id="program-category-label">Program category</InputLabel>
                            <Select labelId="program-category-label" id="program-category" value={selectedProgramCategory} label="Program category" onChange={handleChangeProgramCategory}>
                                {selectedCampus !== "" &&
                                    data &&
                                    data[selectedCampus] &&
                                    Object.keys(data[selectedCampus])?.map((category, index) => (
                                        <MenuItem key={index} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                            <InputLabel id="select-program-label">Select Program</InputLabel>
                            <Select labelId="select-program-label" id="select-program" value={selectedProgram} label="Select Program" onChange={handleChangeProgram}>
                                {selectedCampus !== "" &&
                                    selectedProgramCategory !== "" &&
                                    data &&
                                    data[selectedCampus] &&
                                    data[selectedCampus][selectedProgramCategory] &&
                                    Object.keys(data[selectedCampus][selectedProgramCategory])?.map((program, index) => (
                                        <MenuItem key={index} value={program}>
                                            {program}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                            <InputLabel id="semester-label">Semester</InputLabel>
                            <Select labelId="semester-label" id="semester" value={selectedSemester} label="Semester" onChange={handleChangeSemester}>
                                {selectedCampus !== "" &&
                                    selectedProgramCategory !== "" &&
                                    selectedProgram !== "" &&
                                    data &&
                                    data[selectedCampus] &&
                                    data[selectedCampus][selectedProgramCategory] &&
                                    data[selectedCampus][selectedProgramCategory][selectedProgram] &&
                                    data[selectedCampus][selectedProgramCategory][selectedProgram]?.map((semester, index) => (
                                        <MenuItem key={index} value={semester}>
                                            {semester}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                )}
                <div>
                    <Button onClick={handleApplyFilters} variant="contained" className="my-5">
                        Apply
                    </Button>
                    {admitCardData.length > 0 && (
                        <div className=" flex justify-center mx-auto my-5">
                            <AdmitCard admitCardData={admitCardData} />
                        </div>
                    )}
                </div>
            </div>
            <div className="">{/* <img src="https://exam.dseu.ac.in/image/41521070_photo.jpg" /> */}</div>
        </>
    );
}
