"use client";
import React, { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import { getAuth } from "../../actions/cookie";
import { parseJwt } from "../../actions/utils";
import { fetchExamControl, fetchExamRegisterations, fetchUserByRollno } from "../../actions/api";
import { StudentDetails } from "../profile/page";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [token, setToken] = useState<string>("");
  const options = ["Dashboard", "Profile", "Exam Registration", "Course Details"];
  const [examControl, setExamControl] = useState<boolean>(false);
  const [user, setUser] = useState<StudentDetails | null>(null);
  const [recentChange, setRecentChange] = useState({
    title: "Exam Registrations",
    timestamp: "",
    details: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLateralEntry, setIsLateralEntry] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogsCompleted, setDialogsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleLateralChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLateralEntry(event.target.value);
  };

  const handleDialogClose = () => {
    if (selectedCategory && isLateralEntry) {
      setUser((prevUser) => 
        prevUser ? { ...prevUser, category: selectedCategory, is_lateral: isLateralEntry } : prevUser
      );
      setDialogOpen(false);
      setDialogsCompleted(true);
    }
  };

  useEffect(() => {
    if (token !== "" && user?.campus !== undefined) {
      fetchExamControl(token, user?.campus, user?.program, user?.semester.toString(), user?.program_type)
        .then((res) => setExamControl(res.exam_control))
        .catch((error) => {});
    }
  }, [user]);

  useEffect(() => {
    getAuth().then((auth) => {
      if (auth) {
        setToken(auth.value);
        const temp = parseJwt(auth?.value as string);
        fetchUserByRollno(temp.user.rollno, auth.value)
          .then((res) => {
            setUser(res[0]);
            if (!res[0]?.category || !res[0]?.is_lateral) {
              setDialogOpen(true);
            }
            setLoading(false);
          })
          .catch((error: any) => {
            setLoading(false);
          });
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      const rollno = user?.rollno;
      fetchExamRegisterations(rollno, token).then((res) => {
        setRecentChange((prev) => ({
          ...prev,
          details: res.length > 0 
            ? "Current Semesters subjects were chosen and submitted for the exams." 
            : "Choose Current Semesters subjects for the exams.",
          timestamp: res.length > 0 ? res[0].last_modified : "",
        }));
      }).catch((error) => {});
    }
  }, [user]);

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="sm:flex">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : (
        <div className={`sm:pl-[300px] sm:mt-[100px] space-y-5 mt-[140px] max-sm:space-y-6 w-full px-2 sm:pr-10 ${dialogsCompleted ? '' : 'pointer-events-none opacity-50'}`}>
          <div className="welcome py-2 px-4 rounded bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">
              Welcome {user?.name}
            </h1>
          </div>
          <div className="announcement bg-dseublue py-2 px-4 rounded shadow w-full h-full">
            <h1 className="text-xl text-white font-bold">
              <CampaignIcon /> Announcement
            </h1>
            <ul className="text-white">
              <li className="my-6">Result for previous semester is available.</li>
            </ul>
          </div>
          <div className="announcement bg-white py-2 px-4 rounded shadow w-full sm:w-1/4 h-1/4">
            <h1 className="text-xl text-black font-bold">Recent Activity</h1>
            <div className="mt-4">
              <div className="border-b pb-2 mb-2 cursor-pointer" onClick={handleExpandToggle}>
                <h2 className="text-lg font-semibold">{recentChange.title}</h2>
                <p className="text-xs text-gray-500">{recentChange.timestamp}</p>
                {expanded && (
                  <div className="text-sm text-gray-700 mt-2">
                    <p>{recentChange.details}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

<Dialog
  open={dialogOpen}
  onClose={(event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    handleDialogClose();
  }}
  maxWidth="md"
  className="rounded-lg shadow-lg"
>
  <DialogTitle className="bg-dseublue text-white text-lg font-semibold py-4 mb-2">
    Details Completion
  </DialogTitle>
  <DialogContent className="px-6 py-4 space-y-4 my-5">
    <div className="flex flex-col space-y-2 py-4">
      <Typography variant="h6" component="div" className="text-xl font-medium">
        Select Your Category
      </Typography>
      <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
        <div className="flex space-x-4 text-lg">
          <FormControlLabel value="General" control={<Radio />} label="General" />
          <FormControlLabel value="OBC" control={<Radio />} label="OBC" />
          <FormControlLabel value="SC" control={<Radio />} label="SC" />
          <FormControlLabel value="ST" control={<Radio />} label="ST" />
        </div>
      </RadioGroup>
    </div>
    <div className="flex flex-col space-y-2 py-4">
      <Typography variant="h6" component="div" className="text-xl font-medium">
        Are you a Lateral Entry Student?
      </Typography>
      <RadioGroup value={isLateralEntry} onChange={handleLateralChange}>
        <div className="flex space-x-4 text-lg">
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </div>
      </RadioGroup>
    </div>
  </DialogContent>
  <DialogActions className="px-6 py-4">
    <Button
      onClick={handleDialogClose}
      disabled={!selectedCategory || !isLateralEntry}
      color="primary"
      className="bg-dseublue text-white hover:bg-dseublue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dseublue"
    >
      Submit
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
}
