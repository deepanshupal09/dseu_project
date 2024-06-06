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

export default function Home({ params }: { params: { rollno: string } }) {
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
  const [programType, setProgramType] = useState<string>("");
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

  const { data } = useData();

  useEffect(()=>{
    
  },[semester])
  

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
        semester: parseInt(semester),
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
        setStep(step + 1);
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
