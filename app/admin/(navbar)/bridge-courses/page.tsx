"use client";
import React, { use, useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button, { ButtonProps } from "@mui/material/Button";
import { useData } from "@/contexts/DataContext";
import { TextField } from "@mui/material";

interface ProgramList {
  [key: string]: string[];
}

interface Course {
  course_name: string;
  course_code: string;
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

export default function BridgeCourses() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  useState<string>("");
  const { data } = useData();
  const academic_year = ["2023-2024"];
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
  const courseList = [
    "Applied Mathematics II",
    "Basic Sciences (Applied Physics)",
    "Basic Sciences (Applied Chemistry)",
  ];
  const courseCodes: Course[] = [
    {
      course_name: "Applied Mathematics II",
      course_code: "FC-012",
    },
    {
      course_name: "Basic Sciences (Applied Chemistry)",
      course_code: "FC-1-CH051",
    },
    {
      course_name: "Basic Sciences (Applied Physics)",
      course_code: "FC-1-PH051",
    },
  ];

  const handleChangeCourse = (event: SelectChangeEvent) => {
    setSelectedCourse(event.target.value);
  };
  const handleChangeAcademicYear = (event: SelectChangeEvent) => {
    setSelectedAcademicYear(event.target.value);
  };

  const handleSubmit = () => {
    console.log("handle Submit");
  };

  return (
    <>
      <div className="bg-[#dfdede] mt-2"></div>
      <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[130px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        <h1 className="text-2xl text-white font-bold text-center">
          Bridge Courses Marks Entry
        </h1>
      </div>
      <div className="py-2 px-4 rounded shadow absolute top-[200px] sm:left-[250px] left-0 right-0  mx-2 sm:mx-12 mt-6">
        <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">
          SELECT
        </h2>
        {data && (
          <form
            className="w-full flex items-center flex-col"
            onSubmit={handleSubmit}
          >
            <div className="flex w-full flex-col md:flex-row items-center md:space-x-4 mb-4">
              <FormControl
                size="small"
                className="w-full md:w-1/3 sm:w-auto mt-5"
              >
                <TextField
                  id="course"
                  size="medium"
                  required
                  // value={selectedCourse}
                  label="Roll No"
                  // onChange={handleChangeCourse}
                ></TextField>
              </FormControl>
              <FormControl
                size="medium"
                className="w-full md:w-1/3 sm:w-auto mt-5"
              >
                <InputLabel id="course-label">Course</InputLabel>
                <Select
                  labelId="course-label"
                  id="course"
                  value={selectedCourse}
                  label="Course"
                  required
                  onChange={handleChangeCourse}
                >
                  {courseList.map((course, index) => (
                    <MenuItem key={index} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                size="medium"
                className="w-full md:w-1/3 sm:w-auto mt-5"
              >
                <InputLabel id="academic-year-label">Academic Year</InputLabel>
                <Select
                  id="academic_year"
                  value={selectedAcademicYear}
                  label="Academic Year"
                  required
                  onChange={handleChangeAcademicYear}
                >
                  {academic_year.map((course, index) => (
                    <MenuItem key={index} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                size="small"
                className="w-full md:w-1/3 sm:w-auto mt-5"
              >
                <TextField
                  id="course"
                  size="medium"
                  required
                  // value={selectedCourse}
                  label="Marks(Out of 100)"
                  // onChange={handleChangeCourse}
                ></TextField>
              </FormControl>
            </div>
            <Button
              className=""
              type="submit"
              variant="contained"
              size="medium"
            >
              SUBMIT
            </Button>
          </form>
        )}
        <div></div>
        {/* Table */}

        <div
          className="my-10"
          id="datagrid-container"
          style={{ height: 670, width: "100%" }}
        ></div>
      </div>
    </>
  );
}
