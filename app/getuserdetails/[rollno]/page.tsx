"use client";
import React, { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import GeneralDetails from "./GeneralDetails";
import CollegeDetails from "./CollegeDetails";
import FamilyDetails from "./FamilyDetails";
import LinearProgress from "@mui/joy/LinearProgress";
import { redirect, usePathname } from "next/navigation";
import { Alert, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";

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

  const [singleParentGuardian, setSingleParentGuardian] =
    useState<boolean>(false);
  const [parentRelation, setParentRelation] = useState<string>("");
  const [singleParentGuardianName, setSingleParentGuardianName] =
    useState<string>("");

  const pathname = usePathname();
  const rollno = pathname.split("/")[2];

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      console.log("Father's Name:", fatherName);
      console.log("Mother's Name:", motherName);
      console.log("Single Parent/Guardian:", singleParentGuardian);
      if (singleParentGuardian) {
        console.log("Single Parent/Guardian Name:", singleParentGuardianName);
        console.log("Parent's Relation:", parentRelation);
      }
      let father = null,
        mother = null,
        guardian = null;
      if (singleParentGuardian) {
        if (parentRelation === "father") father = singleParentGuardianName;
        else if (parentRelation === "mother") mother = singleParentGuardianName;
        else guardian = singleParentGuardianName;
      } else {
        father = fatherName;
        mother = motherName;
        // guardian=null;
      }
      interface BodyType {
        program: string | null;
        semester: number;
        father: string | null;
        mother: string | null;
        campus: string;
        emailid: string;
        gender: string;
        alternate_phone: string | null;
        guardian: string | null;
        rollno: string;
        password: string;
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
      };
      // console.log(body)
      console.log(101, JSON.stringify(body));
      // const requestOptions =;

      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/signup", {
          method: "POST",
          mode: "cors",
          headers: {},
          body: JSON.stringify(body),
        });
        setLoading(false);

        if (!response.ok) {
          setOpen(true);
          console.log("error: ", response);
          return;
        }
        console.log(response);
        router.push("/dashboard");
      } catch (error) {
        setLoading(false);
        setOpen(true);
        return;
      }
    }
  };
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // useEffect(() => {
  //   console.log("rollno ", rollno)
  // })

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
    "Ambedkar DSEU Shakarpur Campus I",
    "Bhai Parmanand DSEU Shakarpur Campus II",
    "Dr. H.J. Bhabha DSEU Mayur Vihar Campus",
    "DSEU Vivek Vihar Campus",
    "Aryabhatt DSEU Ashok Vihar Campus",
    "DSEU Wazirpur-I Campus",
    "Guru Nanak Dev DSEU Rohini Campus",
    "Kasturba DSEU Pitampura Campus",
    "Sir C.V. Raman DSEU Dheerpur Campus",
    "G.B. Pant DSEU Okhla-I Campus",
    "CHAMPS DSEU Okhla II Campus",
    "DSEU Okhla-II Campus",
    "GB Pant DSEU Okhla-III Campus",
    "DSEU Siri Fort Campus",
    "Meerabai DSEU Maharani Bagh Campus",
    "DSEU Dwarka Campus",
    "DSEU Pusa Campus I",
    "DSEU Pusa Campus II",
    "DSEU Rajokri Campus",
    "DSEU Ranhola Campus",
    "DSEU Jaffarpur Campus",
  ];
  const programList = [
    "Bachelor of Arts (BA)",
    "Bachelor of Science (BSc)",
    "Bachelor of Commerce (BCom)",
    "Bachelor of Technology (B.Tech)",
    "Bachelor of Technology (B.Tech) in Computer Science",
    "Bachelor of Technology (B.Tech) in Electrical Engineering",
    "Master of Arts (MA)",
    "Master of Science (MSc)",
    "Master of Commerce (MCom)",
    "Master of Business Administration (MBA)",
    "Master of Business Administration (MBA) in Finance",
    "Master of Business Administration (MBA) in Marketing",
    "Diploma in Engineering",
    "Diploma in Management",
    "Diploma in Computer Applications",
    "Diploma in Pharmacy",
  ];
  const semesterList = ["Semester 2", "Semester 4", "Semester 6"];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="absolute top-0 p-4 mb-4 w-full">
        <LinearProgress determinate value={step * 25} />{" "}
        {/* Adjust the progress based on the number of pages */}
      </div>
      <div className="my-auto">
        {step === 1 && (
          <ChangePassword setnewpassword={setNewpass} onNext={handleNext} />
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
            setsemester={setSemester}
            setprogram={setProgram}
            setcollege={setCollege}
          />
        )}
        {step === 4 && ( // Add this condition for the new FamilyDetails component
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
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
