"use client";
import React, { useState, useEffect } from "react";
import Head from "../dashboard/Head";
import Nav from "../dashboard/Nav";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Checkbox, FormControl, InputLabel, Select, MenuItem, Box, Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { fetchDetailsByCampus, fetchToggleResult,fetchAllMarksControl} from "@/app/actions/api";
import { getAuthAdmin } from "@/app/actions/cookie";
import { parseJwt } from "@/app/actions/utils";

interface CampusData {
    campus: string;
    program: string;
    semester: string;
    result_control: "false" | "true";
}
interface CampusData2 {
    campus: string;
    program: string;
    semester: number;
    result_control: boolean;
}
interface CampusMapping {
    [key: string]: CampusData[];
}
interface User {
    campus: string;
}


export default function Registration() {
    const [campusData, setCampusData] = useState<CampusData[]>([]);
    const [campusMapping, setCampusMapping] = useState<CampusMapping>({});
    const [selectedCampus, setSelectedCampus] = useState<string[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<Record<string, string[]>>({});
    const [selectedSemester, setSelectedSemester] = useState<Record<string, string[]>>({});
    const [user, setUser] = useState<User | null>(null);
    const [openCloseModal, setOpenCloseModal] = useState<boolean>(false);
    const [openCloseAction, setOpenCloseAction] = useState<string>("");
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [filterCampus, setFilterCampus] = useState<string[]>([]);
    const [filterProgram, setFilterProgram] = useState<string[]>([]);
    const [filterSemester, setFilterSemester] = useState<string[]>([]);
    const [campusList, setCampusList] = useState<string[]>([]);
    const [programList, setProgramList] = useState<string[]>([]);
    const [semesterList, setSemesterList] = useState<string[]>([]);
    const [campusRenderList, setCampusRenderList] = useState<string[]>([]);
    const [programRenderList, setProgramRenderList] = useState<string[]>([]);
    const [semesterRenderList, setSemesterRenderList] = useState<string[]>([]);
    const [resultControlDetails, setResultControlDetails] = useState<CampusData2[]>([]);
    const [reloadDetails, setReloadDetails] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuthAdmin().then(async (t: any) => {
            if (t) {
                setToken(t.value);
            }
        });
    }, []);

    useEffect(() => {
        if (token) {
            fetchAllMarksControl(token).then((res: CampusData2[]) => {
                // console.log(res);
                setResultControlDetails(res); 
            }).catch((error) => {
                console.error(error); 
            });
        }
    }, [token,reloadDetails]);
    
    useEffect(() => {
        if (token) {
            fetchDetailsByCampus(token)
                .then((res: CampusData[]) => {
                    // 
                    const modifiedRes = res.map((data) => ({
                        ...data,
                        semester: data.semester.toString(),
                    }));

                    setCampusData(modifiedRes);

                    const uniqueCampuses = new Set<string>();
                    const uniquePrograms = new Set<string>();
                    const uniqueSemesters = new Set<string>();

                    modifiedRes.forEach((data) => {
                        uniqueCampuses.add(data.campus);
                        uniquePrograms.add(data.program);
                        uniqueSemesters.add(data.semester);
                    });

                    setCampusList(Array.from(uniqueCampuses));
                    setProgramList(Array.from(uniquePrograms));
                    setSemesterList(Array.from(uniqueSemesters));

                    setCampusRenderList(Array.from(uniqueCampuses));
                    setProgramRenderList(Array.from(uniquePrograms));
                    setSemesterRenderList(Array.from(uniqueSemesters));
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [token]);

    useEffect(() => {
        const temp1 = campusData.filter((data) => (filterCampus.length === 0 || filterCampus.includes(data.campus)) && (filterSemester.length === 0 || filterSemester.includes(data.semester))).map((data) => data.program);

        const temp2 = campusData.filter((data) => (filterCampus.length === 0 || filterCampus.includes(data.campus)) && (filterProgram.length === 0 || filterProgram.includes(data.program))).map((data) => data.semester);
        // 

        setProgramRenderList(Array.from(new Set(temp1)));
        setSemesterRenderList(Array.from(new Set(temp2)));
    }, [filterCampus]);

    useEffect(() => {
        const temp1 = campusData.filter((data) => (filterProgram.length === 0 || filterProgram.includes(data.program)) && (filterCampus.length === 0 || filterCampus.includes(data.campus))).map((data) => data.semester);

        const temp2 = campusData.filter((data) => (filterProgram.length === -0 || filterProgram.includes(data.program)) && (filterSemester.length === 0 || filterSemester.includes(data.semester))).map((data) => data.campus);
        // 

        setCampusRenderList(Array.from(new Set(temp2)));
        setSemesterRenderList(Array.from(new Set(temp1)));
    }, [filterProgram]);

    useEffect(() => {
        const temp1 = campusData.filter((data) => (filterSemester.length === 0 || filterSemester.includes(data.semester)) && (filterProgram.length === 0 || filterProgram.includes(data.program))).map((data) => data.campus);

        const temp2 = campusData.filter((data) => (filterSemester.length === 0 || filterSemester.includes(data.semester)) && (filterCampus.length === 0 || filterCampus.includes(data.campus))).map((data) => data.program);
        // 

        setCampusRenderList(Array.from(new Set(temp1)));
        setProgramRenderList(Array.from(new Set(temp2)));
    }, [filterSemester]);

    const handleCampusCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const isSelected = event.target.checked;

        setSelectedCampus((prev) => (isSelected ? [...prev, value] : prev.filter((c) => c !== value)));

        setSelectedProgram((prev) => {
            const updatedPrograms = { ...prev };
            if (isSelected) {
                updatedPrograms[value] = campusData.filter((item) => item.campus === value).map((item) => item.program);
            } else {
                delete updatedPrograms[value];
            }
            return updatedPrograms;
        });

        setSelectedSemester((prev) => {
            const updatedSemesters = { ...prev };
            if (isSelected) {
                campusData
                    .filter((item) => item.campus === value)
                    .forEach((item) => {
                        const key = `${value}-${item.program}`;
                        if (updatedSemesters[key]) {
                            updatedSemesters[key] = [...Array.from(new Set([...updatedSemesters[key], String(item.semester)]))];
                        } else {
                            updatedSemesters[key] = [String(item.semester)];
                        }
                    });
            } else {
                Object.keys(updatedSemesters).forEach((key) => {
                    if (key.startsWith(value)) {
                        delete updatedSemesters[key];
                    }
                });
            }
            return updatedSemesters;
        });
    };

    const handleProgramCheckboxChange = (campus: string, program: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        setSelectedProgram((prev) => {
            const updatedPrograms = value ? [...(prev[campus] || []), program] : (prev[campus] || []).filter((p) => p !== program);
            return { ...prev, [campus]: updatedPrograms };
        });

        if (value && !selectedCampus.includes(campus)) {
            setSelectedCampus((prev) => [...prev, campus]);
        } else if (!value && selectedProgram[campus]?.length === 1) {
            setSelectedCampus((prev) => prev.filter((c) => c !== campus));
        }

        setSelectedSemester((prev) => {
            const key = `${campus}-${program}`;
            const updatedSemesters = value ? campusData.filter((item) => item.campus === campus && item.program === program).map((item) => String(item.semester)) : [];
            return { ...prev, [key]: updatedSemesters };
        });
    };

    const handleSemesterCheckboxChange = (campus: string, program: string, semester: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const isSelected = event.target.checked;
        const key = `${campus}-${program}`;

        setSelectedSemester((prev) => {
            const updatedSemesters = { ...prev };
            if (isSelected) {
                if (updatedSemesters[key]) {
                    updatedSemesters[key].push(semester);
                } else {
                    updatedSemesters[key] = [semester];
                }
            } else {
                if (updatedSemesters[key]) {
                    updatedSemesters[key] = updatedSemesters[key].filter((s) => s !== semester);
                    if (updatedSemesters[key].length === 0) {
                        delete updatedSemesters[key];
                    }
                }
            }
            return updatedSemesters;
        });

        if (isSelected) {
            if (!selectedCampus.includes(campus)) {
                setSelectedCampus((prev) => [...prev, campus]);
            }
            setSelectedProgram((prev) => {
                const updatedPrograms = { ...prev };
                if (!updatedPrograms[campus]?.includes(program)) {
                    updatedPrograms[campus] = [...(updatedPrograms[campus] || []), program];
                }
                return updatedPrograms;
            });
        } else {
            setSelectedProgram((prev) => {
                const updatedPrograms = { ...prev };
                if (updatedPrograms[campus]?.includes(program)) {
                    const remainingSemesters = campusData
                        .filter((item) => item.campus === campus && item.program === program)
                        .map((item) => String(item.semester))
                        .filter((sem) => sem !== semester);

                    if (remainingSemesters.length === 0) {
                        updatedPrograms[campus] = updatedPrograms[campus].filter((p) => p !== program);
                        if (updatedPrograms[campus].length === 0) {
                            delete updatedPrograms[campus];
                        }
                    }
                }
                return updatedPrograms;
            });

            setSelectedCampus((prev) => {
                const updatedCampus = prev.filter((c) => c !== campus);
                return updatedCampus;
            });
        }
    };

    const handleCloseModal = () => {
        setOpenCloseModal(false);
    };

    const handleOpenCloseClick = (action: string) => {
        setOpenCloseAction(action);
        setOpenCloseModal(true);
    };

    const handleConfirmFilteredAction = async () => {
        const payload: { campus: string; program: string; semester: number; result_control: boolean }[] = [];
        // console.log(payload);

        selectedCampus.forEach((campus) => {
            (selectedProgram[campus] || []).forEach((program) => {
                (selectedSemester[`${campus}-${program}`] || []).forEach((semester) => {
                    payload.push({
                        campus,
                        program,
                        semester: Number(semester),
                        result_control: openCloseAction === "true",
                    });
                });
            });
        });


        try {
            const body: { campus: string; program: string; semester: number; result_control: boolean }[] = ([] = payload);
            const res = await fetchToggleResult(body, token);


            const message = openCloseAction === "true" ? "Marks Control window opened for your selections." : "Marks Control window closed for your selections.";
            setSnackbarMessage(message);
        } catch (error) {
            console.error("Error updating marks control:", error);
            alert("Internal server error!");
        }

        setSnackbarOpen(true);
        handleCloseModal();
        setReloadDetails(!reloadDetails);
    };

    const handleTagDelete = (filterType: string, value: string) => {
        switch (filterType) {
            case "campus":
                setFilterCampus((prev) => prev.filter((item) => item !== value));
                break;
            case "program":
                setFilterProgram((prev) => prev.filter((item) => item !== value));
                break;
            case "semester":
                setFilterSemester((prev) => prev.filter((item) => item !== value));
                break;
            default:
                break;
        }
    };
    const getColorTags = () => {
        const campusTags: Record<string, string> = {};
        const programTags: Record<string, string> = {};
        const semesterTags: Record<string, string> = {};
    
        resultControlDetails.forEach((detail: CampusData2) => {
            semesterTags[`${detail.campus}-${detail.program}-${detail.semester}`] = detail.result_control ? 'green' : 'red';
        });
    
        const campusPrograms: Record<string, Set<string>> = campusData.reduce((acc: Record<string, Set<string>>, item: CampusData) => {
            if (!acc[item.campus]) {
                acc[item.campus] = new Set();
            }
            acc[item.campus].add(item.program);
            return acc;
        }, {});
        Object.keys(campusPrograms).forEach(campus => {
            campusPrograms[campus].forEach(program => {
                const semesters = semesterList.filter(semester => 
                    semesterTags[`${campus}-${program}-${semester}`] !== undefined
                );
                const allTrue = semesters.every(semester => semesterTags[`${campus}-${program}-${semester}`] === 'green');
                const allFalse = semesters.every(semester => semesterTags[`${campus}-${program}-${semester}`] === 'red');
                
                if (allTrue) {
                    programTags[`${campus}-${program}`] = 'green';
                } else if (allFalse) {
                    programTags[`${campus}-${program}`] = 'red';
                } else {
                    programTags[`${campus}-${program}`] = 'yellow';
                }
            });
    
            // Check campus level tags
            const allProgramsGreen = Array.from(campusPrograms[campus]).every(program => programTags[`${campus}-${program}`] === 'green');
            const allProgramsRed = Array.from(campusPrograms[campus]).every(program => programTags[`${campus}-${program}`] === 'red');
            const anyProgramYellow = Array.from(campusPrograms[campus]).some(program => programTags[`${campus}-${program}`] === 'yellow');
            const hasRed = Array.from(campusPrograms[campus]).some(program => programTags[`${campus}-${program}`] === 'red');
            const hasGreen = Array.from(campusPrograms[campus]).some(program => programTags[`${campus}-${program}`] === 'green');
    
            // console.log(`Campus: ${campus}`);
            // console.log('Programs:', Array.from(campusPrograms[campus]).map(program => `${program}: ${programTags[`${campus}-${program}`]}`).join(', '));
            // console.log('Conditions - allProgramsGreen:', allProgramsGreen, ', allProgramsRed:', allProgramsRed, ', anyProgramYellow:', anyProgramYellow, ', hasRed:', hasRed, ', hasGreen:', hasGreen);
    
            if (anyProgramYellow) {
                // console.log('Setting campus to yellow due to anyProgramYellow');
                campusTags[campus] = 'yellow';
            } else if (allProgramsGreen) {
                // console.log('Setting campus to green due to allProgramsGreen');
                campusTags[campus] = 'green';
            } else if (allProgramsRed) {
                // console.log('Setting campus to red due to allProgramsRed');
                campusTags[campus] = 'red';
            } else if (hasRed && hasGreen) {
                // console.log('Setting campus to yellow due to mix of red and green');
                campusTags[campus] = 'yellow';
            } else {
                // console.log('No specific condition met, defaulting to yellow');
                campusTags[campus] = 'yellow';
            }
        });
        return { campusTags, programTags, semesterTags };
    };
    

    const { campusTags, programTags, semesterTags } = getColorTags();

const filterAccordions = () => {
    let filteredCampuses = campusData
    .map((item) => item.campus)
    .filter((campus, index, self) => self.indexOf(campus) === index)
    .filter((campus) => {
        let programsInCampus = campusData.filter(item => item.campus === campus).map(item => item.program);
        let programsFiltered = filterProgram.length === 0 || programsInCampus.some(program => filterProgram.includes(program));
        
        if (programsFiltered) {
            let semestersInCampus = campusData.filter(item => item.campus === campus && (filterProgram.length === 0 || filterProgram.includes(item.program))).map(item => item.semester);
            return filterSemester.length === 0 || semestersInCampus.some(semester => filterSemester.includes(semester));
        } else {
            return false; 
        }
    });

    return filteredCampuses.map((campus, index) => {
        let filteredPrograms = campusData
            .filter((item) => item.campus === campus)
            .map((item) => item.program)
            .filter((program, index, self) => self.indexOf(program) === index)
            .filter((program) => filterProgram.length === 0 || filterProgram.includes(program));

        let isAllProgramsSelected = filteredPrograms.every((program) => (selectedProgram[campus] || []).includes(program));
        let areAllSemestersSelected = filteredPrograms.every((program) => 
            (selectedSemester[`${campus}-${program}`] || []).length > 0 && campusData.filter((item) => item.campus === campus && item.program === program).every((item) => 
                (selectedSemester[`${campus}-${program}`] || []).includes(String(item.semester))
            )
        );

        let isSomeProgramSelected = filteredPrograms.some((program) => (selectedProgram[campus] || []).includes(program));
        let isSomeSemesterSelected = filteredPrograms.some((program) => (selectedSemester[`${campus}-${program}`] || []).length > 0);
        let isAnyProgramOrSemesterSelected = filteredPrograms.some((program) => 
            (selectedProgram[campus] || []).includes(program) || (selectedSemester[`${campus}-${program}`] || []).length > 0
        );

        let isCampusSelected = isAnyProgramOrSemesterSelected && areAllSemestersSelected && isAllProgramsSelected;
        let isSomeProgramIndeterminate = !isAllProgramsSelected && isSomeProgramSelected;
        let isSomeSemesterIndeterminate = !areAllSemestersSelected && isSomeSemesterSelected;

        if (!isAnyProgramOrSemesterSelected || (isSomeProgramIndeterminate && !isSomeSemesterSelected)) {
            isCampusSelected = false;
            isSomeProgramIndeterminate = false;
            isSomeSemesterIndeterminate = false;
        }

        if (filteredPrograms.length === 0) {
            return null;
        }

        return (
            <Accordion key={index}>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls={`panel1-content-${index}`} id={`panel1-header-${index}`}>
                    <div className="flex items-center w-full justify-between" >
                        <div className="flex items-center">
                        <Checkbox checked={isCampusSelected} indeterminate={isSomeProgramIndeterminate || isSomeSemesterIndeterminate} onChange={handleCampusCheckboxChange} value={campus} />
                        <Typography>{campus}</Typography>
                        </div>
                        <Chip label=''  className={`border-2  ${campusTags[campus] === 'green' ? 'bg-green-400 border-green-400' :  campusTags[campus] === 'red' ? 'bg-red-500 border-red-400' : 'bg-yellow-300 border-yellow-400'} p-2 m-4 rounded-full w-1 h-1`} />

                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {filteredPrograms.map((program, programIndex) => {
                        let filteredSemesters = campusData.filter((item) => item.campus === campus && item.program === program).filter((item) => filterSemester.length === 0 || filterSemester.includes(item.semester));

                        let isProgramSelected = (selectedProgram[campus] || []).includes(program);
                        let areAllSemestersSelected = filteredSemesters.length > 0 && filteredSemesters.every((item) => (selectedSemester[`${campus}-${program}`] || []).includes(String(item.semester)));

                        if (filteredSemesters.length === 0) {
                            return null;
                        }

                        return (
                            <Accordion key={programIndex}>
                                <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls={`panel2-content-${programIndex}`} id={`panel2-header-${programIndex}`}>
                                    <div className="flex items-center w-full justify-between" >
                                        <div className="flex items-center">
                                        <Checkbox checked={areAllSemestersSelected} indeterminate={!areAllSemestersSelected && filteredSemesters.some((item) => (selectedSemester[`${campus}-${program}`] || []).includes(String(item.semester)))} onChange={(event) => handleProgramCheckboxChange(campus, program, event)} value={program} />
                                        <Typography>{program}</Typography>
                                        </div>
                                        <Chip label=''  className={`border-2  ${programTags[`${campus}-${program}`] === 'green' ? 'bg-green-400 border-green-400' :  programTags[`${campus}-${program}`] === 'red' ? 'bg-red-500 border-red-400' : 'bg-yellow-300 border-yellow-400'} p-2 m-4 rounded-full justify-between w-1 h-1`} />
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormControl className="mx-6" fullWidth margin="normal">
                                        <Box display="flex" flexDirection="column">
                                            <h4>Semesters</h4>
                                            <Box>
                                                {filteredSemesters.map((item, semesterIndex) => (
                                                    <div key={semesterIndex} className="flex items-center w-full justify-between">
                                                    <div className="flex items-center">
                                                      <Checkbox
                                                        checked={(selectedSemester[`${campus}-${program}`] || []).includes(String(item.semester))}
                                                        onChange={(event) =>
                                                          handleSemesterCheckboxChange(campus, program, String(item.semester), event)
                                                        }
                                                        value={String(item.semester)}
                                                      />
                                                      <Typography>{item.semester}</Typography>
                                                    </div>
                                                        <Chip label=''  className={`border-2  ${semesterTags[`${campus}-${program}-${item.semester}`] === 'green' ? 'bg-green-500 border-green-400' : semesterTags[`${campus}-${program}-${item.semester}`] === 'red' ? 'bg-red-500 border-red-400' : 'bg-yellow-300 border-yellow-400'} p-2 mr-12 rounded-full w-1 h-1`} />
                                            </div>
                                                ))}
                                            </Box>
                                        </Box>
                                    </FormControl>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </AccordionDetails>
            </Accordion>
        );
    });
};


    const applyFilters = () => {
        const filteredData = campusData.filter((item) => (filterCampus.length === 0 || filterCampus.includes(item.campus)) && (filterProgram.length === 0 || filterProgram.includes(item.program)) && (filterSemester.length === 0 || filterSemester.includes(item.semester)));

        const selectedCampuses = Array.from(new Set(filteredData.map((item) => item.campus)));
        const selectedPrograms = selectedCampuses.reduce((acc, campus) => {
            const programs = filteredData.filter((item) => item.campus === campus).map((item) => item.program);
            acc[campus] = Array.from(new Set(programs));
            return acc;
        }, {} as Record<string, string[]>);

        const selectedSemesters = filteredData.reduce((acc, item) => {
            const key = `${item.campus}-${item.program}`;
            acc[key] = acc[key] ? [...acc[key], String(item.semester)] : [String(item.semester)];
            return acc;
        }, {} as Record<string, string[]>);

        setSelectedCampus(selectedCampuses);
        setSelectedProgram(selectedPrograms);
        setSelectedSemester(selectedSemesters);
    };
    const deselectAll = () => {
        setSelectedCampus([]);
        setSelectedProgram({});
        setSelectedSemester({});
    };
    
    

    return (
        <>
            <div className="bg-[#dfdede]">
            </div>
            <div className="mt-[154px] max-sm:mt-[150px] px-2 sm:ml-[250px]">
                <div className="bg-dseublue py-2 px-2 sm:mx-8 rounded shadow mt-28">
                    <h1 className="text-2xl text-white font-bold text-center">Result Control</h1>
                </div>
                <div className="py-2 px-2 rounded shadow max-sm:w-full mt-5 sm:mx-8">
                    <div className="flex mb-2 space-x-3">
                        <FormControl fullWidth>
                            <InputLabel>Campus</InputLabel>
                            <Select multiple value={filterCampus} onChange={(event) => setFilterCampus(event.target.value as string[])} label="Campus" renderValue={(selected) => (selected as string[]).join(", ")}>
                                {campusRenderList.map((campus, index) => (
                                    <MenuItem key={index} value={campus}>
                                        <Checkbox checked={filterCampus.includes(campus)} />
                                        <Typography>{campus}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Program</InputLabel>
                            <Select multiple value={filterProgram} onChange={(event) => setFilterProgram(event.target.value as string[])} label="Program" renderValue={(selected) => (selected as string[]).join(", ")}>
                                {programRenderList.map((program, index) => (
                                    <MenuItem key={index} value={program}>
                                        <Checkbox checked={filterProgram.includes(program)} />
                                        <Typography>{program}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Semester</InputLabel>
                            <Select multiple value={filterSemester} onChange={(event) => setFilterSemester(event.target.value as string[])} label="Semester" renderValue={(selected) => (selected as string[]).join(", ")}>
                                {semesterRenderList.map((semester, index) => (
                                    <MenuItem key={index} value={semester}>
                                        <Checkbox checked={filterSemester.includes(semester.toString())} />
                                        <Typography>{semester}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {filterCampus.map((campus, index) => (
                            <Chip key={index} label={campus} onDelete={() => handleTagDelete("campus", campus)} />
                        ))}
                        {filterProgram.map((program, index) => (
                            <Chip key={index} label={program} onDelete={() => handleTagDelete("program", program)} />
                        ))}
                        {filterSemester.map((semester, index) => (
                            <Chip key={index} label={semester} onDelete={() => handleTagDelete("semester", semester)} />
                        ))}
                    </div>

                    <div className="flex justify-center mb-2 space-x-4">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={applyFilters}
                            // disabled={filterCampus.length === 0 && filterProgram.length === 0 && filterSemester.length === 0}
                        >
                            Select All
                        </Button>
                        <Button variant="contained"
                            color="primary"
                            onClick={deselectAll}
                            // disabled={filterCampus.length === 0 && filterProgram.length === 0 && filterSemester.length === 0}
                        >
                            Deselect

                        </Button>
                    </div>
                    <div className=" mt-5 text-center">
                        {loading ? (
                            <CircularProgress className="mx-auto" />
                        ) : (
                            filterAccordions()
                        )}
                    </div>
                    <div className="flex justify-center m-6">
                        <Button variant="contained" color="primary" onClick={() => handleOpenCloseClick("false")} disabled={Object.keys(selectedSemester).length === 0}>
                            Close
                        </Button>
                        <div className="ml-2">
                            <Button variant="contained" color="primary" onClick={() => handleOpenCloseClick("true")} disabled={Object.keys(selectedSemester).length === 0}>
                                Open
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "left" }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
            <Dialog open={openCloseModal} onClose={handleCloseModal}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>{`Are you sure you want to ${openCloseAction === "true" ? "open" : "close"} result control window for selected campuses, programs, and semesters?`}</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmFilteredAction} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}