"use client";
"use client";
import React, { useState, useEffect , useRef} from "react";
import ReactToPrint from "react-to-print";
import Head from "../dashboard/Head";
import Nav from "../dashboard/Nav";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import logo from "../../images/dseu.png";


import { getAuthAdmin } from '../../actions/cookie';
import { parseJwt } from "@/app/actions/utils";
import { fetchExamRegistrationByProgramAndSemester } from "@/app/actions/api";
import Image from "next/image";

interface ProgramList {
    [key: string]: string[];
}

interface Token {
    name: string;
    value: string;
    path: string;
}

interface Student {
    rollno: string;
    name: string;
    dob: string;
    photo: string;
    program: string;
    semester: number;
    course_codes: string[];
}
interface IndexDataRow {
    sno: number;
    courseName: string;
    courseCode: string;
    credit: number;
    courseType: string;
}
interface DropdownMenuProps {
    handleShowMain: () => void;
    handleShowIndex: () => void;
}

const programListByType: ProgramList = {
    Diploma: [
        "Diploma in Applied Arts",
        "Diploma in Architecture",
        "Diploma in Automobile Engineering",
        "Diploma in Chemical Engineering",
        "Diploma in Civil Engineering",
        "Diploma in Computer Engineering",
        "Diploma in Cosmetology & Health",
        "Diploma in Electrical Engineering",
        "Diploma in Electronic Engineering",
        "Diploma in Fashion Design",
        "Diploma in Fashion Design and Garment Technology",
        "Diploma in Interior Design",
        "Diploma in Mechanical Engineering",
        "Diploma in Pharmacy",
        "Diploma in Printing Technology",
        "Diploma in Tool and Die Making",
        "Diploma in Artificial Intelligence and Machine Learning",
        "Diploma in Robotic and Process Automation",
        "Diploma in Electrical Engineering - Part Time",
        "Diploma in Mechanical Engineering - Part Time",
        "Diploma in Automobile Engineering - Part Time",
        "Diploma in Civil Engineering - Part Time",
    ],
    Undergraduate: [
        "Bachelor of Arts (Aesthetics & Beauty Therapy)",
        "Bachelor of Science (Aesthetics & Beauty Therapy)",
        "Bachelor of Computer Applications",
        "Bachelor of Business Administration (Banking, Financial Services and Insurance)",
        "Bachelor of Commerce (Business Process Management)",
        "Bachelor of Business Administration (Operation and Business Process Management)",
        "Bachelor of Science (Data Analytics)",
        "Bachelor of Arts (Digital Media and Design)",
        "Bachelor of Management Studies (E-Commerce Operations)",
        "Bachelor of Business Administration (Facilities and Hygiene Management)",
        "Bachelor of Management Studies (Land Transportation)",
        "Bachelor of Science (Medical Laboratory Technology)",
        "Bachelor of Business Administration (Retail Management)",
        "Bachelor of Arts (Spanish)",
        "Bachelor of Business Administration (Automotive Retail Management)",
        "Bachelor of Business Administration (Hospital Management)",
        "Bachelor of Business Administration (Innovation and Entrepreneurship)",
        "Bachelor of Optometry",
        "Bachelor in Library Sciences",
        "Bachelor of Science (Dialysis Technology)",
        "Bachelor of Science (Emergency Medical Technology)",
        "Bachelor of Technology (Mechanical and Automation Engineering)",
        "Bachelor of Technology (Electronics and Communication Engineering)",
        "Bachelor of Technology (Computer Science Engineering)",
        "Bachelor of Technology (Mechanical Engineering)",
        "Bachelor of Technology (Tool Engineering)",
        "Bachelor of Technology (Mechatronics Engineering)",
    ],
    PostGraduate: [
      "Master of Computer Applications",
      "Master of Technology (Mechanical Engineering)",
      "Master of Technology (Tool Engineering)",
      "Master of Technology (Computer Science Engineering with Specialization in Al & ML)",
      "Master of Technology (Electronic & Communication Engineering With Specialization in IOT)",
      "Master of Technology (Mechanical Engineering with Specialization in Thermal/Production/Design)",
      "Master of Science (Medical Laboratory Sciences)",
    ],
    Doctorate: [
        "Doctor of Philosophy (Computer Science and Engineering)",
        "Doctor of Philosophy (Computer Application)",
        "Doctor of Philosophy (Mechanical Engineering/Allied Branches)",
        "Doctor of Philosophy (Electronics and Communication Engineering/Allied Branches)",
    ],
    Certificate: [
        "Certificate Course in Modern Office Management & Secretarial Practice",
    ],
};

