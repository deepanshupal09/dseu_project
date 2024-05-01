import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
} from "@mui/material";
import dynamic from "next/dynamic";

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
  singleParentGuardianName?: string;
  dateOfBirth: string;
  aadharCard: string;
  abcId: string;
  yearOfAdmission: number;
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
  singleParentGuardianName,
  dateOfBirth,
  aadharCard,
  abcId,
  yearOfAdmission,
  photo,
  pwbdCertificate,
  onPrevious,
  onSubmit,
}: PreviewProps) {
  // const [date,setDate] = useState((new Date()).getTime());
  const [key, setKey] = useState(Date.now()); // Key to force re-render of Image component
  const [confirmSubmission, setConfirmSubmission] = useState(false);
  const [photoPath, setPhotoPath] = useState(photo+'?'+Date.now()); // Default photo path in state
  const [certificatePath, setCertificatePath] = useState(pwbdCertificate+'?'+Date.now());
  // const handleImageUpdate = () => {
  //   setPhotoPath(path + '?' + Date.now());
  // };
  const [toggles, setToggles] = useState({
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
    singleParentGuardianName: false,
    parentRelation: false,
    dateOfBirth: false,
    aadharCard: false,
    abcId: false,
    yearOfAdmission: false,
    photo: false,
    pwbdCertificate: false,
  });
  const Image = dynamic(() => import('next/image'));

  // useEffect(()=>{
  //   setHelp(help+1);
  //   console.log("date: ", date);
  //   setDate((new Date()).getTime())
  // },[help])
  useEffect(() => {
    if (!singleParentGuardian) {
      setToggles({
        ...toggles,singleParentGuardian: true, singleParentGuardianName: true, parentRelation: true
      });
    } else {
      setToggles({
        ...toggles,motherName: true, fatherName: true
      });
    }
  }, []);

  const handleToggleChange = (field: keyof typeof toggles) => {
    setToggles({
      ...toggles,
      [field]: !toggles[field],
    });
  };

  const handleConfirmClick = () => {
    const allToggled = Object.values(toggles).every((isChecked) => isChecked);

    if (allToggled) {
      setConfirmSubmission(true);
    } else {
      alert("Please toggle all switches before confirming.");
    }
  };

  return (
    <div className="p-10 w-[80vw] max-md:w-[100vw] bg-white shadow-md rounded-lg mx-auto">
      <h2 className="text-2xl w-full font-bold  mt-12 text-left m-4">
        Preview Your Information
      </h2>
      <h2 className="text-sm w-full  mb-12 mt-2 text-left m-4">
        Check all details and toggle all switches to continue
      </h2>

      <table className="w-full mt-2 table-auto">
        <tbody className="divide-y divide-gray-200">
          
          <tr>
            <td className="px-6 py-4 font-semibold">Photo:</td>
            <td className="px-6 py-4">
              {photo && (
                <img
                  src={photoPath}
                  // width={96}
                  className="w-24 h-24 object-cover"
                  alt="User"
                  key={key}
                />
              )}
            </td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.photo}
                onChange={() => handleToggleChange("photo")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Roll Number:</td>
            <td className="px-6 py-4">{rollNo}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.rollNo}
                onChange={() => handleToggleChange("rollNo")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Email:</td>
            <td className="px-6 py-4">{email}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.email}
                onChange={() => handleToggleChange("email")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Gender:</td>
            <td className="px-6 py-4">{gender}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.gender}
                onChange={() => handleToggleChange("gender")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Phone:</td>
            <td className="px-6 py-4">{phone}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.phone}
                onChange={() => handleToggleChange("phone")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Alternate Phone:</td>
            <td className="px-6 py-4">{altPhone===""?"N.A":altPhone}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.altPhone}
                onChange={() => handleToggleChange("altPhone")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Date of Birth:</td>
            <td className="px-6 py-4">{dateOfBirth}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.dateOfBirth}
                onChange={() => handleToggleChange("dateOfBirth")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Aadhar Card:</td>
            <td className="px-6 py-4">{aadharCard}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.aadharCard}
                onChange={() => handleToggleChange("aadharCard")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">ABC ID:</td>
            <td className="px-6 py-4">{abcId}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.abcId}
                onChange={() => handleToggleChange("abcId")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">PwBD Certificate:</td>
            <td className="px-6 py-4">
              {pwbdCertificate !== "" ? (
                <img
                  className="w-24 h-24 object-cover"
                  src={certificatePath}
                  alt="User"
                  key={key}
                />
              ):"N.A"}
            </td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.pwbdCertificate}
                onChange={() => handleToggleChange("pwbdCertificate")}
              />
            </td>
          </tr>


          {!singleParentGuardian && (
            <>
              <tr>
                <td className="px-6 py-4 font-semibold">{"Father's Name: "}</td>
                <td className="px-6 py-4">{fatherName}</td>
                <td className="px-2 py-4">
                  <Switch
                    checked={toggles.fatherName}
                    onChange={() => handleToggleChange("fatherName")}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold">{"Mother's Name: "}</td>
                <td className="px-6 py-4">{motherName}</td>
                <td className="px-2 py-4">
                  <Switch
                    checked={toggles.motherName}
                    onChange={() => handleToggleChange("motherName")}
                  />
                </td>
              </tr>
            </>
          )}
          {singleParentGuardian && (
            <>
              <tr>
                <td className="px-6 py-4 font-semibold">
                  {"Parent/Guardian's Name: "}
                </td>
                <td className="px-6 py-4">{singleParentGuardianName}</td>
                <td className="px-2 py-4">
                  <Switch
                    checked={toggles.singleParentGuardianName}
                    onChange={() =>
                      handleToggleChange("singleParentGuardianName")
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold">
                  {"Single Parent/Guardian: "}
                </td>
                <td className="px-6 py-4">Yes</td>
                <td className="px-2 py-4">
                  <Switch
                    checked={toggles.singleParentGuardian}
                    onChange={() => handleToggleChange("singleParentGuardian")}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold">{"Parent's Relation: "}</td>
                <td className="px-6 py-4">{parentRelation}</td>
                <td className="px-2 py-4">
                  <Switch
                    checked={toggles.parentRelation}
                    onChange={() => handleToggleChange("parentRelation")}
                  />
                </td>
              </tr>
            </>
          )}
                    <tr>
            <td className="px-6 py-4 font-semibold">Campus:</td>
            <td className="px-6 py-4">{campus}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.campus}
                onChange={() => handleToggleChange("campus")}
              />
            </td>
          </tr>
                   
          <tr>
            <td className="px-6 py-4 font-semibold">Program Category:</td>
            <td className="px-6 py-4">{programCategory}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.programCategory}
                onChange={() => handleToggleChange("programCategory")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Program:</td>
            <td className="px-6 py-4">{program}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.program}
                onChange={() => handleToggleChange("program")}
              />
            </td>
          </tr>

          <tr>
            <td className="px-6 py-4 font-semibold">Year of Admission:</td>
            <td className="px-6 py-4">{yearOfAdmission.toString()}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.yearOfAdmission}
                onChange={() => handleToggleChange("yearOfAdmission")}
              />
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold">Semester:</td>
            <td className="px-6 py-4">{semester}</td>
            <td className="px-2 py-4">
              <Switch
                checked={toggles.semester}
                onChange={() => handleToggleChange("semester")}
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
