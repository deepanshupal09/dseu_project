"use client";
import React, { use, useEffect, useRef, useState } from "react";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import { fetchAllMarks, fetchAllMarksControl, fetchCoursesBySemester, fetchMarksDetailsController, sendEmails } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { TransformedType, useData } from "@/contexts/DataContext";
import { Box, Button, ButtonProps, Snackbar } from "@mui/material";
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
        { field: "rollno", headerName: "Roll No", width: columnWidth },
        { field: "course_code", headerName: "Course Code", width: columnWidth },
        { field: "campus", headerName: "Campus", width: columnWidth },
        { field: "program", headerName: "Program", width: columnWidth },
        { field: "program_type", headerName: "Program Type", width: columnWidth },
        { field: "semester", headerName: "Semester", width: columnWidth },
        { field: "name", headerName: "Student Name", width: columnWidth },
        { field: "father", headerName: "Father's name", width: columnWidth },
        { field: "mother", headerName: "Mother's name", width: columnWidth },
        { field: "guardian", headerName: "Guardian's name", width: columnWidth },
        { field: "abc_id", headerName: "ABC_id", width: columnWidth },
        { field: "aadhar", headerName: "Aadhar number", width: columnWidth },
        { field: "year_of_admission", headerName: "Year of Admission", width: columnWidth },
        { field: "academic_year", headerName: "Academic Year", width: columnWidth },
        { field: "aggregate_marks", headerName: "aggregate marks", width: columnWidth },
        { field: "continuous_evaluation", headerName: "continuous evaluation", width: columnWidth },
        { field: "endSem_evaluation", headerName: "end of Semester evaluation", width: columnWidth },
        { field: "bridge", headerName: "bridge evaluation", width: columnWidth }
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
      fetchAllMarks(token,'2023-2024')
        .then((response:any) => {
          console.log("response: ", response);
          let temp: any[] = [];
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

  


   return (
    <>
      <div className="bg-[#dfdede] mt-2"></div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[130px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        <h1 className="text-2xl text-white font-bold text-center">Marks Status </h1>
      </div>
      <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">

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
