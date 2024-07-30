"use client";
import React, { useState, useEffect, useRef, use } from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Select, MenuItem, FormControl, InputLabel, Button, TextField } from "@mui/material";

import ReactToPrint from "react-to-print";
import logo from "@/app/images/dseu.png";
import result_info_updated from "@/app/images/result_info_updated.png";
import Image from "next/image";
import { SelectChangeEvent } from "@mui/material/Select";
import { getAuth, getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { StudentDetails } from "@/app/(navbar)/profile/page";
import { fetchMarksController, fetchUserByRollno, getUserByRollNo } from "@/app/actions/api";
import { useDebounce } from "use-debounce";

interface InternalMark {
  course_code: string;
  course_name: string;
  credit: number;
  marks: string;
  grade: string;
}

interface ExternalMark {
  course_code: string;
  course_name: string;
  credit: number;
  marks: string;
  grade: string;
}

interface AggregateMark {
  course_code: string;
  course_name: string;
  credit: number;
  marks: string;
  grade: string;
  grade_point: string;
  credit_earned: number;
}

interface BridgeMark {
  course_code: string;
  course_name: string;
  credit: number;
  marks: string;
  grade: string;
  grade_point: string;
}

interface StudentData {
  rollno: string;
  academic_year: string;
  campus: string;
  program_type: string;
  program: string;
  semester: number;
  internal_marks: InternalMark[];
  external_marks: ExternalMark[];
  aggregate_marks: AggregateMark[];
  bridge_marks: BridgeMark[];
  sgpa_result: number;
  Credits_earned: string;
  sgpa_grade: string;
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

  useEffect(() => {
    getAuthAdmin().then((auth) => {
      if (auth) {
        setToken(auth.value);
        const temp = parseJwt(auth?.value as string);
        // getUserByRollNo(rollno, auth.value)
        //   .then((res) => {
        //     setUser(res[0]);
        //     setSemester(res[0].semester.toString());
        //   })
        //   .catch((error: any) => {});
      }
    });
  }, []);

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

  const handleSubmit = () => {
    //   console.log("here ", academicYear, semester, )
    if (academicYear && semester && rollno !== "") {
      fetchMarksController(academicYear, semester, rollno, token)
        .then((res: StudentData | { message: string } | boolean) => {
          // console.log("res ", res);
          if (typeof res === "boolean") {
            setIsMarksEvaluated(res);
            setStudentData(null);
          } else if ("message" in res) {
            if (
              res.message === "Marks not evaluated yet." ||
              res.message === "No data found for the given roll number and academic year"
            ) {
              setIsMarksEvaluated(false);
              setStudentData(null);
            }
          } else {
            setStudentData(res);
            setIsMarksEvaluated(true);
          }

          setIsSubmitted(true);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  };

  const renderTableRows = () => {
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
  const renderParentInfo = () => {
    if (student?.father && student?.mother) {
      return (
        <>
          <div className="flex font-roboto">
            <div className="w-8/12 text-left font-normal font-serif p-1">
              Name of the Student: <span className="font-semibold">{student?.name}</span>
            </div>
            <div className="w-4/12 text-left font-normal font-serif p-1">
              {"Father's name: "} <span className="font-semibold">{student?.father}</span>
            </div>
          </div>
          <div className="flex">
            <div className="w-8/12 text-left font-normal p-1">
              Enrollment no: <span className="font-semibold font-roboto">{student?.rollno}</span>
            </div>
            <div className="w-4/12 text-left font-normal font-serif p-1">
              {"Mother's name: "} <span className="font-semibold">{student?.mother}</span>
            </div>
          </div>
        </>
      );
    } else if (student?.father) {
      return (
        <>
          <div className="flex font-roboto">
            <div className="w-8/12 text-left font-normal font-serif p-1">
              Name of the Student: <span className="font-semibold">{student?.name}</span>
            </div>
            <div className="w-4/12 text-left font-normal font-serif p-1">
              {"Father's name: "} <span className="font-semibold">{student?.father}</span>
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
              Name of the Student: <span className="font-semibold">{student?.name}</span>
            </div>
            <div className="w-4/12 text-left font-normal font-serif p-1">
              {"Mother's name: "} <span className="font-semibold">{student?.mother}</span>
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
              Name of the Student: <span className="font-semibold">{student?.name}</span>
            </div>
            <div className="w-4/12 text-left font-normal font-serif p-1">
              {"Guardian's name"}: <span className="font-semibold">{student?.guardian}</span>
            </div>
          </div>
          <div className="flex">
            <div className="w-8/12 text-left font-normal p-1">
              Enrollment no: <span className="font-semibold font-roboto">{student?.rollno}</span>
            </div>
            {/* <div className="w-4/12 text-left font-normal font-serif p-1">
              Relation: <span className="font-semibold">Guardian</span>
            </div> */}
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
          <h1 className="text-2xl text-white font-bold text-center">Student Result</h1>
        </div>
        <div className="py-2 px-2 rounded shadow max-sm:w-full mt-5 sm:mx-8">
          <div className="flex mb-2 space-x-3">
            <FormControl fullWidth variant="outlined" className="my-2">
              {/* <InputLabel id="academic-year-label">Roll No</InputLabel> */}
              <TextField
                id="academic-year"
                value={rollno}
                onChange={(e) => {
                  setRollno(e.target.value);
                }}
                label="Roll No"
              />
            </FormControl>
            <FormControl fullWidth variant="outlined" className="my-2">
              <InputLabel id="academic-year-label">Academic Year</InputLabel>
              <Select
                labelId="academic-year-label"
                id="academic-year"
                value={academicYear}
                onChange={handleAcademicYearChange}
                label="Academic Year"
                IconComponent={ArrowDropDownIcon}
              >
                {academicYears.map((year, index) => (
                  <MenuItem key={index} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" className="my-2">
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                id="semester"
                value={semester}
                onChange={handleSemesterChange}
                label="Semester"
                IconComponent={ArrowDropDownIcon}
                // disabled
              >
                <MenuItem value={semester}>{semester}</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!academicYear}>
              Submit
            </Button>
          </div>
        </div>

        {isSubmitted && !isMarksEvaluated ? (
          <div className="text-center my-20 font-semibold text-2xl">
            <p>Result is under process...</p>
          </div>
        ) : (
          isSubmitted &&
          studentData && (
            <div>
              <ReactToPrint
                trigger={() => (
                  <Button className="mx-12 mt-6" variant="contained" color="primary">
                    Print
                  </Button>
                )}
                content={() => componentRef.current}
              />
              <div className="w-full overflow-x-auto">
                <div ref={componentRef} className="py-1 px-2 rounded sm:mx-auto mt-6 relative w-[1400px] sm:overflow-x-hidden">
                  {student && student?.abc_id && (
                    <div className="mx-8 my-2 font-bold">
                      <h4>ABC ID: {student?.abc_id}</h4>
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
                    <div className="text-xl font-serif p-1">
                      Grade sheet of EoSE of <span className="font-bold font-sans">June-2024</span>
                    </div>
                    <div className="text-lg font-bold font-serif mb-4">
                      {student && student?.program}-Batch <span className="font-sans">{student?.year_of_admission}</span>
                    </div>
                  </div>
                  <div className="border border-solid py-16">
                    <div className="text-center flex flex-col my-2 mr-5 px-14 sm:">{renderParentInfo()}</div>

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
                      <tbody className="font-semibold">{renderTableRows()}</tbody>
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
                              {studentData.Credits_earned}
                            </td>
                            <td className="px-6 py-4 text-center border border-black whitespace-nowrap">-</td>
                            <td className="px-6 py-4 text-center border border-black whitespace-nowrap">
                              {studentData.sgpa_result.toPrecision(3)}
                            </td>
                            <td className="px-6 py-4 text-center border border-black whitespace-nowrap">
                              {studentData.sgpa_grade}
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

                  <div className="print-only overflow-y-auto h-auto break-before-page break-after-avoid">
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
                }
              `}</style>
            </div>
          )
        )}
      </div>
    </>
  );
}
