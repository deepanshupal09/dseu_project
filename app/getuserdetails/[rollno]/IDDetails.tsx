import React, { useState } from "react";
import { Typography, Button, TextField, MenuItem, InputAdornment } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

interface IDDetailsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const IDDetails: React.FC<IDDetailsProps> = ({ onNext, onPrevious }) => {
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [aadharCard, setAadharCard] = useState<string>("");
  const [abcId, setAbcId] = useState<string>("");
  const [yearOfAdmission, setYearOfAdmission] = useState<number>(2021);
  const currentYear = new Date().getFullYear();
  const admissionYears = Array.from(
    { length: currentYear - 2020 },
    (_, i) => 2021 + i
  );

  const handleNext = () => {
    onNext();
  };

  return (
    <form className="flex flex-col bg-white rounded-3xl shadow-2xl max-[450px] max-[450px] p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 w-[460px] my-10">
      <Typography variant="h4" gutterBottom>
        ID Details
      </Typography>
      <TextField
        id="date-of-birth"
        label="Date of Birth"
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ArrowBackIosNew />
            </InputAdornment>
          ),
        }}
        className="w-full"
      />
      <TextField
        id="aadhar-card"
        label="Aadhar Card (12 digits)"
        type="number"
        value={aadharCard}
        onChange={(e) => {
          const input = e.target.value;
          if (/^\d{0,12}$/.test(input)) {
            setAadharCard(input);
          }
        }}
        required
        className="w-full"
      />
      <TextField
        id="abc-id"
        label="ABC ID"
        type="text"
        value={abcId}
        onChange={(e) => setAbcId(e.target.value)}
        required
        className="w-full"
      />
      <TextField
        id="year-of-admission"
        select
        label="Year of Admission"
        value={yearOfAdmission}
        onChange={(e) => setYearOfAdmission(Number(e.target.value))}
        required
        className="w-full"
      >
        {admissionYears.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>
      <div className="flex justify-between w-full">
        <Button onClick={onPrevious} variant="contained" className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800 "style={{ marginRight: "8px" }}>
          <ArrowBackIosNew />
          Previous
        </Button>
        <Button onClick={handleNext} variant="contained" className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"style={{ marginRight: "8px" }}>
          Next
          <ArrowForwardIos />
        </Button>
      </div>
    </form>
  );
};

export default IDDetails;
