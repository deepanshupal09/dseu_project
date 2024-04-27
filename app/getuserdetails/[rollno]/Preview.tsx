import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

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
  yearOfAdmission: Number;
  photo: string;
  pwbdCertificate: string;
  onPrevious: () => void;
  onSubmit: () => void;
}

export default function PreviewPage({
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
    // parentRelation: false,
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

  useEffect(()=>{
    console.log("checkboxs: ", checkboxes)
  },[checkboxes])

  const handleConfirmClick = () => {
    const allChecked = Object.values(checkboxes).every((isChecked) => isChecked);
  
    if (allChecked) {
      setConfirmSubmission(true);
    } else {
      alert("Please tick all checkboxes before confirming.");
    }
  };
  
  

  return (
    <div className="p-10 w-[80vw] max-md:w-[100vw]  bg-white shadow-md rounded-lg mx-auto">
      <h2 className="text-2xl w-full font-bold mb-12 mt-12 text-left m-4">
        Preview Your Information
      </h2>
      <table className="w-full mt-2   table-auto ">
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 font-semibold">Roll Number:</td>
            <td className="px-6 py-4">{rollNo}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
              checked={checkboxes.rollNo} 
              onChange={() => handleCheckboxChange('rollNo')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Email: </td>
            <td className="px-6 py-4">{email}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.email}
               onChange={() => handleCheckboxChange('email')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Gender: </td>
            <td className="px-6 py-4">{gender}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.gender}
               onChange={() => handleCheckboxChange('gender')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Phone: </td>
            <td className="px-6 py-4">{phone}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.phone}
               onChange={() => handleCheckboxChange('phone')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Alternate Phone: </td>
            <td className="px-6 py-4">{altPhone}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.altPhone}
               onChange={() => handleCheckboxChange('altPhone')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Program Category: </td>
            <td className="px-6 py-4">{programCategory}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.programCategory}
               onChange={() => handleCheckboxChange('programCategory')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Campus: </td>
            <td className="px-6 py-4">{campus}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.campus}
               onChange={() => handleCheckboxChange('campus')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Program: </td>
            <td className="px-6 py-4">{program}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.program}
               onChange={() => handleCheckboxChange('program')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Semester: </td>
            <td className="px-6 py-4">{semester}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.semester}
               onChange={() => handleCheckboxChange('semester')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Father's Name: </td>
            <td className="px-6 py-4">{fatherName}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.fatherName}
               onChange={() => handleCheckboxChange('fatherName')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Mother's Name: </td>
            <td className="px-6 py-4">{motherName}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.motherName}
               onChange={() => handleCheckboxChange('motherName')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Single Parent/Guardian:</td>
            <td className="px-6 py-4">{singleParentGuardian ? "Yes" : "No"}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.singleParentGuardian}
               onChange={() => handleCheckboxChange('singleParentGuardian')}/>
            </td>
          </tr>
          {singleParentGuardian && (
            <tr>
              <td className="px-6 py-4 font-semibold">Parent's Relation:</td>
              <td className="px-6 py-4">{parentRelation}</td>
              <td className="px-2 py-4 scale-200">
                <input type="checkbox" style={{ cursor: "pointer" }} 
                 checked={checkboxes.parentRelation}
                 onChange={() => handleCheckboxChange('parentRelation')}
                />
              </td>
            </tr>
          )}
          <tr>
            <td className="px-6 py-4 font-semibold">Date of Birth: </td>
            <td className="px-6 py-4">{dateOfBirth}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.dateOfBirth}
               onChange={() => handleCheckboxChange('dateOfBirth')}/>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Aadhar Card: </td>
            <td className="px-6 py-4">{aadharCard}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.aadharCard}
               onChange={() => handleCheckboxChange('aadharCard')}
               />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">ABC ID: </td>
            <td className="px-6 py-4">{abcId}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.abcId}
               onChange={() => handleCheckboxChange('abcId')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Year of Admission: </td>
            <td className="px-6 py-4">{yearOfAdmission.toString()}</td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.yearOfAdmission}
               onChange={() => handleCheckboxChange('yearOfAdmission')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Photo:</td>
            <td className="px-6 py-4">
              {photo && (
                <img
                  className="w-24 h-24 object-cover"
                  src={photo}
                  alt="User"
                />
              )}
            </td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.photo}
               onChange={() => handleCheckboxChange('photo')}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">PwBD Certificate:</td>
            <td className="px-6 py-4">
              {pwbdCertificate!=="" && (
                <img
                  className="w-24 h-24 object-cover"
                  src={pwbdCertificate}
                  alt="User"
                />
              )}
            </td>
            <td className="px-2 py-4 scale-200">
              <input type="checkbox" style={{ cursor: "pointer" }} 
               checked={checkboxes.pwbdCertificate}
               onChange={() => handleCheckboxChange('pwbdCertificate')}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-between w-full mt-6">
        <button
                type="button"

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
