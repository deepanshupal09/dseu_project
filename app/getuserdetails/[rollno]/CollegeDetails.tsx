import React, { useState, MouseEventHandler } from "react";
import {
    TextField,
    Button,
    Typography,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Autocomplete,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ArrowBackIosNew } from "@mui/icons-material";

interface Props {
    college: string;
    program: string;
    semester: string;
    programtype: string;
    onNext: Function;
    onPrevious: Function;
    campusList: string[];
    programList: string[];
    semesterList: string[];
    programTypeList: string[];
    setcollege: Function;
    setsemester: Function;
    setprogram: Function;
    setprogramtype: Function;
}

export default function UserDetailsPage({
    college,
    program,
    semester,
    programtype,
    onNext,
    onPrevious,
    setsemester,
    campusList,
    programList,
    programTypeList,
    setprogramtype,
    semesterList,
    setprogram,
    setcollege,
}: Props) {
    // const [college, setCollege] = useState('');
    // const [program, setProgram] = useState(null);
    // const [semester, setSemester] = useState(null);
    const [helperText, setHelperText] = useState("");
    // const [programType,setProgramType ] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setcollege(college);
        setsemester(semester);
        setprogram(program);
        setprogramtype(programtype);
        onNext(); // Call the onNext function passed from parent component
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col bg-white rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100%] w-[460px] ] my-10"
        >
            <Typography variant="h4" gutterBottom>
                College Details
            </Typography>
            <div className="w-[100%]">
                <Autocomplete
                    options={campusList}
                    value={college || ""}
                    onChange={(event, newValue) => {
                        setcollege(newValue);
                        setHelperText("");
                        setError(false);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Campus"
                            required
                            variant="outlined"
                            fullWidth
                            helperText={helperText}
                            error={error}
                        />
                    )}
                />
            </div>
            <div className="w-[100%]">
                <Autocomplete
                    options={programTypeList}
                    value={programtype}
                    color="grey"
                    onChange={(event, newValue) => {
                        setprogramtype(newValue);
                        setHelperText("");
                        setError(false);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Program Type"
                            required
                            variant="outlined"
                            fullWidth
                            helperText={helperText}
                            error={error}
                            color="grey"
                        />
                    )}
                />
            </div>
            <div className="w-[100%]">
                <Autocomplete
                    options={programList}
                    value={program || ""}
                    onChange={(event, newValue) => {
                        setprogram(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Program"
                            required
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />
            </div>
            <div className="w-[100%]">
                <Autocomplete
                    options={semesterList}
                    value={semester || ""}
                    onChange={(event, newValue) => {
                        setsemester(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Semester"
                            required
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />
            </div>
            <div className="flex gap-x-2 w-full">
                <button
                    type="button"
                    onClick={() => {
                        onPrevious();
                    }}
                    className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
                >
                    <ArrowBackIosNew className="scale-75 -ml-4" />
                    Previous
                </button>
                <button
                    type="submit"
                    className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
                >
                    <div>Next</div>
                    <ArrowForwardIosIcon className="scale-75 -mr-4" />
                </button>
            </div>
        </form>
    );
}
