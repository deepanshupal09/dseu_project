"use client";
import React, { useEffect, useState, useRef } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Tabs, Tab, CircularProgress } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { fetchAllMarksheetController } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { useData } from "@/contexts/DataContext";
import ReactToPrint from "react-to-print";
import logo from "../../../images/dseu.png";
import result_info_updated from "../../../images/result_info_updated.png";
import Image from "next/image";

export interface User {
    emailid: string;
    role: string;
    campus: string;
}
interface AggregateMark {
    course_code: string;
    course_name: string;
    credit: number;
    credit_earned: number;
    grade: string;
    grade_point: number;
}

interface InternalMark {
    course_code: string;
    grade: string;
}

interface ExternalMark {
    course_code: string;
    grade: string;
}

interface BridgeMark {
    course_code: string;
    course_name: string;
    grade: string;
    grade_point: number;
}

interface MarkSheet {
    aggregate_marks: AggregateMark[];
    internal_marks: InternalMark[];
    external_marks: ExternalMark[];
    bridge_marks?: BridgeMark[];
    rollno: number;
    Credits_earned: number;
    sgpa_result: number;
    sgpa_grade: string;
}

interface PersonalDetails {
    abc_id: string;
    name: string;
    father?: string;
    mother?: string;
    guardian?: string;
    relation?: string;
    campus: string;
    program_type: string;
    program: string;
    semester: number;
    year_of_admission: number;
}

interface StudentData {
    personalDetails: PersonalDetails;
    markSheet: MarkSheet;
}

