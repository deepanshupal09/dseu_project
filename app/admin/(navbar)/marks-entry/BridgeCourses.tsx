import { getUserByRollNo } from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";
import { useData } from "@/contexts/DataContext";
import { Add, Delete, DeleteForever } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Button, Fab } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

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

interface User {
  emailid: string;
  role: string;
  campus: string;
}

interface Row {
  rollno: string;
  name: string;
  course: string;
  academicYear: string;
  marks: string;
}

function BridgeCoursesTable({ academicYear, campus, course }: { academicYear: string; campus: string; course: string }) {
  const [rows, setRows] = useState<Row[]>([{ rollno: "", name: "", course: "", academicYear: "", marks: "" }]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
  const academic_year = ["2023-2024"];
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const course_code: { [key: string]: string } = {
    "Applied Mathematics-II": "FC-012",
    "Basic Sciences (Applied Chemistry)": "FC-1-CH051",
    "Basic Sciences (Applied Physics)": "FC-1-PH051",
  };

  useEffect(() => {
    getAuthAdmin().then(async (t: any) => {
      if (t) {
        setToken(t.value);
        const data = await parseJwt(t.value);
        setUser(data.user);
      }
    });
  }, []);

  const handleChangeRow = (index: number, field: keyof Row, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { rollno: "", name: "", course: "", academicYear: "", marks: "" }]);
  };

  const deleteRow = (index: number) => {
    const newRows = rows.filter((_, idx) => idx !== index);
    setRows(newRows);
  };

  const handleSubmit = () => {
    const data = rows.map((row) => {
      return {
        ...row,
        academicYear: academicYear,
        course: course_code[course],
      };
    });
    console.log("handle Submit", data);
  };

  const handleSearch = async (rollno: string, index: number) => {
    console.log("Searching for rollno:", rollno);
    if (user) {
      try {
        console.log(1);
        const res = await getUserByRollNo(rollno, token);
        console.log(2);
        console.log("res: ", res);
        const newRows = [...rows];
        if (res && res.length > 0) {
          newRows[index].name = res[0].name;
        } else {
          newRows[index].name = "";
        }
        setRows(newRows);
      } catch (error) {
        console.log("Error fetching details of rollno", error);
      }
    } else {
      console.log("error");
    }
  };

  const debouncedHandleSearch = useDebouncedCallback((rollno: string, index: number) => {
    handleSearch(rollno, index);
  }, 1000);

  return (
    <div>
      {rows.map((row, index) => (
        <div key={index} className="flex w-full flex-col md:flex-row items-center md:space-x-4 mb-4">
          <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
            <TextField
              id={`rollno-${index}`}
              size="small"
              required
              value={row.rollno}
              label="Roll No"
              onChange={(e) => {
                handleChangeRow(index, "rollno", e.target.value);
                debouncedHandleSearch(e.target.value, index);
              }}
            ></TextField>
          </FormControl>
          <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
            <TextField
              id={`name-${index}`}
              size="small"
              disabled
              value={row.name}
              label="Name"
              onChange={(e) => handleChangeRow(index, "name", e.target.value)}
            ></TextField>
          </FormControl>
          {/* <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
            <InputLabel id={`academic-year-label-${index}`}>Academic Year</InputLabel>
            <Select
              labelId={`academic-year-label-${index}`}
              id={`academic_year-${index}`}
              value={row.academicYear}
              label="Academic Year"
              required
              onChange={(e) => handleChangeRow(index, "academicYear", e.target.value)}
            >
              {academic_year.map((year, idx) => (
                <MenuItem key={idx} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
            <TextField
              id={`marks-${index}`}
              size="small"
              required
              value={row.marks}
              label="Marks (Out of 100)"
              onChange={(e) => handleChangeRow(index, "marks", e.target.value)}
            ></TextField>
          </FormControl>
          <div>
            <Button
              onClick={() => deleteRow(index)}
              disabled={rows.length === 1}
              variant="text"
              color="error"
              className="mt-5 "
              aria-label="add"
            >
              <DeleteForever />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={addRow}>
        Add Row
      </Button>
      <div className="w-full flex justify-center" onClick={handleSubmit}>
        {" "}
        <Button variant="contained">SUBMIT</Button>{" "}
      </div>
    </div>
  );
}

export default BridgeCoursesTable;
