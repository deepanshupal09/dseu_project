"use client";
import React, { useState, useEffect, useRef, use } from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Select, MenuItem, FormControl, InputLabel, Button, TextField, CircularProgress } from "@mui/material";

import ReactToPrint from "react-to-print";
import logo from "@/app/images/dseu.png";
import result_info_updated from "@/app/images/result_info_updated.png";
import Image from "next/image";
import { SelectChangeEvent } from "@mui/material/Select";
import { getAuth, getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { StudentDetails } from "@/app/(navbar)/profile/page";
import { fetchBatchResult, fetchMarksController, fetchUserByRollno, getUserByRollNo } from "@/app/actions/api";
import { useDebounce } from "use-debounce";
import { useData } from "@/contexts/DataContext";
import { User } from "../query/page";

interface MarkSheet {
    Credits_earned: number;
    academic_year: string;
    aggregate_marks: AggregateMark[];
    bridge_marks: BridgeMark[];
    campus: string;
    external_marks: ExternalMark[];
    internal_marks: InternalMark[];
    program: string;
    program_type: string;
    rollno: string;
    semester: number;
    sgpa_grade: string;
    sgpa_result: number;
    personalDetails: PersonalDetails;
}

interface AggregateMark {
    course_code: string;
    course_name: string;
    credit: number;
    credit_earned?: number;
    marks: string;
    grade: string;
    grade_point?: string;
    sgpa?: number;
    yo?: number;
}

interface BridgeMark {
    course_code: string;
    course_name: string;
    credit: number;
    marks: string;
    grade: string;
    grade_point: string;
}


interface ExternalMark {
    course_code: string;
    course_name: string;
    credit: number;
    marks: string;
    grade: string;
}

interface InternalMark {
    course_code: string;
    course_name: string;
    credit: number;
    marks: string;
    grade: string;
}

interface PersonalDetails {
    aadhar: string;
    abc_id: string;
    alternate_phone: string | null;
    campus: string;
    dob: string;
    emailid: string;
    father: string;
    rollno: string;
    gender: string;
    guardian: string | null;
    last_modified: string;
    mother: string;
    name: string;
    phone: string;
    photo: string;
    program: string;
    program_type: string;
    pwbd_certificate: string;
    semester: number;
    year_of_admission: string;
}



type StudentInfo = {
    aadhar: string;
    abc_id: string;
    alternate_phone: string;
    campus: string;
    dob: string;
    emailid: string;
    father: string;
    gender: string;
    guardian: string | null;
    last_modified: string;
    mother: string;
    name: string;
    otp: string;
    password: string;
    phone: string;
    photo: string;
    program: string;
    program_type: string;
    pwbd_certificate: string;
    rollno: string;
    semester: number;
    year_of_admission: string;
};

interface StudentData {
    personalDetails: PersonalDetails;
    markSheet: MarkSheet;
}

export default function Home() {
    const [user, setUser] = useState<StudentDetails | null>(null);
    const [token, setToken] = useState("");
    const [academicYear, setAcademicYear] = useState("");
    const [semester, setSemester] = useState("");
    const [academicYears, setAcademicYears] = useState<string[]>(["2023-2024"]);
    const [rollno, setRollno] = useState("");
    // const [semesters, setSemesters] = useState<number[]>([1, 2, 4, 6]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isMarksEvaluated, setIsMarksEvaluated] = useState(true);
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const [debouncedRollNo] = useDebounce(rollno, 500);
    const [student, setStudent] = useState<StudentInfo | null>(null);
    const [selectedCampus, setSelectedCampus] = useState<string>("");
    const [selectedProgramCategory, setSelectedProgramCategory] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [submitEnabled, setSubmitEnabled] = useState(false)
    const [admin, setAdmin] = useState<User | null>(null)
    const [results, setResults] = useState<StudentData[]>([])
    const [loading, setLoading] = useState(false)
    const { data } = useData();

    const [selectedAcademicYear, setSelectedAcademicYear] = useState("")

    useEffect(() => {
        getAuthAdmin().then((auth) => {
            if (auth) {
                setToken(auth.value);
                const data = parseJwt(auth?.value as string);
                setAdmin(data.user)
                if (data.user.role === 'admin') {
                    setSelectedCampus(data.user.campus)
                }
            }
        });
    }, []);


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
        setSelectedAcademicYear("");
    }, [selectedSemester]);


    const handleChangeSelectedCampus = (event: SelectChangeEvent) => {
        setSelectedCampus(event.target.value);
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


    const handleData = async () => {
        try {

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        if (selectedCampus !== "") {
            setSubmitEnabled(true)
        }
    }, [selectedSemester]);

    useEffect(() => {
        //   console.log("api call")
        setIsSubmitted(false);
        if (debouncedRollNo !== "") {
            getUserByRollNo(debouncedRollNo, token)
                .then((user) => {
                    // console.log("first ", user)
                    setStudent(user[0]);
                    setSemester(user[0].semester.toString());
                })
                .catch((error) => {
                    console.log("Error fetching user");
                });
        }
    }, [debouncedRollNo]);

    const handleAcademicYearChange = (event: SelectChangeEvent<string>) => {
        setAcademicYear(event.target.value);
    };

    const handleSemesterChange = (event: SelectChangeEvent<string>) => {
        setSemester(event.target.value);
    };
    const handleChangeAcademicYear = (event: SelectChangeEvent<string>) => {
        console.log("value: ", event.target.value)
        setSelectedAcademicYear(event.target.value);
    };

    const handleSubmit = async () => {
        //   console.log("here ", academicYear, semester, )
        setResults([])
        if (token) {
            setLoading(true);
            const res: StudentData[] = await fetchBatchResult(selectedCampus, selectedProgram, selectedProgramCategory, selectedSemester, selectedAcademicYear, token);
            const sortedRes = res.sort((a, b) => {
                return a.personalDetails.rollno.localeCompare(b.personalDetails.rollno, undefined, { numeric: true });
            });
            setResults(sortedRes);
            setLoading(false);
        }

    };

    const renderTableRows = (studentData: MarkSheet) => {
        if (!studentData) return null;

        const normalCourseRows = studentData.aggregate_marks.map((aggregateMark, index) => {
            const internalMark = studentData.internal_marks.find((mark) => mark.course_code === aggregateMark.course_code);
            const externalMark = studentData.external_marks.find((mark) => mark.course_code === aggregateMark.course_code);

            return (
                <tr key={index}>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{index + 1}</td>
                    <td className="px-2 py-3 border border-black text-left text-xs font-medium">{aggregateMark.course_code}</td>
                    <td className="px-2 py-3 border border-black text-left text-xs font-medium">{aggregateMark.course_name}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{aggregateMark.credit}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{aggregateMark.credit_earned}</td>
                    {/* <td className="px-2 py-3 border border-black text-center text-xs font-medium">
            {internalMark ? internalMark.grade : "-"}
          </td>
          <td className="px-2 py-3 border border-black text-center text-xs font-medium">
            {externalMark ? externalMark.grade : "-"}
          </td> */}
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{aggregateMark.grade}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{aggregateMark.grade_point}</td>
                </tr>
            );
        });

        const bridgeCourseRows =
            studentData.bridge_marks?.map((bridgeMark, index) => (
                <tr key={`bridge-${index}`}>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">
                        {studentData.aggregate_marks.length + index + 1}
                    </td>
                    <td className="px-2 py-3 border border-black text-left text-xs font-medium">{bridgeMark.course_code}</td>
                    <td className="px-2 py-3 border border-black text-left text-xs font-medium">{bridgeMark.course_name}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">0</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">0</td>
                    {/* <td className="px-2 py-3 border border-black text-center text-xs font-medium">-</td>
          <td className="px-2 py-3 border border-black text-center text-xs font-medium">-</td> */}
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{bridgeMark.grade}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{bridgeMark.grade_point}</td>
                </tr>
            )) || [];

        return [...normalCourseRows, ...bridgeCourseRows];
    };
    const renderParentInfo = (student: PersonalDetails) => {
        const capitalizeName = (name: string) =>
            name
                .toUpperCase();

        if (student?.father && student?.mother) {
            return (
                <>
                    <div className="flex font-roboto">
                        <div className="w-8/12 text-left font-normal font-serif p-1">
                            Name of the Student: <span className="font-semibold">{capitalizeName(student?.name)}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Father's name: "} <span className="font-semibold">{capitalizeName(student?.father)}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-8/12 text-left font-normal p-1">
                            Enrollment no: <span className="font-semibold font-roboto">{student?.rollno}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Mother's name: "} <span className="font-semibold">{capitalizeName(student?.mother)}</span>
                        </div>
                    </div>
                </>
            );
        } else if (student?.father) {
            return (
                <>
                    <div className="flex font-roboto">
                        <div className="w-8/12 text-left font-normal font-serif p-1">
                            Name of the Student: <span className="font-semibold">{capitalizeName(student?.name)}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Father's name: "} <span className="font-semibold">{capitalizeName(student?.father)}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-8/12 text-left font-normal p-1">
                            Enrollment no: <span className="font-semibold font-roboto">{student?.rollno}</span>
                        </div>
                    </div>
                </>
            );
        } else if (student?.mother) {
            return (
                <>
                    <div className="flex font-roboto">
                        <div className="w-8/12 text-left font-normal font-serif p-1">
                            Name of the Student: <span className="font-semibold">{capitalizeName(student?.name)}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Mother's name: "} <span className="font-semibold">{capitalizeName(student?.mother)}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-8/12 text-left font-normal p-1">
                            Enrollment no: <span className="font-semibold font-roboto">{student?.rollno}</span>
                        </div>
                    </div>
                </>
            );
        } else if (student?.guardian) {
            return (
                <>
                    <div className="flex font-roboto">
                        <div className="w-8/12 text-left font-normal font-serif p-1">
                            Name of the Student: <span className="font-semibold">{capitalizeName(student?.name)}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Guardian's name: "} <span className="font-semibold">{capitalizeName(student?.guardian)}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-8/12 text-left font-normal p-1">
                            Enrollment no: <span className="font-semibold font-roboto">{student?.rollno}</span>
                        </div>
                    </div>
                </>
            );
        } else {
            return null;
        }
    };

    return (
        <>
            <div className="bg-[#dfdede]"></div>
            <div className="mt-[154px] max-sm:mt-[150px] px-2 sm:ml-[250px]">
                <div className="bg-dseublue py-2 px-2 sm:mx-8 rounded shadow mt-28">
                    <h1 className="text-2xl text-white font-bold text-center">Batch Result</h1>
                </div>
                <div className="py-2 px-2 rounded shadow max-sm:w-full mt-5 sm:mx-8">
                    <div className="px-2">
                        <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">SELECT</h2>
                        {data && (
                            <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
                                {admin?.role === "super" && (
                                    <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                                        <InputLabel id="program-category-label">Campus</InputLabel>
                                        <Select labelId="program-category-label" id="program-category" value={selectedCampus} label="Program category" onChange={handleChangeSelectedCampus}>
                                            {data &&
                                                Object.keys(data)?.map((campus, index) => (
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
                                    <Select labelId="select-program-label" id="select-program" value={selectedProgram} label="Select Program" onChange={handleChangeProgram} disabled={!selectedProgramCategory}>
                                        {selectedCampus !== "" &&
                                            data &&
                                            selectedProgramCategory !== "" &&
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
                                    <Select labelId="semester-label" id="semester" value={selectedSemester} label="Semester" onChange={handleChangeSemester} disabled={!selectedProgram}>
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
                                <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                                    <InputLabel id="academic-year-label">Academic Year</InputLabel>
                                    <Select labelId="academic-year-label" id="academic-year" value={selectedAcademicYear} label="Semester" onChange={handleChangeAcademicYear} disabled={!selectedSemester}>
                                        {academicYears?.map((academicYear, index) => (
                                            <MenuItem key={index} value={academicYear}>
                                                {academicYear}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                        {/* <div className="flex justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              disabled={
                !selectedProgram ||
                !selectedProgramCategory ||
                !selectedSemester
              }
            >
              Apply
            </Button>
          </div> */}
                    </div>
                    <div className="flex justify-center mt-4 space-x-4">
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!(selectedCampus !== "" && selectedProgramCategory !== "" && selectedProgram !== "" && selectedSemester !== "" && selectedAcademicYear !== "")}>
                            Submit
                        </Button>
                    </div>
                </div>
                {results.length > 0 && (

                    <ReactToPrint
                        trigger={() => (
                            <Button className="mx-12 mt-6" variant="contained" color="primary">
                                Print
                            </Button>
                        )}
                        content={() => componentRef.current}
                    />
                )}

                <div className="">
                    {!loading && (
                        <div ref={componentRef} >

                            {results.map((studentData: StudentData, index: number) => {
                                return (
                                    <div key={index} className="print-new-page ">

                                        <div className="">
                                            <div className="py-1 px-2 rounded sm:mx-auto mt-6 relative w-[1400px] sm:overflow-x-hidden">

                                                <div className="mx-8 my-2 font-bold">
                                                    <h4>ABC ID: {studentData.personalDetails.abc_id}</h4>
                                                </div>
                                                <div className="flex flex-row mx-auto">
                                                    <div>
                                                        <Image className="w-44 h-44 mt-2 absolute" src={logo} alt="DSEU Logo" />
                                                    </div>
                                                    <div className="text-center flex flex-col mx-auto p-1">
                                                        <div className="text-dseublue text-2xl font-extrabold font-mono">
                                                            दिल्ली कौशल एवं उद्यमिता विश्वविद्यालय
                                                        </div>
                                                        <div className="text-dseublue text-4xl font-extrabold font-serif">
                                                            Delhi Skill & Entrepreneurship University
                                                        </div>
                                                        <div className="text-dseublue text-lg font-extrabold font-serif">
                                                            (A State University Established under Govt. of NCT of Delhi Act 04 of 2020)
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-center flex flex-col mx-auto">
                                                    <div className="text-xl font-serif p-1">
                                                        Grade sheet of EoSE of <span className="font-bold font-sans">June-2024</span>
                                                    </div>
                                                    <div className="text-lg font-bold font-serif mb-4">
                                                        {studentData.markSheet.program}-Batch <span className="font-sans">{studentData.personalDetails.year_of_admission}</span>
                                                    </div>
                                                </div>
                                                <div className="border border-solid ">
                                                    <div className="text-center flex flex-col my-2 mr-5 px-14 sm:">{renderParentInfo(studentData.personalDetails)}</div>

                                                    <table className="w-11/12 mx-auto leading-normal my-2 font-bold  tracking-wider font-roboto">
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider"
                                                                    style={{ width: "6%" }}
                                                                >
                                                                    S.No
                                                                </th>
                                                                <th
                                                                    className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider"
                                                                    style={{ width: "16%" }}
                                                                >
                                                                    Course Code
                                                                </th>
                                                                <th
                                                                    className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider"
                                                                    style={{ width: "38%" }}
                                                                >
                                                                    Course Name
                                                                </th>
                                                                <th
                                                                    className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider"
                                                                    style={{ width: "8%" }}
                                                                >
                                                                    Credits
                                                                </th>
                                                                <th
                                                                    className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider"
                                                                    style={{ width: "12%" }}
                                                                >
                                                                    Credits Earned (C<sub>i</sub>)
                                                                </th>
                                                                {/* <th
                                  className="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider"
                                  style={{ width: "9%" }}
                                >
                                  Letter Grade Continuous Evaluation(CA)
                                </th> */}
                                                                {/* <th
                                  className="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider"
                                  style={{ width: "10%" }}
                                >
                                  Letter Grade End of Semester Evaluation (EOSE)
                                </th> */}
                                                                <th
                                                                    className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider"
                                                                    style={{ width: "10%" }}
                                                                >
                                                                    Grade
                                                                </th>
                                                                <th
                                                                    className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider"
                                                                    style={{ width: "10%" }}
                                                                >
                                                                    Grade Point (P<sub>i</sub>)
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="font-semibold">{renderTableRows(studentData.markSheet)}</tbody>
                                                    </table>
                                                    <div>
                                                        <table className="w-11/12 mx-auto leading-normal mt-5 font-bold uppercase tracking-wider font-roboto sm:overflow-x-hidden">
                                                            <thead className="border border-black">
                                                                <tr className="border border-black">
                                                                    <th
                                                                        rowSpan={2}
                                                                        className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider"
                                                                    >
                                                                        Credits Earned in this semester
                                                                    </th>
                                                                    <th
                                                                        rowSpan={2}
                                                                        className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider"
                                                                    >
                                                                        Total Credits earned as on date
                                                                    </th>
                                                                    <th
                                                                        colSpan={2}
                                                                        className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider"
                                                                    >
                                                                        SGPA
                                                                    </th>
                                                                    <th
                                                                        colSpan={2}
                                                                        className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider"
                                                                    >
                                                                        CGPA
                                                                    </th>
                                                                    <th
                                                                        rowSpan={2}
                                                                        className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider"
                                                                    >
                                                                        Grading System
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider">
                                                                        Earned
                                                                    </th>
                                                                    <th className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider">
                                                                        Grade Letter
                                                                    </th>
                                                                    <th className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider">
                                                                        Earned
                                                                    </th>
                                                                    <th className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider">
                                                                        Grade Letter
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white">
                                                                <tr className="border border-black">
                                                                    <td className="px-6 py-4 text-center border border-black whitespace-nowrap">
                                                                        {studentData.markSheet.Credits_earned}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center border border-black whitespace-nowrap">-</td>
                                                                    <td className="px-6 py-4 text-center border border-black whitespace-nowrap">
                                                                        {studentData.markSheet.sgpa_result.toPrecision(3)}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center border border-black whitespace-nowrap">
                                                                        {studentData.markSheet.sgpa_grade}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center border border-black whitespace-nowrap">-</td>
                                                                    <td className="px-6 py-4 text-center border border-black whitespace-nowrap">-</td>
                                                                    <td className="px-6 py-4 text-center border border-black whitespace-nowrap">ABS</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <p className="text-right mx-14">Computer Generated Provisional Grade Sheet</p>
                                                    </div>
                                                </div>

                                                <div className=" h-[930px] overflow-y-clip  ">
                                                    <Image
                                                        src={result_info_updated}
                                                        alt="Grade Scheme used for calculating result."
                                                        layout="responsive"
                                                        objectFit="contain"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <style jsx global>{`
                        @media print {
                          @page {
                            size: landscape;
                          }
                                          .print-new-page {
                                page-break-before: always;
                            }
                        }
                      `}</style>
                                    </div>
                                )

                            })}
                        </div>
                    )}
                    {loading && (
                        <div className="flex w-full my-8 h-[70vh] justify-center items-center">
                            <CircularProgress />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
