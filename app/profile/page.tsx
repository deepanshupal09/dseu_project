"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../dashboard/Navbar";
import Header from "../dashboard/Header";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import Face6RoundedIcon from "@mui/icons-material/Face6Rounded";
import MaleRoundedIcon from "@mui/icons-material/MaleRounded";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import ClassIcon from "@mui/icons-material/Class";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { getAuth } from "../actions/cookie";
import { parseJwt } from "../actions/utils";

interface PersonalDetails {
  name: string;
  fathersName: string;
  fathersNameInput: string;
  mothersName: string;
  mothersNameInput: string;
  guardianName: string;
  guardianNameInput: string;
  gender: string;
  genderInput: string;
  category: string;
  categoryInput: string;
  mobileNumber: string;
  mobileNumberInput: string;
  email: string;
  emailInput: string;
  aadharCard: string;
  aadharCardInput: string;
  address: string;
  addressInput: string;
}

export default function Home() {
  const [editMode, setEditMode] = useState(false);
  const [tempPersonalDetails, setTempPersonalDetails] =
    useState<PersonalDetails | null>(null);
  const [user, setUser] = useState();
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    name: "Abhinav Mangalore",
    fathersName: "Name Name",
    fathersNameInput: "Name Name",
    mothersName: "NAME NAME",
    mothersNameInput: "NAME NAME",
    guardianName: "Name Name",
    guardianNameInput: "NAME NAME",
    gender: "Male",
    genderInput: "Male",
    category: "General",
    categoryInput: "General",
    mobileNumber: "+919876543210",
    mobileNumberInput: "+919876543210",
    email: "ab1111@dseu.ac.in",
    emailInput: "ab1111@dseu.ac.in",
    aadharCard: "********1234",
    aadharCardInput: "********1234",
    address: "E-12 Rk Puram New Delhi, 110012",
    addressInput: "E-12 Rk Puram New Delhi, 110012",
  });

  useEffect(() => {
    setPersonalDetails({
      name: user?.name,
      fathersName: user?.father,
      fathersNameInput: user?.father,
      mothersName: user?.mother,
      mothersNameInput: user?.mother,
      guardianName: user?.guardian,
      guardianNameInput: user?.guardian,
      gender: user?.gender,
      genderInput: user?.gender,
      category: "General",
      categoryInput: "General",
      mobileNumber: user?.phone,
      mobileNumberInput: user?.phone,
      email: user?.emailid,
      emailInput: user?.emailid,
      aadharCard: "********1234",
      aadharCardInput: "********1234",
      address: "E-12 Rk Puram New Delhi, 110012",
      addressInput: "E-12 Rk Puram New Delhi, 110012",
    });
  }, [user]);

  useEffect(() => {
    getAuth().then((auth: any) => {
      const temp = parseJwt(auth?.value);
      setUser(temp.user);
      console.log(temp.user);
    });
  }, []);

  const handleEditPersonalDetails = () => {
    setEditMode(true);
    setTempPersonalDetails({ ...personalDetails });
  };

  const handleConfirmPersonalDetails = () => {
    setEditMode(false);
    if (tempPersonalDetails) {
      setPersonalDetails(tempPersonalDetails);
      setTempPersonalDetails(null);
    }
  };

  const handleInputChange = (field: keyof PersonalDetails, value: string) => {
    if (field === "name") {
      alert("You can't change the name.");
      return;
    }
    if (tempPersonalDetails) {
      setTempPersonalDetails({
        ...tempPersonalDetails,
        [field]: value,
      });
    }
  };

  const renderField = (field: keyof PersonalDetails, label: string) => {
    let icon;
    switch (field) {
      case "name":
      case "fathersName":
      case "mothersName":
        icon = <PersonIcon className="mr-2" />;
        break;
      case "address":
        icon = <HomeIcon className="mr-2" />;
        break;
      case "mobileNumber":
        icon = <PhoneIcon className="mr-2" />;
        break;
      case "email":
        icon = <MailIcon className="mr-2" />;
        break;
      case "aadharCard":
        icon = <CreditCardRoundedIcon className="mr-2" />;
        break;
      default:
        icon = null;
    }

    return (
      <div className="flex items-center mb-2">
        {icon}
        {editMode ? (
          <input
            type="text"
            value={
              tempPersonalDetails
                ? tempPersonalDetails[field]
                : personalDetails[field]
            }
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={personalDetails[field]}
          />
        ) : (
          <p>
            <span className="font-bold">{label}:</span>
            <br /> {personalDetails[field]}
          </p>
        )}
      </div>
    );
  };
  const renderGenderField = () => {
    return (
      <div className="flex items-center mb-2">
        <MaleRoundedIcon className="mr-2" />
        <div className="flex flex-col">
          {editMode ? (
            <>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={
                    tempPersonalDetails
                      ? tempPersonalDetails.gender === "Male"
                      : personalDetails.gender === "Male"
                  }
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                />
                Male
              </label>
              <FemaleRoundedIcon className="mr-2" />
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={
                    tempPersonalDetails
                      ? tempPersonalDetails.gender === "Female"
                      : personalDetails.gender === "Female"
                  }
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                />
                Female
              </label>
              <Face6RoundedIcon className="mr-2" />
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Others"
                  checked={
                    tempPersonalDetails
                      ? tempPersonalDetails.gender === "Others"
                      : personalDetails.gender === "Others"
                  }
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                />
                Others
              </label>
            </>
          ) : (
            <p>
              <span className="font-bold">Gender:</span>
              <br /> {personalDetails.gender}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderCategoryField = () => {
    return (
      <div className="flex items-center mb-2">
        <Face6RoundedIcon className="mr-2" />
        <div className="flex flex-col">
          {editMode ? (
            <>
              <label>
                <input
                  type="checkbox"
                  name="category"
                  value="General"
                  checked={
                    tempPersonalDetails
                      ? tempPersonalDetails.category === "General"
                      : personalDetails.category === "General"
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "category",
                      e.target.checked ? "General" : ""
                    )
                  }
                />
                General
              </label>
              <label>
                <input
                  type="checkbox"
                  name="category"
                  value="EWS"
                  checked={
                    tempPersonalDetails
                      ? tempPersonalDetails.category === "EWS"
                      : personalDetails.category === "EWS"
                  }
                  onChange={(e) =>
                    handleInputChange("category", e.target.checked ? "EWS" : "")
                  }
                />
                EWS
              </label>
              <label>
                <input
                  type="checkbox"
                  name="category"
                  value="OBC"
                  checked={
                    tempPersonalDetails
                      ? tempPersonalDetails.category === "OBC"
                      : personalDetails.category === "OBC"
                  }
                  onChange={(e) =>
                    handleInputChange("category", e.target.checked ? "OBC" : "")
                  }
                />
                OBC
              </label>
              <label>
                <input
                  type="checkbox"
                  name="category"
                  value="SC"
                  checked={
                    tempPersonalDetails
                      ? tempPersonalDetails.category === "SC"
                      : personalDetails.category === "SC"
                  }
                  onChange={(e) =>
                    handleInputChange("category", e.target.checked ? "SC" : "")
                  }
                />
                SC
              </label>
              <label>
                <input
                  type="checkbox"
                  name="category"
                  value="ST"
                  checked={
                    tempPersonalDetails
                      ? tempPersonalDetails.category === "ST"
                      : personalDetails.category === "ST"
                  }
                  onChange={(e) =>
                    handleInputChange("category", e.target.checked ? "ST" : "")
                  }
                />
                ST
              </label>
            </>
          ) : (
            <p>
              <span className="font-bold">Category:</span>
              <br /> {personalDetails.category}
            </p>
          )}
        </div>
      </div>
    );
  };

  const handleEditAndConfirm = () => {
    if (editMode) {
      handleConfirmPersonalDetails();
    } else {
      handleEditPersonalDetails();
    }
  };

  const handleEditUniversityDetails = () => {
    alert("You cannot edit university details. Please contact authorities.");
  };

  return (
    <div className="max-sm:mt-[120px] mt-[120px]">
      <div className=" bg-[#dfdede] ">
        <Header username={user?.name} />
        <Navbar />
      </div>

      <div className="relative md:ml-60  mt-6 md:w-auto ">
        <div className="bg-dseublue py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl text-white ">
          <AccountBoxRoundedIcon className=" ml-10" />
          <div>
            <h1 className="text-xle font-bold">
              {user?.name}
              <span>'s profile</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="font-bold">Roll Number:</p>
            <p>{user?.rollno}</p>
            <p className="font-bold">Semester: </p>
            <p>{user?.semester}</p>
          </div>
        </div>
      </div>

      <div className="relative md:ml-60 mt-8 w-full md:w-auto shadow-sm">
        <div className="bg-white md:w-full py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-start justify-between max-w-6xl text-gray-700">
          {/* <div className="flex justify-between w-full"> */}
            <h2 className="text-xl font-bold mb-4 w-1/2">Personal Details</h2>{" "}
            {/* <IconButton onClick={handleEditPersonalDetails}>
              <EditIcon />
            </IconButton> */}
          {/* </div> */}
          <div className="w-full sm:w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {renderField("name", "Name")}
              {personalDetails.fathersName &&
                renderField("fathersName", "Father's Name")}
              {personalDetails.mothersName &&
                renderField("mothersName", "Mother's Name")}
              {personalDetails.guardianName &&
                renderField("guardianName", "Guardian's Name")}
              {/* {renderGenderField()} */}
              {/* {renderCategoryField()} */}
              {renderField("mobileNumber", "Mobile Number")}
              {renderField("email", "Email")}
              {/* {renderField("aadharCard", "Aadhar Card")} */}
              {/* {renderField("address", "Address")} */}
            </div>
            {editMode ? (
              <div className="flex items-end mr-6">
                {/* <IconButton onClick={handleConfirmPersonalDetails}>
                  Confirm
                </IconButton> */}
              </div>
            ) : (
              <div className="flex items-end mr-6"></div>
            )}
          </div>
        </div>
      </div>

      <div className="relative md:ml-60 mt-8 w-full md:w-auto shadow-sm">
        <div className="bg-white md:w-full py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-start justify-between max-w-6xl text-gray-700">
          <h2 className="text-xl font-bold mb-4 w-1/2">University Details</h2>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center mb-2">
                <SchoolIcon className="mr-2" />
                <p>
                  <span className="font-bold">Campus Name:</span>
                  <br /> {user?.campus}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <BookIcon className="mr-2" />
                <p>
                  <span className="font-bold">Program Type:</span>
                  <br /> {user?.program_type}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <ClassIcon className="mr-2" />
                <p>
                  <span className="font-bold">Course Name:</span>
                  <br /> {user?.program}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <PersonIcon className="mr-2" />
                <p>
                  <span className="font-bold">Roll Number:</span>
                  <br /> {user?.rollno}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <CalendarTodayIcon className="mr-2" />
                <p>
                  <span className="font-bold">Semester:</span>
                  <br /> {user?.semester}
                </p>
              </div>
              {/* <div className="flex items-center mb-2">
                <CalendarTodayIcon className="mr-2"/>
                 <p><span className="font-bold">Graduation Year:</span><br />  </p> 
              </div> */}
              <div className="flex items-center mb-2">
                <VpnKeyIcon className="mr-2" />
                <p>
                  <span className="font-bold">abc_id:</span>
                  <br /> {user?.abc_id}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <PersonIcon className="mr-2" />
                <p>
                  <span className="font-bold">Role:</span>
                  <br /> Student
                </p>
              </div>
            </div>
            <div className="flex items-end mr-6">
              {/* <IconButton onClick={handleEditUniversityDetails}>
                <EditIcon />
              </IconButton> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
