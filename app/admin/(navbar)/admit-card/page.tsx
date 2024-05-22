"use client";
import React, { useEffect, useState } from "react";
import Head from "../dashboard/Head";
import Nav from "../dashboard/Nav";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button, { ButtonProps } from "@mui/material/Button";
import {
  fetchCourseDetailsByCourseCode,
  fetchCoursesBySemester,
  fetchExamRegistrationByCourseCode,
  fetchExamRegistrationByProgramAndSemester,
} from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import AdmitCard from "./AdmitCard";
import Image from "next/image";

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

  const [selectedProgramCategory, setSelectedProgramCategory] =
    useState<string>("Undergraduate");
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

  const campusList = [
    "Arybhatt DSEU Ashok Vihar Campus",
    "Ambedkar DSEU Shakarpur Campus-I",
    "DSEU Okhla II Campus",
    "G.B. Pant DSEU Okhla I Campus",
    "Guru Nanak Dev DSEU Rohini Campus",
    "DSEU Dwarka Campus",
    "Kasturba DSEU Pitampura Campus",
    "Meerabai DSEU Maharani Bagh Campus",
    "DSEU Pusa Campus - I",
    "DSEU Rajokri Campus",
    "DSEU Sirifort Campus",
    "DSEU Wazirpur-I Campus",
    "Dr.H.J. Bhabha DSEU Mayur Vihar Campus",
    "DSEU Ranhola Campus",
    "G.B. Pant DSEU Okhla III Campus",
    "DSEU Jaffarpur Campus",
    "Bhai Parmanand DSEU Shakarpur II Campus",
    "DSEU Pusa II Campus",
    "DSEU Champs okhla II Campus",
    "Sir C.V. Raman DSEU Dheerpur Campus",
    "DSEU Vivek vihar Campus",
  ];
  const programListByType: ProgramList = {
    Diploma: [
      "Diploma in Applied Arts",
      "Diploma in Architecture",
      "Diploma in Automobile Engineering",
      "Diploma in Chemical Engineering",
      "Diploma in Civil Engineering",
      "Diploma in Computer Engineering",
      "Diploma in Cosmetology & Health",
      "Diploma in Electrical Engineering",
      "Diploma in Electronic Engineering",
      "Diploma in Fashion Design",
      "Diploma in Fashion Design and Garment Technology",
      "Diploma in Interior Design",
      "Diploma in Mechanical Engineering",
      "Diploma in Pharamacy",
      "Diploma in Printing Technology",
      "Diploma in Tool and Die Making",
      "Diploma in Artificial Intelligence and Machine Learning",
      "Diploma in Robotic and Process Automation",
      "Diploma in Electical Engineering - Part Time",
      "Diploma in Mechanical Engineering - Part Time",
      "Diploma in Automobile Engineering - Part Time",
      "Diploma in Civil Engineering - Part Time",
    ],
    Undergraduate: [
      "Bachelor of Arts (Aesthetics & Beauty Therapy)",
      "Bachelor of Science (Aesthetics & Beauty Therapy)",
      "Bachelor of Computer Applications",
      "Bachelor of Business Administration (Banking, Financial Services and Insurance)",
      "Bachelor of Commerce (Business Process Management)",
      "Bachelor of Business Administration (Operation and Business Process Management)",
      "Bachelor of Science (Data Analytics)",
      "Bachelor of Arts (Digital Media and Design)",
      "Bachelor of Management Studies (E-Commerce Operations)",
      "Bachelor of Business Administration (Facilities and Hygiene Management)",
      "Bachelor of Management Studies (Land Transportation)",
      "Bachelor of Science (Medical Laboratory Technology)",
      "Bachelor of Business Administration (Retail Management)",
      "Bachelor of Arts (Spanish)",
      "Bachelor of Business Administration (Automotive Retail Management)",
      "Bachelor of Business Administration (Hospital Management)",
      "Bachelor of Business Administration (Innovation and Entrepreneurship)",
      "Bachelor of Optometry",
      "Bachelor in Library Sciences",
      "Bachelor of Science (Dialysis Technology)",
      "Bachelor of Science (Emergency Medical Technology)",
      "Bachelor of Technology (Mechanical and Automation Engineering)",
      "Bachelor of Technology (Electronics and Communication Engineering)",
      "Bachelor of Technology (Computer Science Engineering)",
      "Bachelor of Technology (Mechanical Engineering)",
      "Bachelor of Technology (Tool Engineering)",
      "Bachelor of Technology (Mechatronics Engineering)",
    ],
    PostGraduate: [
      "Master of Computer Applications",
      "Master of Technology (Mechanical Engineering)",
      "Master of Technology (Tool Engineering)",
      "Master of Technology (Computer Science Engineering with Specialization in Al & ML)",
      "Master of Technology (Electronic & Communication Engineering With Specialization in IOT)",
      "Master of Technology (Mechanical Engineering with Specialization in Thermal/Production/Design)",
      "Master of Science (Medical Laboratory Sciences)",
    ],
    Doctorate: [
      "Doctor of Philosophy (Computer Science and Engineering)",
      "Doctor of Philosophy (Computer Application)",
      "Doctor of Philosophy (Mechanical Engineering/Allied Branches)",
      "Doctor of Philosophy (Electronics and Communication Engineering/Allied Branches)",
    ],
    Certificate: [
      "Certificate Course in Modern Office Management & Secretarial Practice",
    ],
  };

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

  const programCategories = [
    "Undergraduate",
    "PostGraduate",
    "Diploma",
    "Doctorate",
    "Certificate",
  ];
  const semesters = ["2", "4", "6"];
  function mapCourseCodesToPapers(
    courseCodes: string[],
    courseData: Course[]
  ): Paper[] {
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
              exam_type:
                course.semester < parseInt(selectedSemester)
                  ? "Reappear"
                  : "Regular",
              ...course,
            });
          });
          console.log("data: ", courseData);
          console.log("student data: ", studentList);

          const users: StudentData[] = studentList.map((student) => ({
            campus: selectedCampus, // Update with your campus name or fetch from student data if available
            programName: student.program,
            name: student.name,
            rollno: student.rollno,
            dob: student.dob,
            papers: mapCourseCodesToPapers(student.course_codes, courseData),
            photo: "https://exam.dseu.ac.in" + student.photo + "?" + Date.now(),
          }));

          console.log("users: ", users);
          setAdmitCardData(users);
        })
        .catch((error) => {
          console.log("error fetching course details: ", error);
        });
    }
  }, [courseCodes]);

  useEffect(()=>{
    setAdmitCardData([]);
  },[selectedCampus, selectedProgramCategory, selectedProgram, selectedSemester])
  

  const handleApplyFilters = async () => {
    setAdmitCardData([]);
    fetchExamRegistrationByProgramAndSemester(
      token,
      selectedCampus,
      selectedProgramCategory,
      selectedProgram,
      selectedSemester
    )
      .then((res) => {
        console.log("response: ", res);
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
        console.log("array: ", array);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const handleChangeSelectedCampus = (event: SelectChangeEvent) => {
    setSelectedCampus(event.target.value);
    setSelectedProgram("");
    // setSelectedProgramCategory("");
  };
  const handleChangeProgramCategory = (event: SelectChangeEvent) => {
    setSelectedProgramCategory(event.target.value);
    setSelectedProgram("");
  };

  const handleChangeProgram = (event: SelectChangeEvent) => {
    setSelectedProgram(event.target.value);
  };

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
  };

  return (
    <>
      <div className="bg-[#dfdede] mt-2">
      </div>
      <div className="announcement  mx-2 bg-dseublue py-2 px-4 rounded shadow absolute top-[130px] sm:left-[250px] left-0 right-0 sm:mx-12 mt-6">
        <h1 className="text-2xl text-white font-bold text-center">
          Admit Card
        </h1>
      </div>
      <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0 mx-2 sm:mx-12 mt-6">
        <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">
          SELECT
        </h2>
        <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
          {user?.role === "super" && (
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="program-category-label">Campus</InputLabel>
              <Select
                labelId="program-category-label"
                id="program-category"
                value={selectedCampus}
                label="Program category"
                onChange={handleChangeSelectedCampus}
              >
                {campusList.map((campus, index) => (
                  <MenuItem key={index} value={campus}>
                    {campus}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
            <InputLabel id="program-category-label">
              Program category
            </InputLabel>
            <Select
              labelId="program-category-label"
              id="program-category"
              value={selectedProgramCategory}
              label="Program category"
              onChange={handleChangeProgramCategory}
            >
              {programCategories.map((category, index) => (
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
              {programListByType[selectedProgramCategory].map(
                (program, index) => (
                  <MenuItem key={index} value={program}>
                    {program}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
            <InputLabel id="semester-label">Semester</InputLabel>
            <Select
              labelId="semester-label"
              id="semester"
              value={selectedSemester}
              label="Semester"
              onChange={handleChangeSemester}
            >
              {semesters.map((semester, index) => (
                <MenuItem key={index} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <Button
            onClick={handleApplyFilters}
            variant="contained"
            className="my-5"
          >
            Apply
          </Button>
          {admitCardData.length > 0 && (
            <div className=" flex justify-center mx-auto my-5">
                <AdmitCard admitCardData={admitCardData} />
            </div>
          )}
        </div>
      </div>
      <div className="">
        {/* <img src="https://exam.dseu.ac.in/image/41521070_photo.jpg" /> */}
      </div>
    </>
  );
}
