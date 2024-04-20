"use client";
import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import GeneralDetails from "./GeneralDetails";
import CollegeDetails from "./CollegeDetails";
import FamilyDetails from "./FamilyDetails";
import LinearProgress from "@mui/joy/LinearProgress";

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
  const [semester, setSemester] = useState(null);
  const [fatherName, setFatherName] = useState<string>("");
  const [motherName, setMotherName] = useState<string>("");
  const [singleParentGuardian, setSingleParentGuardian] =
    useState<boolean>(false);
  const [parentRelation, setParentRelation] = useState<string>("");
  const [singleParentGuardianName, setSingleParentGuardianName] =
    useState<string>("");
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
          <ChangePassword
            newpassword={newpass}
            confirm={confirm}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <GeneralDetails
            emailid={emailid}
            gen={gender}
            phoneno={phone}
            altphone={alternatePhone}
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
          />
        )}
        {step === 4 && ( // Add this condition for the new FamilyDetails component
          <FamilyDetails
            fathername={fatherName}
            mothername={motherName}
            spg={singleParentGuardian}
            parrel={parentRelation}
            spgname={singleParentGuardianName}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </div>
  );
}
