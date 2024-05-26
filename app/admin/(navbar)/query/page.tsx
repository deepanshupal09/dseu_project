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
import { useData } from "@/contexts/DataContext";

interface ProgramList {
  [key: string]: string[];
}

export interface Course {
  course_name: string;
  course_code: string;
  course_type: string;
  credit: number;
  semester: number;
}

export interface Student {
  name: string;
  rollno: string;
  program: string;
  semester: number;
}

export interface User {
  emailid: string;
  role: string;
  campus: string;
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

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [courseList, setCourseList] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<Course[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [selectedProgramCategory, setSelectedProgramCategory] =
    useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const { data } = useData();

  useEffect(() => {
    if (user && selectedProgram !== "" && selectedSemester !== "") {
      fetchCoursesBySemester(
        token,
        selectedCampus,
        selectedProgram,
        selectedSemester
      )
        .then((response: Course[]) => {
          const temp: string[] = [];
          setCourseCodes(response);
          response.map((e) => temp.push(e.course_name));
          setCourseList(temp);
        })
        .catch((error) => {});
    }
  }, [selectedProgram, selectedSemester]);

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

  const [columns, setColumns] = useState<GridColDef[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth =
        document.getElementById("datagrid-container")?.offsetWidth || 0;
      const numberOfColumns = 5;

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

  useEffect(() => {
    if (selectedCourse) {
      handleApplyFilters();
    } else {
      setStudentList([]);
    }
  }, [selectedCourse]);

  const handleApplyFilters = async () => {
    if (selectedCourse !== "") {
      const course_code = courseCodes.find(
        (course) => course.course_name === selectedCourse
      )?.course_code;
      if (course_code) {
        try {
          const res = await fetchExamRegistrationByCourseCode(
            token,
            selectedCampus,
            course_code
          );
          const formattedStudentList = res.map(
            (student: Student, index: number) => ({ ...student, id: index + 1 })
          );
          setStudentList(formattedStudentList);
        } catch (error) {}
      }
    }
  };

  const handleChangeSelectedCampus = (event: SelectChangeEvent) => {
    setSelectedCampus(event.target.value);
    setSelectedProgramCategory("");
    setSelectedProgram("");
    setSelectedSemester("");
    // setSelectedProgramCategory("");
  };
  const handleChangeProgramCategory = (event: SelectChangeEvent) => {
    setSelectedProgramCategory(event.target.value);
    setSelectedProgram("");
    setSelectedSemester("");
  };

  const handleChangeProgram = (event: SelectChangeEvent) => {
    setSelectedProgram(event.target.value);
    setSelectedSemester("");
  };

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
  };
  const handleChangeCourse = (event: SelectChangeEvent) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <>
      <div className="bg-[#dfdede] mt-2"></div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[130px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        <h1 className="text-2xl text-white font-bold text-center">Queries</h1>
      </div>
      <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">
          SELECT
        </h2>
        {data && (
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
                  value={selectedCampus || ""}
                  label="Program category"
                  onChange={handleChangeSelectedCampus}
                >
                  {Object.keys(data)?.map((campus, index) => (
                    <MenuItem key={index} value={campus}>
                      {campus}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="program-category-label">
                Program category
              </InputLabel>
              <Select
                labelId="program-category-label"
                id="program-category"
                value={selectedProgramCategory || ""}
                label="Program category"
                onChange={handleChangeProgramCategory}
              >
                {selectedCampus &&
                  selectedCampus !== "" &&
                  Object.keys(data[selectedCampus])?.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="select-program-label">Select Program</InputLabel>
              <Select
                labelId="select-program-label"
                id="select-program"
                value={selectedProgram || ""}
                label="Select Program"
                onChange={handleChangeProgram}
              >
                {selectedCampus &&
                  selectedProgramCategory &&
                  selectedCampus !== "" &&
                  selectedProgramCategory !== "" &&
                  Object.keys(
                    data[selectedCampus][selectedProgramCategory]
                  )?.map((program, index) => (
                    <MenuItem key={index} value={program}>
                      {program}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                id="semester"
                value={selectedSemester || ""}
                label="Semester"
                onChange={handleChangeSemester}
              >
                {" "}
                {selectedCampus &&
                  selectedProgramCategory &&
                  selectedProgram &&
                  selectedCampus !== "" &&
                  selectedProgramCategory !== "" &&
                  selectedProgram !== "" &&
                  data[selectedCampus][selectedProgramCategory][
                    selectedProgram
                  ]?.map((semester, index) => (
                    <MenuItem key={index} value={semester}>
                      {semester}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              className="w-full md:w-1/3 sm:w-auto mt-5"
            >
              <InputLabel id="course-label">Course</InputLabel>
              <Select
                labelId="course-label"
                id="course"
                value={selectedCourse}
                label="Course"
                onChange={handleChangeCourse}
              >
                {selectedCampus !== "" &&
                  selectedProgramCategory !== "" &&
                  selectedProgram !== "" &&
                  selectedSemester !== "" &&
                  courseList.map((course, index) => (
                    <MenuItem key={index} value={course}>
                      {course}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        )}
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
            checkboxSelection
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
