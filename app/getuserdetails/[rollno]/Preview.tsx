import React from "react";

interface PreviewProps {
  rollNo: string;
  email: string;
  gender: string;
  phone: string;
  altPhone: string;
  programCategory: string;
  campus: string;
  program: string;
  semester: string;
  fatherName: string;
  motherName: string;
  singleParentGuardian: boolean;
  parentRelation?: string;
  dateOfBirth: string;
  aadharCard: string;
  abcId: string;
  yearOfAdmission: number;
  photo: File | null;
  pwbdCertificate : File | null;
  onPrevious: () => void;
  onSubmit: () => void;
}

const Preview: React.FC<PreviewProps> = ({
  rollNo,
  email,
  gender,
  phone,
  altPhone,
  programCategory,
  campus,
  program,
  semester,
  fatherName,
  motherName,
  singleParentGuardian,
  parentRelation,
  dateOfBirth,
  aadharCard,
  abcId,
  yearOfAdmission,
  photo,
  pwbdCertificate,
  onPrevious,
  onSubmit,
}) => {
  return (
    <div>
      <h2>Preview Your Information</h2>
      <div>
        <p>Roll Number: {rollNo}</p>
        <p>Email: {email}</p>
        <p>Gender: {gender}</p>
        <p>Phone: {phone}</p>
        <p>Alternate Phone: {altPhone}</p>
        <p>Program Category: {programCategory}</p>
        <p>Campus: {campus}</p>
        <p>Program: {program}</p>
        <p>Semester: {semester}</p>
        <p>Father's Name: {fatherName}</p>
        <p>Mother's Name: {motherName}</p>
        <p>Single Parent/Guardian: {singleParentGuardian ? "Yes" : "No"}</p>
        {singleParentGuardian && <p>Parent's Relation: {parentRelation}</p>}
        <p>Date of Birth: {dateOfBirth}</p>
        <p>Aadhar Card: {aadharCard}</p>
        <p>ABC ID: {abcId}</p>
        <p>Year of Admission: {yearOfAdmission}</p>
        <p>Photo:</p>
        {photo && <img src={URL.createObjectURL(photo)} alt="User" />}
        <p>PwBD Certificate:</p>
        {pwbdCertificate && <img src={URL.createObjectURL(pwbdCertificate)} alt="User" />}
      </div>
      <button onClick={onPrevious}>Edit</button>
      <button onClick={onSubmit}>Confirm</button>
    </div>
  );
};

export default Preview;
