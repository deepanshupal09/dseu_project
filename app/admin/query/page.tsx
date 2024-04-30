"use client";
import React,{useState} from "react";
import Head from "../dashboard/Head";
import Nav from "../dashboard/Nav";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';


export default function Registration () {
    const [selected, setSelected] = useState(0);
    const options = ["Dashboard", "Registration Chart", "Admit Card", "Query"];
  
    const [selectedProgramCategory, setSelectedProgramCategory] = useState("All");
    const [selectedProgram, setSelectedProgram] = useState("All");
    const [selectedSemester, setSelectedSemester] = useState("All");

    const programCategories = ["UG", "PG", "Diploma", "All"];
    const programs = ["Btech in CSE", "Btech in MAE", "Btech in ECE", "All"];
    const semesters = ["2", "4", "6", "All"];

    const handleApplyFilters = () => {
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
                <h2 className="text-xl font-semibold mb-5 md:text-center sm:mb-5 text-center">SELECT</h2>
                <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
                    <FormControl size="small" className="w-full md:w-1/3 sm:w-auto mt-5">
                        <InputLabel id="program-category-label">Program category</InputLabel>
                        <Select
                            labelId="program-category-label"
                            id="program-category"
                            value={selectedProgramCategory}
                            label="Program category"
                            onChange={handleChangeProgramCategory}
                        >
                            {programCategories.map((category, index) => (
                                <MenuItem key={index} value={category}>{category}</MenuItem>
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
                            {programs.map((program, index) => (
                                <MenuItem key={index} value={program}>{program}</MenuItem>
                            ))}
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
                                <MenuItem key={index} value={semester}>{semester}</MenuItem>
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
            </div>
        </>
    );
}