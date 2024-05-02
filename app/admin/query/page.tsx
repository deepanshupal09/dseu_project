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
  fetchCoursesBySemester,
  fetchExamRegistrationByCourseCode,
} from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import {
  DataGrid,
  GridColDef,
  GridCsvExportMenuItem,
  GridCsvExportOptions,
  GridToolbarContainer,
  GridToolbarContainerProps,
  GridToolbarExportContainer,
} from "@mui/x-data-grid";

interface ProgramList {
  [key: string]: string[];
}

interface Course {
  course_name: string;
  course_code: string;
}

interface Student {
  name: string;
  rollno: string;
  program: string;
  semester: number;
}

export default function Registration() {
  const [selected, setSelected] = useState(0);
  const options = ["Dashboard", "Registration Chart", "Admit Card", "Query"];

  const csvOptions: GridCsvExportOptions = { delimiter: "," };

  function CustomExportButton(props: ButtonProps) {
    return (
      <GridToolbarExportContainer {...props}>
        <GridCsvExportMenuItem options={csvOptions} />
      </GridToolbarExportContainer>
    );
  }

  function CustomToolbar(props: GridToolbarContainerProps) {
    return (
      <GridToolbarContainer {...props}>
        <CustomExportButton />
      </GridToolbarContainer>
    );
  }


  const [selectedProgramCategory, setSelectedProgramCategory] =
    useState<string>("Undergraduate");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [campus, setCampus] = useState<string>("");
  const [courseList, setCourseList] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<Course[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
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
      "Master of Technology (Computer Science Engineering - AI & ML)",
      "Master of Technology (Electronics & Communication Engineering - IOT)",
      "Master of Technology (Mechanical Engineering - Thermal/Production/Design)",
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
    if (selectedProgram !== "" && selectedSemester !== "") {
      fetchCoursesBySemester(token, campus, selectedProgram, selectedSemester)
        .then((response: Course[]) => {
          const temp: string[] = [];
          setCourseCodes(response);
          response.map((e) => temp.push(e.course_name));
          setCourseList(temp);
        })
        .catch((error) => {
          console.log("Error fetching courses: ", error);
        });
    }
  }, [selectedProgram, selectedSemester]);

  useEffect(() => {
    getAuthAdmin().then(async (t: any) => {
      console.log("t:", t);
      if (t) {
        setToken(t.value);
        const data = await parseJwt(t.value);
        console.log("data:", data);
        setCampus(data.user.campus);
        console.log(data.user.campus);
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

  const [columns, setColumns] = useState<GridColDef[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth =
        document.getElementById("datagrid-container")?.offsetWidth || 0;
      const numberOfColumns = 5; // Assuming 5 columns including S.No

      const columnWidth = (containerWidth - 10) / numberOfColumns;

      const newColumns: GridColDef[] = [
        { field: "id", headerName: "S.No", width: columnWidth },
        { field: "rollno", headerName: "Roll No", width: columnWidth },
        { field: "name", headerName: "Name", width: columnWidth },
        { field: "program", headerName: "Program", width: columnWidth },
        { field: "semester", headerName: "Semester", width: columnWidth },
      ];

      setColumns(newColumns);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleApplyFilters = async () => {
    if (selectedCourse !== "") {
      const course_code = courseCodes.find(
        (course) => course.course_name === selectedCourse
      )?.course_code;
      console.log("course_code: ", course_code);

      console.log("", selectedProgram, campus, selectedSemester);
      if (course_code) {
        // console.log("here")
        try {
          const res = await fetchExamRegistrationByCourseCode(
            token,
            course_code
          );
          // console.log("res: ", res)
          // setStudentList(res);
          const formattedStudentList = res.map(
            (student: Student, index: number) => ({ ...student, id: index + 1 })
          );
          setStudentList(formattedStudentList);
        } catch (error) {
          console.log("error fetching registration: ", error);
        }
      }
    }
  };

  const handleChangeProgramCategory = (event: SelectChangeEvent) => {
    setSelectedProgramCategory(event.target.value);
    setSelectedCourse("");
    setSelectedProgram("");
  };

  const handleChangeProgram = (event: SelectChangeEvent) => {
    setSelectedProgram(event.target.value);
    setSelectedCourse("");
  };

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
    setSelectedCourse("");
  };
  const handleChangeCourse = (event: SelectChangeEvent) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <>
      <div className="bg-[#dfdede] mt-2">
        <Head username={"Campus Director"} />
        <Nav />
      </div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[100px] sm:left-[250px] left-0 right-0 z-10 mx-12 mt-6">
        <h1 className="text-2xl text-white font-bold text-center">Queries</h1>
      </div>
      <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0 z-10 mx-12 mt-6">
        <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">
          SELECT
        </h2>
        <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
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
          <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
            <InputLabel id="course-label">Course</InputLabel>
            <Select
              labelId="course-label"
              id="course"
              value={selectedCourse}
              label="Course"
              onChange={handleChangeCourse}
            >
              {courseList.map((course, index) => (
                <MenuItem key={index} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyFilters}
          >
            Apply
          </Button>
        </div>
        <div></div>
        {/* Table */}

        <div
          className="my-10"
          id="datagrid-container"
          style={{ height: 670, width: "100%" }}
        >
          <DataGrid
            slots={{ toolbar: CustomToolbar }}
            rows={studentList}
            columns={columns}
            // pageSize={10}
            // checkboxSelection
            // disableSelectionOnClick
            // headerClassName="header-center-align"

            pagination
            autoPageSize
            // hideFooterPagination
            // hideFooter
          />
        </div>
      </div>
    </>
  );
}