export default function Registration() {
    const [selectedProgramCategory, setSelectedProgramCategory] = useState<string>("");
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [courseCodes, setCourseCodes] = useState<string[]>([]);
    const [selectedCampus, setSelectedCampus] = useState<string>("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("2023-2024");
    const [loading, setLoading] = useState<boolean>(false);
    const [dataReceived, setDataReceived] = useState<boolean>(false);
    const [studentData, setStudentData] = useState<StudentData[]>([]);
    const [filteredData, setFilteredData] = useState<StudentData[]>([]);
    const [isApplied, setIsApplied] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
    const studentsPerPage = 1; 
    const [currentPage, setCurrentPage] = useState(0);
    const [mode, setMode] = useState("view");
    const [isLoading, setIsLoading] = useState(false);

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

    const handleChangeAcademicYear = (event: SelectChangeEvent) => {
        setSelectedAcademicYear(event.target.value);
    };

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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const resultData = await fetchAllMarksheetController(selectedAcademicYear, token);
            // console.log(resultData);
            const processedData = processStudentData(resultData);
            setStudentData(processedData);
            setDataReceived(true);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching results:", error);
            setLoading(false);
        }
    };

    const processStudentData = (data:any) => {
        return data.map((student:any) => {
            const { personalDetails, markSheet } = student;
            const {
                campus, program, program_type, semester, year_of_admission, abc_id, father, mother, guardian, name
            } = personalDetails;
            const { rollno, sgpa_result, sgpa_grade, Credits_earned } = markSheet;

            const aggregateMarks = markSheet.aggregate_marks ? markSheet.aggregate_marks.map((mark:any) => ({
                course_code: mark.course_code,
                course_name: mark.course_name,
                credit: mark.credit,
                credit_earned: mark.credit_earned,
                grade: mark.grade,
                grade_point: mark.grade_point,
            })) : [];

            const internalMarks = markSheet.internal_marks ? markSheet.internal_marks.map((mark:any) => ({
                course_code: mark.course_code,
                grade: mark.grade,
            })) : [];

            const externalMarks = markSheet.external_marks ? markSheet.external_marks.map((mark:any) => ({
                course_code: mark.course_code,
                grade: mark.grade,
            })) : [];

            const bridgeMarks = markSheet.bridge_marks ? markSheet.bridge_marks.map((mark:any) => ({
                course_code: mark.course_code,
                course_name: mark.course_name,
                grade: mark.grade,
                grade_point: mark.grade_point,
            })) : [];

            return {
                personalDetails: {
                    abc_id, name, father, mother, guardian, campus, program_type, program, semester, year_of_admission,
                },
                markSheet: {
                    rollno, sgpa_result, sgpa_grade, Credits_earned, aggregateMarks, internalMarks, externalMarks, bridgeMarks,
                },
            };
        });
    };

    const handleApplyFilters = () => {
        // console.log("Selected filters:", selectedCampus, selectedProgramCategory, selectedProgram, selectedSemester);

        const filtered = studentData.filter((student) => {
            const { personalDetails } = student;
            const selectedSemesterNumber = parseInt(selectedSemester);

            return (
                personalDetails &&
                personalDetails.campus === selectedCampus &&
                personalDetails.program_type === selectedProgramCategory &&
                personalDetails.program === selectedProgram &&
                personalDetails.semester === selectedSemesterNumber
            );
        });

        // console.log("Filtered student data:", filtered);
        setFilteredData(filtered); 
        setIsApplied(true);
        setIsLoading(false);
    };

    const academicYears = ["2023-2024"];
    const totalPages = Math.ceil(filteredData.length / studentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderParentInfo = (student: any) => {
        const { personalDetails, markSheet } = student;
    
        if (personalDetails.father && personalDetails.mother) {
            return (
                <>
                    <div className="flex font-roboto">
                        <div className="w-8/12 text-left font-normal font-serif p-1">
                            Name of the Student: <span className="font-semibold">{personalDetails.name}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Father's"} name: <span className="font-semibold">{personalDetails.father}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-8/12 text-left font-normal p-1">
                            Enrollment no: <span className="font-semibold font-roboto">{markSheet.rollno}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Mother's name:"} <span className="font-semibold">{personalDetails.mother}</span>
                        </div>
                    </div>
                </>
            );
        } else if (personalDetails.father) {
            return (
                <>
                    <div className="flex font-roboto">
                        <div className="w-8/12 text-left font-normal font-serif p-1">
                            Name of the Student: <span className="font-semibold">{personalDetails.name}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Father's"} name: <span className="font-semibold">{personalDetails.father}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-8/12 text-left font-normal p-1">
                            Enrollment no: <span className="font-semibold font-roboto">{markSheet.rollno}</span>
                        </div>
                    </div>
                </>
            );
        } else if (personalDetails.mother) {
            return (
                <>
                    <div className="flex font-roboto">
                        <div className="w-8/12 text-left font-normal font-serif p-1">
                            Name of the Student: <span className="font-semibold">{personalDetails.name}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Mother's"} name: <span className="font-semibold">{personalDetails.mother}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-8/12 text-left font-normal p-1">
                            Enrollment no: <span className="font-semibold font-roboto">{markSheet.rollno}</span>
                        </div>
                    </div>
                </>
            );
        } else if (personalDetails.guardian) {
            return (
                <>
                    <div className="flex font-roboto">
                        <div className="w-8/12 text-left font-normal font-serif p-1">
                            Name of the Student: <span className="font-semibold">{personalDetails.name}</span>
                        </div>
                        <div className="w-4/12 text-left font-normal font-serif p-1">
                            {"Guardian's"} name: <span className="font-semibold">{personalDetails.guardian}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-8/12 text-left font-normal p-1">
                            Enrollment no: <span className="font-semibold font-roboto">{markSheet.rollno}</span>
                        </div>
                        {/* <div className="w-4/12 text-left font-normal font-serif p-1">
                            Relation: <span className="font-semibold">{personalDetails.relation}</span>
                        </div> */}
                    </div>
                </>
            );
        } else {
            return null;
        }
    };
    
    
    const handleModeChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setMode(newValue);
    };
    

    const renderTableRows = (student:any) => {
        if (!student || !student.markSheet) {
            console.log("No mark sheet found for this student");
            return null;
        }
        const { personalDetails, markSheet } = student;
        if (!markSheet.aggregateMarks || markSheet.aggregateMarks.length === 0) {
            console.log("No aggregate marks found for this student");
            return (
                <tbody className="font-semibold">
                    <tr>
                        <td colSpan={9} className="text-center">No aggregate marks found for this student</td>
                    </tr>
                </tbody>
            );
        }
        const normalCourseRows = markSheet.aggregateMarks.map((aggregateMark:any, index:any) => {
            const internalMark = (markSheet.internalMarks || []).find((mark:any) => mark.course_code === aggregateMark.course_code) || {};
            const externalMark = (markSheet.externalMarks || []).find((mark:any) => mark.course_code === aggregateMark.course_code) || {};
            return (
                <tr key={`${student.abc_id}-${index}`}>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{index + 1}</td>
                    <td className="px-2 py-3 border border-black text-left text-xs font-medium">{aggregateMark.course_code}</td>
                    <td className="px-2 py-3 border border-black text-left text-xs font-medium">{aggregateMark.course_name}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{aggregateMark.credit}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{aggregateMark.credit_earned}</td>
                    {/* <td className="px-2 py-3 border border-black text-center text-xs font-medium">{internalMark.grade || '-'}</td> */}
                    {/* <td className="px-2 py-3 border border-black text-center text-xs font-medium">{externalMark.grade || '-'}</td> */}
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{aggregateMark.grade}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{aggregateMark.grade_point}</td>
                </tr>
            );
        });
        const bridgeCourseRows = markSheet.bridgeMarks && markSheet.bridgeMarks.length > 0
            ? markSheet.bridgeMarks.map((bridgeMark:any, index:any) => (
                <tr key={`${student.abc_id}-bridge-${index}`}>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{markSheet.aggregateMarks.length + index + 1}</td>
                    <td className="px-2 py-3 border border-black text-left text-xs font-medium">{bridgeMark.course_code}</td>
                    <td className="px-2 py-3 border border-black text-left text-xs font-medium">{bridgeMark.course_name}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">0</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">0</td>
                    {/* <td className="px-2 py-3 border border-black text-center text-xs font-medium">-</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">-</td> */}
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{bridgeMark.grade}</td>
                    <td className="px-2 py-3 border border-black text-center text-xs font-medium">{bridgeMark.grade_point}</td>
                </tr>
            ))
            : [];
        const allRows = [...normalCourseRows, ...bridgeCourseRows];
        return (
            <tbody className="font-semibold">
                {allRows}
            </tbody>
        );
    };
    
    const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const allMarksheets = filteredData.map((student, index) => `
        <div class="print-page-break">
          ${student.personalDetails ? `<div class="mx-8 my-2 font-bold"><h4>ABC ID: ${student.personalDetails.abc_id}</h4></div>` : ''}
          <div class="flex flex-row mx-auto">
            <div><img class="w-44 h-44 mt-2 absolute" src="${logo}" alt="DSEU Logo" /></div>
            <div class="text-center flex flex-col mx-auto p-1">
              <div class="text-dseublue text-2xl font-extrabold font-mono">दिल्ली कौशल एवं उद्यमिता विश्वविद्यालय</div>
              <div class="text-dseublue text-4xl font-extrabold font-serif">Delhi Skill & Entrepreneurship University</div>
              <div class="text-dseublue text-lg font-extrabold font-serif">(A State University Established under Govt. of NCT of Delhi Act 04 of 2020)</div>
            </div>
          </div>
          <div class="text-center flex flex-col mx-auto">
            <div class="text-xl font-extrabold font-serif p-1">PROVISIONAL GRADESHEET OF EOSE OF ${academicYears}</div>
            <div class="text-xl font-extrabold font-serif p-1 mb-4">${student.personalDetails.program} (Batch - ${student.personalDetails.year_of_admission})</div>
          </div>

          <div class="text-center flex flex-col my-2 mr-5 px-14 sm:">${renderParentInfo(student)}</div>
          <table class="w-11/12 mx-auto leading-normal my-2 font-bold uppercase tracking-wider font-roboto">
            <thead>
              <tr>
                <th class="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style="width: 6%;">S.No</th>
                <th class="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style="width: 15%;">Course Code</th>
                <th class="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style="width: 40%;">Course Name</th>
                <th class="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style="width: 6%;">Credits</th>
                <th class="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style="width: 6%;">Credits Earned</th>
                {/* <th class="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style="width: 9%;">Letter Grade Continuous Evaluation (CA)</th>
                 <th class="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style="width: 10%;">Letter Grade End of Semester Evaluation (EOSE)</th> */}
                <th class="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style="width: 6%;">Grade</th>
                <th class="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style="width: 6%;">Grade Point</th>
              </tr>
            </thead>
            ${renderTableRows(student)}
          </table>
          <table class="w-11/12 mx-auto leading-normal mt-5 font-bold uppercase tracking-wider font-roboto sm:overflow-x-hidden">
            <thead class="border border-black">
              <tr class="border border-black">
                <th rowSpan="2" class="px-6 py-3 text-center text-xs font-bold border border-black uppercase tracking-wider">Credits Earned in this semester</th>
                <th rowSpan="2" class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider border border-black">Total Credits earned as on date</th>
                <th colSpan="2" class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider border border-black">SGPA</th>
                <th colSpan="2" class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider border border-black">CGPA</th>
                <th rowSpan="2" class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider border border-black">Grading System</th>
              </tr>
              <tr>
                <th class="px-6 py-3 text-center text-xs font-bold border border-black uppercase tracking-wider">Earned</th>
                <th class="px-6 py-3 text-center text-xs font-bold border border-black uppercase tracking-wider">Grade Letter</th>
                <th class="px-6 py-3 text-center text-xs font-bold border border-black uppercase tracking-wider">Earned</th>
                <th class="px-6 py-3 text-center text-xs font-bold border border-black uppercase tracking-wider">Grade Letter</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr class="border border-black">
                <td class="px-6 py-4 text-center border border-black whitespace-nowrap">${student.markSheet.Credits_earned}</td>
                <td class="px-6 py-4 text-center border border-black whitespace-nowrap">-</td>
                <td class="px-6 py-4 text-center border border-black whitespace-nowrap">${student.markSheet.sgpa_result.toPrecision(3)}</td>
                <td class="px-6 py-4 text-center border border-black whitespace-nowrap">${student.markSheet.sgpa_grade}</td>
                <td class="px-6 py-4 text-center border border-black whitespace-nowrap">-</td>
                <td class="px-6 py-4 text-center border border-black whitespace-nowrap">-</td>
                <td class="px-6 py-4 text-center border border-black whitespace-nowrap">ABS</td>
              </tr>
            </tbody>
          </table>
          <p class="text-right mx-14">Computer Generated Provisional Grade Sheet</p>
        </div>`).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Preview</title>
            <style>
              @media print {
                @page {
                  size: landscape;
                }
                .print-page-break {
                  page-break-after: always;
                }
              }
            </style>
          </head>
          <body>
            ${allMarksheets}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };


      return (
        <>
            <div className="bg-[#dfdede]"></div>
            <div className="mt-[154px] max-sm:mt-[150px] px-2 sm:ml-[250px]">
                <div className="bg-dseublue py-2 px-2 sm:mx-8 rounded shadow mt-28">
                    <h1 className="text-2xl text-white font-bold text-center">Results</h1>
                </div>
                <div className="py-2 px-2 rounded shadow max-sm:w-full mt-5 sm:mx-8">
                    <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">SELECT</h2>
                    <div className="flex mb-2 space-x-3">
                        <FormControl fullWidth variant="outlined" className="my-2">
                            <InputLabel id="academic-year-label">Academic Year</InputLabel>
                            <Select
                                labelId="academic-year-label"
                                id="academic-year"
                                value={selectedAcademicYear}
                                onChange={handleChangeAcademicYear}
                                label="Academic Year"
                            >
                                {academicYears.map((year, index) => (
                                    <MenuItem key={index} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Loading..." : "Submit"}
                    </Button>
                </div>
                {dataReceived && (
                    <div className="py-2 px-2 rounded shadow max-sm:w-full mt-5 sm:mx-8">
                        {data && (
                            <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
                                {user?.role === "super" && (
                                    <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                                        <InputLabel id="program-category-label">Campus</InputLabel>
                                        <Select
                                            labelId="program-category-label"
                                            id="program-category"
                                            value={selectedCampus}
                                            label="Campus"
                                            onChange={handleChangeSelectedCampus}
                                        >
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
                                    <InputLabel id="program-category-label">Program Category</InputLabel>
                                    <Select
                                        labelId="program-category-label"
                                        id="program-category"
                                        value={selectedProgramCategory}
                                        label="Program Category"
                                        onChange={handleChangeProgramCategory}
                                    >
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
                                    <Select
                                        labelId="select-program-label"
                                        id="select-program"
                                        value={selectedProgram}
                                        label="Select Program"
                                        onChange={handleChangeProgram}
                                    >
                                        {selectedCampus !== "" &&
                                            selectedProgramCategory !== "" &&
                                            data &&
                                            data[selectedCampus] &&
                                            data[selectedCampus][selectedProgramCategory] &&
                                            Object.keys(data[selectedCampus][selectedProgramCategory]).map(
                                                (program, index) => (
                                                    <MenuItem key={index} value={program}>
                                                        {program}
                                                    </MenuItem>
                                                )
                                            )}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                                    <InputLabel id="select-semester-label">Select Semester</InputLabel>
                                    <Select
                                        labelId="select-semester-label"
                                        id="select-semester"
                                        value={selectedSemester}
                                        label="Select Semester"
                                        onChange={handleChangeSemester}
                                    >
                                        {selectedCampus !== "" &&
                                            selectedProgramCategory !== "" &&
                                            selectedProgram !== "" &&
                                            data &&
                                            data[selectedCampus] &&
                                            data[selectedCampus][selectedProgramCategory] &&
                                            data[selectedCampus][selectedProgramCategory][selectedProgram]?.map(
                                                (semester, index) => (
                                                    <MenuItem key={index} value={semester}>
                                                        {semester}
                                                    </MenuItem>
                                                )
                                            )}
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApplyFilters}
                            disabled={!selectedProgramCategory || !selectedProgram || !selectedSemester}
                        >
                            Apply Filters
                        </Button>
                    </div>
                )}
                {isLoading && <CircularProgress />}
               <div>
               {isApplied && (
                    <Tabs value={mode} onChange={handleModeChange} centered>
                        <Tab label="View Mode" value="view" />
                        <Tab label="Print Mode" value="print" />
                    </Tabs>
                )}


            {isApplied && (!filteredData || filteredData.length === 0) ? (
                <div className="text-center my-20 font-semibold text-2xl">
                    <p>No data to display. Please apply filters.</p>
                </div>
            ) : (
                <>
                    {isApplied && (
                        <ReactToPrint
                            trigger={() => (
                                <Button onClick={handlePrint} className="mx-12 mt-6" variant="contained" color="primary">
                                    Print
                                </Button>
                            )}
                            content={() => componentRef.current}
                        />
                    )}
                    <div className="w-full overflow-x-auto">
                        <div ref={componentRef} className={`py-1 px-2 rounded sm:mx-auto mt-6 relative w-[1400px] sm:overflow-x-hidden ${mode === "print" ? "print-mode" : ""}`}>
                            {(mode === "view" ? filteredData.slice(currentPage * studentsPerPage, (currentPage + 1) * studentsPerPage) : filteredData).map((student, index) => (
                                <div key={index} className="print-page-break">
                                    {student.personalDetails && (
                                        <div className="mx-8 my-2 font-bold print-new-page">
                                            <h4>ABC ID: {student.personalDetails.abc_id}</h4>
                                        </div>
                                    )}
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
                                        <div className="text-xl font-extrabold font-serif p-1">PROVISIONAL GRADESHEET OF EOSE OF {academicYears}</div>
                                        <div className="text-xl font-extrabold font-serif p-1 mb-4">
                                            {student.personalDetails.program} (Batch - {student.personalDetails.year_of_admission})
                                        </div>
                                    </div>
                                    <div className="border border-solid py-16">
                                    <div className="text-center flex flex-col my-2 mr-5 px-14 sm:">
                                        {renderParentInfo(student)}
                                    </div>

                                    <table className="w-11/12 mx-auto leading-normal my-2 font-bold tracking-wider font-roboto">
                                        <thead>
                                            <tr>
                                                <th className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider" style={{ width: "6%" }}>
                                                    S.No
                                                </th>
                                                <th className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider" style={{ width: "16%" }}>
                                                    Course Code
                                                </th>
                                                <th className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider" style={{ width: "38%" }}>
                                                    Course Name
                                                </th>
                                                <th className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider" style={{ width: "8%" }}>
                                                    Credits
                                                </th>
                                                <th className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider" style={{ width: "12%" }}>
                                                    Credits Earned (C<sub>i</sub>)
                                                </th>
                                                {/* <th className="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style={{ width: "9%" }}>
                                                    Letter Grade Continuous Evaluation (CA)
                                                </th>
                                                <th className="px-2 py-3 border border-black text-left text-xs font-bold uppercase tracking-wider" style={{ width: "10%" }}>
                                                    Letter Grade End of Semester Evaluation (EOSE)
                                                </th> */}
                                                <th className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider" style={{ width: "10%" }}>
                                                    Grade
                                                </th>
                                                <th className="px-2 py-3 border border-black text-center text-sm font-bold tracking-wider" style={{ width: "10%" }}>
                                                    Grade Point (P<sub>i</sub>)
                                                </th>
                                            </tr>
                                        </thead>
                                        {renderTableRows(student)}
                                    </table>

                                    <table className="w-11/12 mx-auto leading-normal mt-5 font-bold uppercase tracking-wider font-roboto sm:overflow-x-hidden">
                                        <thead className="border border-black">
                                            <tr className="border border-black">
                                                <th rowSpan={2} className="px-6 py-3 text-center text-xs font-bold border border-black uppercase tracking-wider">
                                                    Credits Earned in this semester
                                                </th>
                                                <th rowSpan={2} className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider">
                                                    Total Credits earned as on date
                                                </th>
                                                <th colSpan={2} className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider">
                                                    SGPA
                                                </th>
                                                <th colSpan={2} className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider">
                                                    CGPA
                                                </th>
                                                <th rowSpan={2} className="px-6 py-3 text-center text-sm font-bold border border-black  tracking-wider">
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
                                                    {student.markSheet.Credits_earned}
                                                </td>
                                                <td className="px-6 py-4 text-center border border-black whitespace-nowrap">-</td>
                                                <td className="px-6 py-4 text-center border border-black whitespace-nowrap">
                                                    {student.markSheet.sgpa_result.toPrecision(3)}
                                                </td>
                                                <td className="px-6 py-4 text-center border border-black whitespace-nowrap">
                                                    {student.markSheet.sgpa_grade}
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
                            //     <div className="print-only overflow-y-auto h-auto break-before-page break-after-avoid">
                            //     <Image
                            //       src={result_info_updated}
                            //       alt="Grade Scheme used for calculating result."
                            //       layout="responsive"
                            //       objectFit="contain"
                            //     />
                            //   </div>
                            ))}
                        </div>

                        {mode === "view" && filteredData.length > studentsPerPage && (
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 mx-2 bg-gray-300 rounded"
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages - 1}
                                    className="px-4 py-2 mx-2 bg-gray-300 rounded"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                        
                    </div>
                    
                </>

        )}
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
</div>
</>
);
}    