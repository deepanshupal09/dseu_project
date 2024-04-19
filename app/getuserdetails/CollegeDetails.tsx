"use client"
import React, { useState } from 'react';
import { TextField, Button, Typography, FormControl, Select, InputLabel, MenuItem, Autocomplete } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function UserDetailsPage({ onNext, onPrevious, campusList, programList, semesterList }) {
  const [college, setCollege] = useState('');
  const [program, setProgram] = useState(null);
  const [semester, setSemester] = useState(null);
  const [helperText, setHelperText] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("College:", college);
    console.log("Program:", program);
    console.log("Semester:", semester);
    onNext(); // Call the onNext function passed from parent component
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col  bg-white  rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] ] my-10"
    >
      <Typography variant="h4" gutterBottom>
        College Details
      </Typography>
      <div className="w-[100%]">
      <Autocomplete
          options={campusList}
          value={college}
          onChange={(event, newValue) => {
            setCollege(newValue);
            setHelperText('');
            setError(false);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Campus"
              required
              variant="outlined"
              color="primary"
              fullWidth
              helperText={helperText}
              error={error}
            />
          )}
        />
      </div>
      <div className="w-[100%]">
        <Autocomplete
          options={programList}
          value={program}
          onChange={(event, newValue) => {
            setProgram(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Program" required variant="outlined" fullWidth />}
        />
      </div>
      <div className="w-[100%]">
        <Autocomplete
          options={semesterList}
          value={semester}
          onChange={(event, newValue) => {
            setSemester(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Semester" required variant="outlined" fullWidth />}
        />
      </div>
      <Button
        type="submit"
        className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
      >
        <div>Next</div>
        <ArrowForwardIosIcon className="scale-75" />
      </Button>
      <Button onClick={onPrevious}>Previous</Button> 
    </form>
  );
}