const programTypeList = [
    "Diploma",
    "Undergraduate",
    "PostGraduate",
    "Doctorate",
    "Certificate",
];

const semesterList = ["2", "4", "6"];

export default function Registration() {
    const [selectedProgramCategory, setSelectedProgramCategory] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [studentsData, setStudentsData] = useState<Student[]>([]);
    const [campus, setCampus] = useState("");
    const [token, setToken] = useState("");
    const [showMainTable, setShowMainTable] = useState(false);
    const [showIndexTable, setShowIndexTable] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(true);
    const [indexData, setIndexData] = useState<IndexDataRow[]>([]);
    const [detailSheetOption, setDetailSheetOption] = useState('');
    const [frontSheetOption, setFrontSheetOption] = useState('');
    const frontSheetRef = useRef(null);
    const detailSheetRef = useRef(null);

    useEffect(() => {
        const dummyData = [
            { sno: 1, courseName: "Universal Human Value", courseCode: "BT-HS301", credit: 3, courseType: "CC" },
            { sno: 2, courseName: "Computer Networks", courseCode: "BT-CS-ES601", credit: 5, courseType: "CC" },
            { sno: 3, courseName: "Machine Learning", courseCode: "BT-CS-ES602", credit: 5, courseType: "CC" },
            { sno: 4, courseName: "Web Engineering", courseCode: "BT-CS-ES603", credit: 4, courseType: "CC" },
            { sno: 5, courseName: "Web Development and Tools Lab", courseCode: "BT-CS-PE606", credit: 1, courseType: "PE*" },
            { sno: 6, courseName: "Introduction to Scripting Languages", courseCode: "BT-CS-PE603", credit: 1, courseType: "PE*" },
            { sno: 7, courseName: "Spanish", courseCode: "BT-OE604", credit: 3, courseType: "OE" },
            { sno: 8, courseName: "Seminar", courseCode: "BT-SM601", credit: 1, courseType: "CC*" },
            { sno: 9, courseName: "Health and Well Being*", courseCode: "BT-AU601", credit: 0, courseType: "CC" },
        ];

        setIndexData(dummyData);
    }, []);

    useEffect(() => {
        getAuthAdmin().then(async (t: any) => {
            if (t) {
                setToken(t.value);
                const data = await parseJwt(t.value);
                setCampus(data.user.campus);
            }
        })
    }, []);

    useEffect(() => {
        if (studentsData.length > 0) {
            setShowMainTable(true);
            setShowIndexTable(true);
        } else {
            setShowMainTable(false);
            setShowIndexTable(false);
        }
    }, [studentsData]);

    const handleData = async () => {
        try {
            if (token) {
                const data: any = await fetchExamRegistrationByProgramAndSemester(token as string, campus, selectedProgramCategory, selectedProgram, selectedSemester);
                setStudentsData(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleApplyFilters = () => {
        handleData();
        setShowButtons(true);
        setShowCloseButton(true); 
    };
    const [selectedOption, setSelectedOption] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedOption(event.target.value);
        if (event.target.value === 'detailSheet') {
            handleShowMain();
        } else if (event.target.value === 'frontSheet') {
            handleShowIndex();
        }
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

    const toggleMainTable = () => {
        setShowMainTable((prevState) => !prevState);
    };

    const toggleIndexTable = () => {
        setShowIndexTable((prevState) => !prevState);
    };

    const handleShowMain = () => {
        setShowMainTable(true);
        setShowIndexTable(false);
    };

    const handleShowIndex = () => {
        setShowIndexTable(true);
        setShowMainTable(false);
    };

    const handleClose = () => {
        setShowButtons(false); 
        setShowCloseButton(false);
        setShowIndexTable(false); 
        setShowMainTable(false);
    };

    return (
        <>
        <div className="bg-[#dfdede] mt-2">
                <Head username={"Campus Director"} />
                <Nav />
        </div>
            <div className="announcement bg-dseublue py-2 px-4 rounded shadow absolute top-[100px] sm:left-[250px] left-0 right-0 z-10 mx-12 mt-6">
                <h1 className="text-2xl text-white font-bold text-center">Registration Chart</h1>
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
                            {programTypeList.map((category, index) => (
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
                            disabled={!selectedProgramCategory}
                        >
                            {programListByType[selectedProgramCategory]?.map((program, index) => (
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
                            disabled={!selectedProgram}
                        >
                            {semesterList.map((semester, index) => (
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
                        disabled={!selectedProgram || !selectedProgramCategory || !selectedSemester}
                    >
                        Apply
                    </Button>
                </div>
            </div>
            {showButtons && (
                <div className="announcement bg-white py-2 px-4 rounded shadow absolute top-[400px] sm:left-[250px] left-0 right-0 z-10 mx-12 mt-6">
                    <div className="flex justify-center my-4">
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#ffffff', color: '#1a4876' }}
                            onClick={handleShowMain}
                            className="mr-4  hover:bg-gray-200"
                        >
                            Show Main
                        </Button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#ffffff', color: '#1a4876' }}
                            onClick={handleShowIndex}
                            className="mr-4  hover:bg-gray-200"
                        >
                            Show Front
                        </Button>
                    </div>
                {showCloseButton && (
                    <div className="flex justify-center mt-4">
                    <Button color="primary" onClick={handleClose}>
                        Close
                    </Button>
                    </div>
                )}
                </div>
            )}

            {showMainTable && (
                <div className="py-2 px-4 rounded shadow absolute top-[550px] sm:left-[250px] left-0 right-0 z-10 mx-12 mt-6">
                    <ReactToPrint
                    trigger={() => <Button variant="contained" color="primary">Print Detailed Sheet</Button>}
                    content={() => detailSheetRef.current}
                />
                <div ref={detailSheetRef} className="detail-sheet">
                    <div className="announcement bg-white py-2 px-4 rounded shadow ">

                        <TableContainer component={Paper} className="mt-5">
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center' style={{ border: '1px solid black' }}>Sno</TableCell>
                                        <TableCell align='center' style={{ border: '1px solid black' }}>Details</TableCell>
                                        <TableCell align='center' style={{ border: '1px solid black' }}>Course Codes</TableCell>
                                        <TableCell align='center' style={{ border: '1px solid black' }}>Signature</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {studentsData.map((student, index) => (
                                        <TableRow key={index} sx={{}}>
                                            <TableCell align='center' component="th" scope="row" style={{ border: '1px solid black' }}>{index + 1}</TableCell>
                                            <TableCell align='center' style={{ border: '1px solid black' }}>{student.name}<br />{student.rollno}</TableCell>
                                            <TableCell style={{ border: '1px solid black' }}>
                                                <div className="flex flex-wrap p-2">
                                                    {student.course_codes.slice(0, 7).map((code, codeIndex) => (
                                                        <div key={codeIndex} style={{ width: '14.28%', textAlign: 'center' }}>
                                                            {code}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap">
                                                    {student.course_codes.slice(7).map((code, codeIndex) => (
                                                        <div key={codeIndex} style={{ width: '14.28%', textAlign: 'center' }}>
                                                            {code}
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell style={{ border: '1px solid black' }}></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <style jsx global>{`
                                        @media print {
                                            .front-sheet {
                                                width: 100%;
                                                height: 100%;
                                                display: flex;
                                                flex-direction: column;
                                                align-items: center;
                                                justify-content: center;
                                                page-break-before: always;
                                            }

                                            .front-sheet * {
                                                margin: 0;
                                                padding: 0;
                                            }

                                            .front-sheet table {
                                                width: 100%;
                                                border-collapse: collapse;
                                            }

                                            .front-sheet td, .front-sheet th {
                                                border: 1px solid #000;
                                                padding: 8px;
                                                text-align: center;
                                            }

                                            .front-sheet .landscape {
                                                width: 100%;
                                                height: 100%;
                                                display: flex;
                                                flex-direction: row;
                                                align-items: center;
                                                justify-content: center;
                                                page-break-before: always;
                                            }

                                            .front-sheet .landscape * {
                                                margin: 0;
                                                padding: 0;
                                            }

                                            .front-sheet .landscape table {
                                                width: 100%;
                                                border-collapse: collapse;
                                            }

                                            .front-sheet .landscape td, .front-sheet .landscape th {
                                                border: 1px solid #000;
                                                padding: 8px;
                                                text-align: center;
                                            }
                                        }
                                    `}</style>
                    </div>
                </div>
            )}
            {showIndexTable && (
                <div className="announcement bg-white py-2 px-4 rounded shadow absolute top-[500px] sm:left-[250px] left-0 right-0 z-10 mx-12 mt-6 ">
                    <ReactToPrint
                        trigger={() => <Button variant="contained" color="primary">Print Front Sheet</Button>}
                        content={() => frontSheetRef.current}
                    />
                    <div ref={frontSheetRef} className="front-sheet">
                        <Typography className="mt-4 mb-4" variant="h4" component="div" align="center" gutterBottom>
                            <br/>Exam Registration Chart
                        </Typography>
                        <div className="flex justify-between mx-12 mt-20">
                            <div className="text-xl px-6 py-12 mt-12">
                                <p><br/><br/></p>
                                <p><strong>Exam date : </strong> ___________________</p><br/>
                                <p><strong>Campus : </strong> GB Pant DSEU Okhla Campus 1</p><br/>
                                <p><strong>Program Category : </strong>UG</p><br/>
                                <p><strong>Program : </strong>B.Tech in CSE</p><br/>
                                <p><strong>Semester : </strong>6</p><br/><br/><br/>
                            </div>
                            <Image className="" height={400} width={300} src={logo} alt="DSEU Logo" />
                        </div>
                        <div className="mt-20 overflow-x-auto">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="font-bold">S.No</TableCell>
                                            <TableCell className="font-bold">Course Name</TableCell>
                                            <TableCell className="font-bold">Course Code</TableCell>
                                            <TableCell className="font-bold">Credit</TableCell>
                                            <TableCell className="font-bold">Type of Course</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {indexData.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.sno}</TableCell>
                                                <TableCell>{row.courseName}</TableCell>
                                                <TableCell>{row.courseCode}</TableCell>
                                                <TableCell>{row.credit}</TableCell>
                                                <TableCell>{row.courseType}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <style jsx global>{`
                                        @media print {
                                            .front-sheet {
                                                width: 100%;
                                                height: 100%;
                                                display: flex;
                                                flex-direction: column;
                                                align-items: center;
                                                justify-content: center;
                                                page-break-before: always;
                                            }

                                            .front-sheet * {
                                                margin: 0;
                                                padding: 0;
                                            }

                                            .front-sheet table {
                                                width: 100%;
                                                border-collapse: collapse;
                                            }

                                            .front-sheet td, .front-sheet th {
                                                border: 1px solid #000;
                                                padding: 8px;
                                                text-align: center;
                                            }

                                            .front-sheet .landscape {
                                                width: 100%;
                                                height: 100%;
                                                display: flex;
                                                flex-direction: row;
                                                align-items: center;
                                                justify-content: center;
                                                page-break-before: always;
                                            }

                                            .front-sheet .landscape * {
                                                margin: 0;
                                                padding: 0;
                                            }

                                            .front-sheet .landscape table {
                                                width: 100%;
                                                border-collapse: collapse;
                                            }

                                            .front-sheet .landscape td, .front-sheet .landscape th {
                                                border: 1px solid #000;
                                                padding: 8px;
                                                text-align: center;
                                            }
                                        }
                                    `}</style>
                        </div>

                </div>
            )}
    </>
 );
}