"use client";
import React, { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import GeneralDetails from "./GeneralDetails";
import CollegeDetails from "./CollegeDetails";
import FamilyDetails from "./FamilyDetails";
import UploadDetails from "./UploadDetails";
import IDDetails from "./IDDetails";
import LinearProgress from "@mui/joy/LinearProgress";
import { redirect, usePathname } from "next/navigation";
import { Alert, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { login, signup } from "@/app/actions/api";
import { deleteSignupCookie } from "@/app/actions/cookie";

export default function Home() {
    const [step, setStep] = useState<number>(1);
    const [newpass, setNewpass] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");
    const [emailid, setEmailid] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [alternatePhone, setAlternatePhone] = useState<string>("");
    const [college, setCollege] = useState<string>("");
    const [program, setProgram] = useState(null);
    const [semester, setSemester] = useState("Semester 1");
    const [fatherName, setFatherName] = useState<string>("");
    const [motherName, setMotherName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [programType, setProgramType] = useState<string>("");
    const [dateOfBirth, setDateOfBirth] = useState<string>("");
    const [aadharCard, setAadharCard] = useState<string>("");
    const [abcId, setAbcId] = useState<string>("");
    const [yearOfAdmission, setYearOfAdmission] = useState<number>(2021);
    const [photo, setPhoto] = useState<string>("");
    const [pwbdCertificate, setPwbdCertificate] = useState<string>("");
    const [isPwbd, setIsPwbd] = useState<boolean>(false);

    const [singleParentGuardian, setSingleParentGuardian] =
        useState<boolean>(false);
    const [parentRelation, setParentRelation] = useState<string>("");
    const [singleParentGuardianName, setSingleParentGuardianName] =
        useState<string>("");

    const pathname = usePathname();
    const router = useRouter();
    const rollno = pathname.split("/")[2];

    const handleNext = async () => {
        if (step < 6) {
            setStep(step + 1);
            console.log(step, "step");
        } else {
            console.log("Father's Name:", fatherName);
            console.log("Mother's Name:", motherName);
            console.log("Single Parent/Guardian:", singleParentGuardian);
            if (singleParentGuardian) {
                console.log(
                    "Single Parent/Guardian Name:",
                    singleParentGuardianName
                );
                console.log("Parent's Relation:", parentRelation);
            }
            let father = null,
                mother = null,
                guardian = null;
            if (singleParentGuardian) {
                if (parentRelation === "father")
                    father = singleParentGuardianName;
                else if (parentRelation === "mother")
                    mother = singleParentGuardianName;
                else guardian = singleParentGuardianName;
            } else {
                father = fatherName;
                mother = motherName;
                // guardian=null;
            }
            console.log("phto: ", photo);
            interface BodyType {
                program: string | null;
                semester: number;
                father: string | null;
                mother: string | null;
                campus: string;
                emailid: string;
                gender: string;
                phone: string;
                alternate_phone: string | null;
                guardian: string | null;
                rollno: string;
                password: string;
                program_type: string;
                photo: string;
                pwbdCertificate: string;
                dateOfBirth: string;
                aadharCard: string;
                abcId: string;
                yearOfAdmission: number;
            }
            const body: BodyType = {
                program: program,
                semester: parseInt(semester.split(" ")[1]),
                father: father,
                mother: mother,
                campus: college,
                emailid: emailid,
                gender: gender,
                alternate_phone: alternatePhone === "" ? null : alternatePhone,
                guardian: guardian,
                rollno: rollno,
                password: newpass,
                phone: phone,
                program_type: programType,
                photo: photo,
                pwbdCertificate: pwbdCertificate,
                dateOfBirth: dateOfBirth,
                aadharCard: aadharCard,
                abcId: abcId,
                yearOfAdmission: yearOfAdmission,
            };
            console.log(123, body);
            // console.log(101, JSON.stringify(body));
            // const requestOptions =;

            // try {
            //   setLoading(true);
            //   console.log("here")
            //   const response: any = await signup(body);
            //   console.log("response: ", response);
            //   deleteSignupCookie();
            //   setLoading(false);
            //   // router.push("/");
            // } catch (error) {
            //   console.log("error", error);
            //   setLoading(false);
            //   setOpen(true);
            //   return;
            // }
        }
    };
    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const campusList = [
        "Arybhatt DSEU Ashok Vihar Campus",
        "Ambedkar DSEU Shakarpur Campus-I",
        "DSEU Okhla II Campus",
        "G.B. Pant DSEU Okhla I Campus",
        "Guru Nanak Dev DSEU Rohini Campus",
        "DSEU Dwarka Campus",
        "Kasturba DSEU Pitampura Campus",
        "Meerabai DSEU Maharani Bagh Campus",
        "DSEU Pusa Campus - I",
        "DSEU Rajokri Campus",
        "DSEU Sirifort Campus",
        "DSEU Wazirpur-I Campus",
        "Dr.H.J. Bhabha DSEU Mayur Vihar Campus",
        "DSEU Ranhola Campus",
        "G.B. Pant DSEU Okhla III Campus",
        "DSEU Jaffarpur Campus",
        "Bhai Parmanand DSEU Shakarpur II Campus",
        "DSEU Pusa II Campus",
        "DSEU Champs okhla II Campus",
        "Sir C.V. Raman DSEU Dheerpur Campus",
        "DSEU Vivek vihar Campus",
    ];
    const programList = [
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
        "Diploma in Pharamacy",
        "Diploma in Printing Technology",
        "Diploma in Tool and Die Making",
        "Diploma in Artificial Intelligence and Machine Learning",
        "Diploma in Robotic and Process Automation",
        "Diploma in Electical Engineering - Part Time",
        "Diploma in Mechanical Engineering - Part Time",
        "Diploma in Automobile Engineering - Part Time",
        "Diploma in Civil Engineering - Part Time",
        "B.A. in Aesthetics & Beauty Therapy",
        "B.Sc. in Aesthetics & Beauty Therapy",
        "B.A. in Aesthetics & Beauty Therapy",
        "Bachelor of Computer Application",
        "BBA in Banking, Financial Services and Insurance",
        "B.Com. in Bussiness Process Management",
        "BBA in Operation & Bussiness Process Management",
        "B.Sc. in Data Analytics",
        "B.A. in Digital Media and Design",
        "BMS in E-Commerce Operations",
        "BBA in Facilities and Hygiene Management",
        "BMS in Land Transportation",
        "B.Sc. in Medical Laboratory Technology",
        "BBA in Retail Management",
        "B.A. in Spanish",
        "BBA in Automotive Retail Management",
        "BBA in Hospital Management",
        "BBA in Innovation and Entrepreneurship",
        "Bachelors in Optometry",
        "Bachelors in Library Science",
        "B.Sc. in Dialysis Technology",
        "B.Sc. in Emergency Medical Technology",
        "B.Tech. in Mechanical and Automation Engineering",
        "B.Tech. in Electronics & Communication Engineering",
        "B.Tech. in Computer Science Engineering",
        "B.Tech. in Mechanical Engineering",
        "B.Tech. in Tool Engineering",
        "B.Tech. in Mechatronics Engineering",
        "Masters in Computer Application",
        "M.Tech. in Mechanical Engineering",
        "M.Tech. in Mechanical Engineering with Specialization in Thermal/ Production/ Design",
        "M.Tech. in Tool Engineering",
        "M.Tech. in Computer science Engineering with Specialization in Al & ML",
        "M.Tech. in Electronic & Communication Engineering With Specialization in IOT",
        "M.Sc. in Medical Laboratory Sciences",
        "Ph. D. in Computer Science and Engineering",
        "Ph. D. in Computer Application",
        "Ph. D. in Mechanical Engineering/ Allied Branches",
        "Ph. D. in Electronics and Communication Engineering/ Allied Branches",
        "Certificate Course in Modern Offcie Management & Secreterial Practice",
    ];

    const programTypeList = [
        "Diploma",
        "Undergraduate",
        "Post Graduate",
        "Doctorate",
        "Certificate",
    ];
    const semesterList = ["Semester 2", "Semester 4", "Semester 6"];

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="absolute top-0 p-4 mb-4 w-full">
                <LinearProgress determinate value={step * 16.7} />{" "}
            </div>
            <div className="my-auto">
                {step === 1 && (
                    <ChangePassword
                        setnewpassword={setNewpass}
                        onNext={handleNext}
                    />
                )}
                {step === 2 && (
                    <GeneralDetails
                        emailid={emailid}
                        gen={gender}
                        phoneno={phone}
                        altphone={alternatePhone}
                        setemailid={setEmailid}
                        setgender={setGender}
                        setphone={setPhone}
                        setaltphone={setAlternatePhone}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )}
                {step === 3 && (
                    <CollegeDetails
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        campusList={campusList}
                        programList={programList}
                        semesterList={semesterList}
                        programTypeList={programTypeList}
                        setprogramtype={setProgramType}
                        setsemester={setSemester}
                        setprogram={setProgram}
                        setcollege={setCollege}
                    />
                )}
                {step === 4 && (
                    <FamilyDetails
                        fathername={fatherName}
                        mothername={motherName}
                        spg={singleParentGuardian}
                        parrel={parentRelation}
                        spgname={singleParentGuardianName}
                        setfathername={setFatherName}
                        setmothername={setMotherName}
                        setspg={setSingleParentGuardian}
                        setparrel={setParentRelation}
                        setspgname={setSingleParentGuardianName}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                    />
                )}
                {step === 5 && (
                    <IDDetails
                        abcId={abcId}
                        setAbcId={setAbcId}
                        dateOfBirth={dateOfBirth}
                        setDateOfBirth={setDateOfBirth}
                        aadharCard={aadharCard}
                        setAadharCard={setAadharCard}
                        yearOfAdmission={yearOfAdmission}
                        setYearOfAdmission={setYearOfAdmission}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )}
                {step === 6 && (
                    <UploadDetails
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        photo={photo}
                        pwbdCertificate={pwbdCertificate}
                        isPwbd={isPwbd}
                        setPhoto={setPhoto}
                        setPwbdCertificate={setPwbdCertificate}
                        setIsPwbd={setIsPwbd}
                        rollno={rollno}
                    />
                )}
            </div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Internal Server Error
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
