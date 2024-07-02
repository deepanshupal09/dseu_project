"use client";
import React, { use, useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { fetchCoursesBySemester, fetchMarksDetailsController } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { TransformedType, useData } from "@/contexts/DataContext";
import { Box, ButtonProps, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
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

type DetailsType = {
  id: number;
  campus: string;
  program: string;
  program_type: string;
  course_coude: string;
  course_name: string;
  semester: string;
  internal: boolean;
  external: boolean;
  aggregate: boolean;
};

export default function Marks() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [courseList, setCourseList] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<Course[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [selectedProgramCategory, setSelectedProgramCategory] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
  const [detailsList, setDetailsList] = useState<DetailsType[]>([]);
  const [rows, setRows] = useState<DetailsType[]>([]);

  //   const [data, setData] = useState<TransformedType>();
  const [value, setValue] = React.useState(0);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const academicYear: string[] = ["2023-2024"];

  const { data } = useData() || [];

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

  const [columns, setColumns] = useState<GridColDef[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = document.getElementById("datagrid-container")?.offsetWidth || 0;
      const numberOfColumns = 10;

      const columnWidth = (containerWidth - 10) / numberOfColumns;

      const newColumns: GridColDef[] = [
        { field: "id", headerName: "S.No", width: columnWidth },
        { field: "campus", headerName: "Campus", width: columnWidth },
        { field: "program", headerName: "Program", width: columnWidth },
        { field: "program_type", headerName: "Program Type", width: columnWidth },
        { field: "semester", headerName: "Semester", width: columnWidth },
        { field: "internal", headerName: "Internal Marks Freeze", width: columnWidth },
        { field: "external", headerName: "External Marks Freeze", width: columnWidth },
        { field: "aggregate", headerName: "Aggregate Marks Freeze", width: columnWidth },
        { field: "course_code", headerName: "Course Code", width: columnWidth },
        { field: "course_name", headerName: "Course Name", width: columnWidth },
      ];

      setColumns(newColumns);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (token) {
      console.log("here");
      setLoading(true);
      fetchMarksDetailsController(token)
        .then((response) => {
          console.log("response: ", response);
          let temp: DetailsType[] = [];
          response.map((element: any, index: number) => {
            temp.push({ id: index + 1, ...element });
          });
          console.log("converted: ", temp);
          setDetailsList(temp);
          setLoading(false);
          setRows(temp);
        })
        .catch((error) => {
          console.log("error fetching details: ", error);
        });
    }
  }, [token]);

  useEffect(() => {
    if (user && selectedProgram !== "" && selectedSemester !== "") {
      fetchCoursesBySemester(token, selectedCampus, selectedProgram, selectedSemester, selectedProgramCategory)
        .then((response: Course[]) => {
          const temp: string[] = [];
          setCourseCodes(response);
          response.map((e) => temp.push(e.course_name));
          setCourseList(temp);
        })
        .catch((error) => {});
    }
  }, [selectedProgram, selectedSemester, selectedProgramCategory, selectedCampus]);

  useEffect(() => {
    setSelectedProgramCategory("");
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedCourse("");
    setSelectedAcademicYear("");
  }, [selectedCampus]);
  useEffect(() => {
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedCourse("");
    setSelectedAcademicYear("");
  }, [selectedProgramCategory]);
  useEffect(() => {
    setSelectedSemester("");
    setSelectedCourse("");
    setSelectedAcademicYear("");
  }, [selectedProgram]);
  useEffect(() => {
    setSelectedCourse("");
    setSelectedAcademicYear("");
  }, [selectedSemester]);

  useEffect(() => {
    setSelectedAcademicYear("");
  }, [selectedCourse]);

  useEffect(() => {
    getAuthAdmin().then(async (t: any) => {
      if (t) {
        setToken(t.value);
        const data = await parseJwt(t.value);
        setUser(data.user);
        if (data.user.role === "admin" || data.user.role === "dep") {
          setSelectedCampus(data.user.campus);
        }
      }
    });
  }, []);

  const handleChangeSelectedCampus = (event: SelectChangeEvent) => {
    setSelectedCampus(event.target.value);
    setSelectedProgramCategory("");
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedAcademicYear("");
    setValue(0);
  };

  const handleChangeProgramCategory = (event: SelectChangeEvent) => {
    setSelectedProgramCategory(event.target.value);
    setSelectedProgram("");
    setSelectedSemester("");
    setSelectedAcademicYear("");
    setValue(0);
  };

  const handleChangeProgram = (event: SelectChangeEvent) => {
    setSelectedProgram(event.target.value);
    setSelectedSemester("");
    setSelectedAcademicYear("");
    setValue(0);
  };

  const handleChangeSemester = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
    setSelectedAcademicYear("");
    setValue(0);
  };

  const handleChangeCourse = (event: SelectChangeEvent) => {
    setSelectedCourse(event.target.value);
    setSelectedAcademicYear("");
    setValue(0);
  };

  const handleChangeAcademicYear = (event: SelectChangeEvent) => {
    setSelectedAcademicYear(event.target.value);
    setValue(0);
  };

  useEffect(() => {
    if (selectedCourse) {
      console.log(detailsList[0].semester, " ", selectedSemester)
      console.log(detailsList.filter(e => e.campus === selectedCampus &&  e.program_type === selectedProgramCategory && e.program === selectedProgram && e.semester.toString() === selectedSemester ))
      setRows(
        detailsList.filter(
          (detail) =>
            detail.campus === selectedCampus &&
            detail.program_type === selectedProgramCategory &&
            detail.program === selectedProgram &&
            detail.semester.toString() === selectedSemester &&
            detail.course_name === selectedCourse
        )
      );
    }
  }, [selectedCampus, selectedProgramCategory, selectedProgram, selectedSemester, selectedCourse]);

  return (
    <>
      <div className="bg-[#dfdede] mt-2"></div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[130px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        <h1 className="text-2xl text-white font-bold text-center">Marks Status </h1>
      </div>
      <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        {/* <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">SELECT</h2>
        {data && (
          <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
            {user?.role === "super" && (
              <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                <InputLabel id="program-category-label">Campus</InputLabel>
                <Select
                  labelId="program-category-label"
                  id="program-category"
                  value={selectedCampus || ""}
                  label="Program category"
                  onChange={handleChangeSelectedCampus}
                >
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
              <Select
                labelId="program-category-label"
                id="program-category"
                value={selectedProgramCategory || ""}
                label="Program category"
                onChange={handleChangeProgramCategory}
              >
                {selectedCampus &&
                  selectedCampus !== "" &&
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
                value={selectedProgram || ""}
                label="Select Program"
                onChange={handleChangeProgram}
              >
                {selectedCampus &&
                  selectedProgramCategory &&
                  selectedCampus !== "" &&
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
              <InputLabel id="course-label">Course</InputLabel>
              <Select labelId="course-label" id="course" value={selectedCourse} label="Course" onChange={handleChangeCourse}>
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
        )} */}
        {/* <div></div> */}
        <div className="my-10 w-full h-screen " id="datagrid-container" >
          <DataGrid slots={{ toolbar: CustomToolbar }} rows={rows} columns={columns} loading={loading} />
        </div>
      </div>

      <Snackbar
        open={alert}
        autoHideDuration={6000}
        onClose={() => {
          setAlert(false);
        }}
        message={message}
      />
    </>
  );
}
