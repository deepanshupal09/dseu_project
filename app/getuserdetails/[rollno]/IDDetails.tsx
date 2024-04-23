import React, { useState } from "react";
import { Typography } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import Button from "@mui/material/Button";



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
    (_, i) => 2020 + i
  );

  const handleNext = () => {
    onNext();
  };

  return (
    <form className="flex flex-col bg-white rounded-3xl shadow-2xl max-[450px] max-[450px] p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 w-[460px] my-10">
      <Typography variant="h4" gutterBottom>
        ID Details
      </Typography>
      <div>
        <label htmlFor="date-of-birth">Date of Birth:</label>
        <input
          type="date"
          id="date-of-birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="aadhar-card">Aadhar Card (12 digits):</label>
        <input
          type="number"
          id="aadhar-card"
          value={aadharCard}
          onChange={(e) => {
            const input = e.target.value;
            if (/^\d{0,12}$/.test(input)) {
              setAadharCard(input);
            }
          }}
        />
      </div>
      <div>
        <label htmlFor="abc-id">ABC ID:</label>
        <input
          type="text"
          id="abc-id"
          value={abcId}
          onChange={(e) => setAbcId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="year-of-admission">Year of Admission:</label>
        <select
          id="year-of-admission"
          value={yearOfAdmission}
          onChange={(e) => setYearOfAdmission(Number(e.target.value))}
        >
          {admissionYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between w-full">
      <Button onClick={onPrevious} variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
        <ArrowBackIosNew />
        Previous
        </Button>
        <Button onClick={handleNext} variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
        Next
        <ArrowForwardIos />
      </Button>

      </div>
    </form>
  );
};

export default IDDetails;
