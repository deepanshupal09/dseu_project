import React, { useEffect, useState } from "react";
import {
    Typography,
    Button,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface IDDetailsProps {
    onNext: () => void;
    onPrevious: () => void;
    dateOfBirth: string;
    aadharCard: string;
    abcId: string;
    yearOfAdmission: number;
    setDateOfBirth: React.Dispatch<React.SetStateAction<string>>;
    setAadharCard: React.Dispatch<React.SetStateAction<string>>;
    setAbcId: React.Dispatch<React.SetStateAction<string>>;
    setYearOfAdmission: React.Dispatch<React.SetStateAction<number>>;
}

const IDDetails: React.FC<IDDetailsProps> = ({
    onNext,
    onPrevious,
    aadharCard,
    setAadharCard,
    dateOfBirth,
    setDateOfBirth,
    abcId,
    setAbcId,
    yearOfAdmission,
    setYearOfAdmission,
}) => {
    const currentYear = new Date().getFullYear();
    const admissionYears = Array.from(
        { length: currentYear - 2020 },
        (_, i) => 2021 + i
    );

    const handleNext = () => {
        onNext();
    };

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        console.log("dateofBirth: ", dateOfBirth);
    }, [dateOfBirth]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleNext();
            }}
            className="flex flex-col bg-white rounded-3xl shadow-2xl max-[450px] max-[450px] p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 w-[460px] my-10"
        >
            <Typography variant="h4" gutterBottom>
                ID Details
            </Typography>
            <TextField
                required
                id="date-of-birth"
                label="Date of Birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => {
                    console.log(typeof e.target.value);
                    setDateOfBirth(e.target.value);
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <CalendarTodayIcon className="scale-75" />
                        </InputAdornment>
                    ),
                }}
                inputProps={{
                    max: today
                }}
                className="w-full"
            />
            <TextField
                required
                id="aadhar-card"
                label="Aadhar Card (12 digits)"
                type="text" // Change type to text
                value={aadharCard}
                onChange={(e) => {
                    const input = e.target.value;
                    const sanitizedInput = input.replace(/\D/g, "");
                    const limitedInput = sanitizedInput.slice(0, 12);
                    setAadharCard(limitedInput);
                }}
                inputProps={{
                    maxLength: 12, // Set maximum length to 12
                    pattern: "\\d{12}", // Pattern for exactly 12 digits
                }}
                className="w-full"
            />

            <TextField
                required
                id="abc-id"
                label="ABC ID"
                type="text"
                value={abcId}
                inputProps={{
                    maxLength: 12, // Set maximum length to 12
                    pattern: "\\d{12}", // Pattern for exactly 12 digits
                }}
                onChange={(e) => setAbcId(e.target.value)}
                className="w-full"
            />
            <TextField
                required
                id="year-of-admission"
                select
                label="Year of Admission"
                value={yearOfAdmission}
                onChange={(e) => setYearOfAdmission(Number(e.target.value))}
                className="w-full"
            >
                {admissionYears.map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                ))}
            </TextField>
            <div className="flex justify-between w-full">
                <button
                        type="button"

                    onClick={onPrevious}
                    // variant="contained"
                    className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800 "
                    style={{ marginRight: "8px" }}
                >
                    <ArrowBackIosNew />
                    Previous
                </button>
                <button
                    // onClick={handleNext}
                    // variant="contained"
                    type="submit"
                    className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
                    style={{ marginRight: "8px" }}
                >
                    Next
                    <ArrowForwardIos />
                </button>
            </div>
        </form>
    );
};

export default IDDetails;
