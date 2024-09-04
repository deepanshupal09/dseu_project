"use client";
import React, { use, useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { fetchAllStudentDetails, fetchCoursesBySemester, fetchMarksDetailsController, sendEmails } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { TransformedType, useData } from "@/contexts/DataContext";
import {
  Backdrop,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
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
  aadhar: string | null;
  abc_id: string | null;
  alternate_phone: string | null;
  campus: string | null;
  dob: string | null;
  emailid: string | null;
  father: string | null;
  gender: string | null;
  guardian: string | null;
  mother: string | null;
  name: string;
  password: string;
  phone: string | null;
  program: string | null;
  program_type: string | null;
  rollno: string;
  semester: string | null;
  year_of_admission: string | null;
  is_lateral: string | null;
};

export default function Marks() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [detailsList, setDetailsList] = useState<DetailsType[]>([]);
  const [rows, setRows] = useState<DetailsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");


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
        { field: "rollno", headerName: "Roll Number", width: columnWidth },
        { field: "name", headerName: "Name", width: columnWidth },
        { field: "campus", headerName: "Campus", width: columnWidth },
        { field: "program", headerName: "Program", width: columnWidth },
        { field: "program_type", headerName: "Program Type", width: columnWidth },
        { field: "semester", headerName: "Semester", width: columnWidth },
        { field: "gender", headerName: "Gender", width: columnWidth },
        { field: "dob", headerName: "Date of Birth", width: columnWidth },
        { field: "phone", headerName: "Phone", width: columnWidth },
        { field: "emailid", headerName: "Email ID", width: columnWidth },
        { field: "father", headerName: "Father's Name", width: columnWidth },
        { field: "mother", headerName: "Mother's Name", width: columnWidth },
        { field: "guardian", headerName: "Guardian", width: columnWidth },
        { field: "aadhar", headerName: "Aadhar", width: columnWidth },
        { field: "abc_id", headerName: "ABC ID", width: columnWidth },
        { field: "alternate_phone", headerName: "Alternate Phone", width: columnWidth },
        { field: "year_of_admission", headerName: "Year of Admission", width: columnWidth },
        { field: "is_lateral", headerName: "Lateral Entry", width: columnWidth },
      ];      

      setColumns(newColumns);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (token) {
      // console.log("here");
      setLoading(true);
      fetchAllStudentDetails(token)
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
    getAuthAdmin().then(async (t: any) => {
      if (t) {
        setToken(t.value);
        const data = await parseJwt(t.value);
        setUser(data.user);
      }
    });
  }, []);




  return (
    <>
      <div className="bg-[#dfdede] mt-2"></div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[130px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        <h1 className="text-2xl text-white font-bold text-center">All Student Details </h1>
      </div>
      <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        <div className="my-10 w-full h-screen " id="datagrid-container">
          <DataGrid slots={{ toolbar: CustomToolbar }} checkboxSelection rows={rows} columns={columns} loading={loading} />
        </div>
      </div>


      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
