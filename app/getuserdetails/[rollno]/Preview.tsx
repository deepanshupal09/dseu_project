import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface PreviewProps {
  name: string;
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
  yearOfAdmission: Number;
  photo: string;
  pwbdCertificate: string | null;
  onPrevious: () => void;
  onSubmit: () => void;
}

export default function PreviewPage({
  name,
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
}: PreviewProps) {
  const [confirmSubmission, setConfirmSubmission] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    name: false,
    rollNo: false,
    email: false,
    gender: false,
    phone: false,
    altPhone: false,
    programCategory: false,
    campus: false,
    program: false,
    semester: false,
    fatherName: false,
    motherName: false,
    singleParentGuardian: false,
    parentRelation: false,
    dateOfBirth: false,
    aadharCard: false,
    abcId: false,
    yearOfAdmission: false,
    photo: false,
    pwbdCertificate: false,
  });

  console.log("photo: ", photo)

  const allClear = Object.values(checkboxes).every((v) => !v);

  const handleCheckboxChange = (field: keyof typeof checkboxes) => {
    setCheckboxes({
      ...checkboxes,
      [field]: !checkboxes[field],
    });
  };

  const handleConfirmClick = () => {
    const allChecked = Object.values(checkboxes).every((checked) => checked);

    if (allChecked) {
      setConfirmSubmission(true);
    } else {
      alert("Please check all fields before confirming.");
    }
  };

  return (
    <div className="p-10 w-full ml-60 mr-60 bg-white shadow-md rounded-lg lg:w-full mx-auto">
      <h2 className="text-2xl font-bold mb-12 mt-12 text-left ml-4">
        Preview Your Information
      </h2>
      <table className="w-full mt-2  table-auto mr-6">
        <tbody className="divide-y divide-gray-200">
          <tr className="">
            <td className="px-6 py-4 font-semibold">Name:</td>
            <td className="px-6 py-4">{name}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Roll Number:</td>
            <td className="px-6 py-4">{rollNo}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Email: </td>
            <td className="px-6 py-4">{email}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Gender: </td>
            <td className="px-6 py-4">{gender}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Phone: </td>
            <td className="px-6 py-4">{phone}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Alternate Phone: </td>
            <td className="px-6 py-4">{altPhone}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Program Category: </td>
            <td className="px-6 py-4">{programCategory}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Campus: </td>
            <td className="px-6 py-4">{campus}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Program: </td>
            <td className="px-6 py-4">{program}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Semester: </td>
            <td className="px-6 py-4">{semester}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Father's Name: </td>
            <td className="px-6 py-4">{fatherName}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Mother's Name: </td>
            <td className="px-6 py-4">{motherName}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Single Parent/Guardian:</td>
            <td className="px-6 py-4">{singleParentGuardian ? "Yes" : "No"}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          {singleParentGuardian && (
            <tr>
              <td className="px-6 py-4 font-semibold">Parent's Relation:</td>
              <td className="px-6 py-4">{parentRelation}</td>
              <td className="px-2 py-4 scale-200">
                <input type="checkbox" style={{ cursor: "pointer" }} />
              </td>
            </tr>
          )}
          <tr>
            <td className="px-6 py-4 font-semibold">Date of Birth: </td>
            <td className="px-6 py-4">{dateOfBirth}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Aadhar Card: </td>
            <td className="px-6 py-4">{aadharCard}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">ABC ID: </td>
            <td className="px-6 py-4">{abcId}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Year of Admission: </td>
            <td className="px-6 py-4">{yearOfAdmission}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Photo:</td>
            <td className="px-6 py-4">
              {photo && (
                <img
                  className="w-24 h-24 object-cover"
                  src={"file://"+photo}
                  alt="User"
                />
              )}
            </td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">PwBD Certificate:</td>
            <td className="px-6 py-4">
              {pwbdCertificate && (
                <img
                  className="w-24 h-24 object-cover"
                  src={"file://"+pwbdCertificate}
                  alt="User"
                />
              )}
            </td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-between w-full mt-6">
        <button
          className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
          style={{ marginRight: "8px" }}
          onClick={onPrevious}
        >
          Edit
        </button>
        <button
          className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold hover:bg-gray-800 focus:bg-gray-800"
          style={{ marginRight: "8px" }}
          onClick={handleConfirmClick}
          disabled={!allClear}
        >
          Confirm
        </button>
      </div>
      <Dialog
        open={confirmSubmission}
        onClose={() => setConfirmSubmission(false)}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to submit the details?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onSubmit} color="primary">
            Submit
          </Button>
          <Button onClick={() => setConfirmSubmission(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
