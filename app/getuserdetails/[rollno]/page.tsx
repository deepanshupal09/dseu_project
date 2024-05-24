"use client";
import React, { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import GeneralDetails from "./GeneralDetails";
import CollegeDetails, { ProgramListByType } from "./CollegeDetails";
import FamilyDetails from "./FamilyDetails";
import UploadDetails from "./UploadDetails";
import IDDetails from "./IDDetails";
import LinearProgress from "@mui/joy/LinearProgress";
import { redirect, usePathname } from "next/navigation";
import { Alert, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { login, signup } from "@/app/actions/api";
import { deleteSignupCookie } from "@/app/actions/cookie";
import Final from "./Final";
import PreviewPage from "./Preview";
import { useParams } from "next/navigation";
import { useData } from "@/contexts/DataContext";

export const campusList = [
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

export const programListByType:ProgramListByType = {
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
    "Diploma in Pharamacy",
    "Diploma in Printing Technology",
    "Diploma in Tool and Die Making",
    "Diploma in Artificial Intelligence and Machine Learning",
    "Diploma in Robotic and Process Automation",
    "Diploma in Electical Engineering - Part Time",
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

export const programTypeList = [
  "Diploma",
  "Undergraduate",
  "PostGraduate",
  "Doctorate",
  "Certificate",
];

export default function Home({params}:{params: {rollno: string}}) {
  const [step, setStep] = useState<number>(1);
  const [newpass, setNewpass] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [emailid, setEmailid] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [alternatePhone, setAlternatePhone] = useState<string>("");
  const [college, setCollege] = useState<string>("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [fatherName, setFatherName] = useState<string>("");
  const [motherName, setMotherName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [programType, setProgramType] = useState<string>("Undergraduate");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [aadharCard, setAadharCard] = useState<string>("");
  const [abcId, setAbcId] = useState<string>("");
  const [yearOfAdmission, setYearOfAdmission] = useState<number>(2021);
  const [photo, setPhoto] = useState<string>("");
  const [pwbdCertificate, setPwbdCertificate] = useState<string>("");
  const [isPwbd, setIsPwbd] = useState<boolean>(false);
  const [photoObject, setPhotoObject] = useState<File | null>(null);
  const [certificateObject, setCertificateObject] = useState<File | null>(null);

  const [singleParentGuardian, setSingleParentGuardian] =
    useState<boolean>(false);
  const [parentRelation, setParentRelation] = useState<string>("");
  const [singleParentGuardianName, setSingleParentGuardianName] =
    useState<string>("");

  // const pathname = usePathname();
  const router = useRouter();
  const rollno = params.rollno;
  // const rollno = pathname.split("/")[2];
  // const params = useParams();
  // const rollno = params.rollno;

  const {data} = useData()
  console.log("data: ", data);

  const handleBackToLogin = () => {
    deleteSignupCookie();
    router.push("/");
  };

  const handleNext = async () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
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
        phone: string;
        alternate_phone: string | null;
        guardian: string | null;
        rollno: string;
        password: string;
        program_type: string;
        photo: string;
        pwbd_certificate: string;
        date_of_birth: string;
        aadhar: string;
        abc_id: string;
        year_of_admission: number;
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
        pwbd_certificate: pwbdCertificate,
        date_of_birth: dateOfBirth,
        aadhar: aadharCard,
        abc_id: abcId,
        year_of_admission: yearOfAdmission,
      };

      // const requestOptions =;



      try {
        setLoading(true);
        const response: any = await signup(body);
        // deleteSignupCookie();
        setLoading(false);
        setStep(step+1);
        // router.push("/");
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

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };


  // const programList = [
  //   "Diploma in Applied Arts",
  //   "Diploma in Architecture",
  //   "Diploma in Automobile Engineering",
  //   "Diploma in Chemical Engineering",
  //   "Diploma in Civil Engineering",
  //   "Diploma in Computer Engineering",
  //   "Diploma in Cosmetology & Health",
  //   "Diploma in Electrical Engineering",
  //   "Diploma in Electronic Engineering",
  //   "Diploma in Fashion Design",
  //   "Diploma in Fashion Design and Garment Technology",
  //   "Diploma in Interior Design",
  //   "Diploma in Mechanical Engineering",
  //   "Diploma in Pharamacy",
  //   "Diploma in Printing Technology",
  //   "Diploma in Tool and Die Making",
  //   "Diploma in Artificial Intelligence and Machine Learning",
  //   "Diploma in Robotic and Process Automation",
  //   "Diploma in Electical Engineering - Part Time",
  //   "Diploma in Mechanical Engineering - Part Time",
  //   "Diploma in Automobile Engineering - Part Time",
  //   "Diploma in Civil Engineering - Part Time",
  //   "B.A. in Aesthetics & Beauty Therapy",
  //   "B.Sc. in Aesthetics & Beauty Therapy",
  //   "Bachelor of Computer Application",
  //   "BBA in Banking, Financial Services and Insurance",
  //   "B.Com. in Bussiness Process Management",
  //   "BBA in Operation & Bussiness Process Management",
  //   "B.Sc. in Data Analytics",
  //   "B.A. in Digital Media and Design",
  //   "BMS in E-Commerce Operations",
  //   "BBA in Facilities and Hygiene Management",
  //   "BMS in Land Transportation",
  //   "B.Sc. in Medical Laboratory Technology",
  //   "BBA in Retail Management",
  //   "B.A. in Spanish",
  //   "BBA in Automotive Retail Management",
  //   "BBA in Hospital Management",
  //   "BBA in Innovation and Entrepreneurship",
  //   "Bachelors in Optometry",
  //   "Bachelors in Library Science",
  //   "B.Sc. in Dialysis Technology",
  //   "B.Sc. in Emergency Medical Technology",
  //   "B.Tech. in Mechanical and Automation Engineering",
  //   "B.Tech. in Electronics & Communication Engineering",
  //   "B.Tech. in Computer Science Engineering",
  //   "B.Tech. in Mechanical Engineering",
  //   "B.Tech. in Tool Engineering",
  //   "B.Tech. in Mechatronics Engineering",
  //   "Masters in Computer Application",
  //   "M.Tech. in Mechanical Engineering",
  //   "M.Tech. in Mechanical Engineering with Specialization in Thermal/ Production/ Design",
  //   "M.Tech. in Tool Engineering",
  //   "M.Tech. in Computer science Engineering with Specialization in Al & ML",
  //   "M.Tech. in Electronic & Communication Engineering With Specialization in IOT",
  //   "M.Sc. in Medical Laboratory Sciences",
  //   "Ph. D. in Computer Science and Engineering",
  //   "Ph. D. in Computer Application",
  //   "Ph. D. in Mechanical Engineering/ Allied Branches",
  //   "Ph. D. in Electronics and Communication Engineering/ Allied Branches",
  //   "Certificate Course in Modern Offcie Management & Secreterial Practice",
  // ];

 
  


  const semesterList = ["Semester 2", "Semester 4", "Semester 6"];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {step < 7 && (
        <div className="absolute top-0 p-4 mb-4 w-full">
          <LinearProgress determinate value={step * 16.7} />
        </div>
      )}

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
            semester={semester}
            college={college}
            programtype={programType}
            program={program}
            onNext={handleNext}
            onPrevious={handlePrevious}
            campusList={campusList}
            programListByType={programListByType}
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
            photoObject={photoObject}
            setPhotoObject={setPhotoObject}
            certificateObject={certificateObject}
            setCertificateObject={setCertificateObject}
          />
        )}
        {step === 7 && (
          <PreviewPage
            rollNo={rollno}
            email={emailid}
            gender={gender}
            phone={phone}
            altPhone={alternatePhone}
            programCategory={programType}
            campus={college}
            program={program}
            semester={semester}
            fatherName={fatherName}
            motherName={motherName}
            singleParentGuardian={singleParentGuardian}
            singleParentGuardianName={singleParentGuardianName}
            parentRelation={parentRelation}
            dateOfBirth={dateOfBirth}
            aadharCard={aadharCard}
            abcId={abcId}
            yearOfAdmission={yearOfAdmission}
            photo={photo}
            pwbdCertificate={pwbdCertificate}
            onPrevious={handlePrevious}
            onSubmit={handleNext}
          />
        )}
        {step === 8 && <Final onBackToLogin={handleBackToLogin} />}
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
