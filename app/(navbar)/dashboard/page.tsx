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
  const [token, setToken] = useState<string>("")
  const options = [
    "Dashboard",
    "Profile",
    "Exam Registration",
    "Course Details",
  ];
  const [examControl ,setExamControl] = useState<boolean>(false);
  const [user, setUser] = useState<StudentDetails | null>(null);
  const [recentChange,setRecentChange] = useState({
    title: "Exam Registrations",
    timestamp: "",
    details:
      "",
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLateralEntry, setIsLateralEntry] = useState<string | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);
  const [lateralDialogOpen, setLateralDialogOpen] = useState<boolean>(false);
  const [dialogsCompleted, setDialogsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleLateralChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLateralEntry(event.target.value);
  };

  const handleCloseCategory = () => {
    if (selectedCategory) {
      setUser((prevUser) => (prevUser ? { ...prevUser, category: selectedCategory } : prevUser));
      setCategoryDialogOpen(false);  
      setLateralDialogOpen(true);
    }
  };

  const handleCloseLateral = () => {
    if (isLateralEntry) {
      setUser((prevUser) => (prevUser ? { ...prevUser, is_lateral: isLateralEntry } : prevUser));
      setLateralDialogOpen(false);  
      setDialogsCompleted(true);  
    }
  };

  useEffect(() => {
    
    if(token!=="") {
      if (user?.campus !== undefined) {
        fetchExamControl(token, user?.campus, user?.program, user?.semester.toString(), user?.program_type).then((res)=>{
          setExamControl(res.exam_control)
        }).catch((error) => {
          
        })
      }
    }
  },[user])

  useEffect(() => {
    getAuth().then((auth) => {
      if (auth) {
        setToken(auth.value);
        const temp = parseJwt(auth?.value as string);
        fetchUserByRollno(temp.user.rollno, auth.value)
          .then((res) => {
            setUser(res[0]);
          })
          .catch((error: any) => {});
      }
    });
  }, []);

  useEffect(() => {
    getAuth().then((auth) => {
      if (auth) {
        setToken(auth.value);
        const temp = parseJwt(auth?.value as string);
        fetchUserByRollno(temp.user.rollno, auth.value)
          .then((res) => {
            setUser(res[0]);
            if (!res[0]?.category) {
              setCategoryDialogOpen(true);
            } else if (!res[0]?.is_lateral) {
              setLateralDialogOpen(true); 
            }
            setLoading(false); 
          })
          .catch((error: any) => {
            setLoading(false); // Stop loading on error
          });
      }
    });
  }, []);
  
  useEffect(() => {
    if(user) {
      const rollno = user?.rollno;
      const temp = recentChange
      fetchExamRegisterations(rollno, token).then((res) => {
        if (res.length > 0) {
          temp.details = "Current Semesters subjects were chosen and submitted for the exams.";
          temp.timestamp = res[0].last_modified;
        } else {
          temp.details = "Choose Current Semesters subjects for the exams.";
          temp.timestamp = res[0].last_modified;
        }
        setRecentChange(temp)
      }).catch((error)=>{
      })
    }

  },[user])
  
  useEffect(() => {
    if (user) {
      if (!user.category) {
        setCategoryDialogOpen(true);  
      } else if (!user.is_lateral) {
        setLateralDialogOpen(true);  
      }
    }
  }, [user]);

  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="sm:flex">
      {loading ? (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div className={`sm:pl-[300px] sm:mt-[100px] space-y-5 mt-[140px] max-sm:space-y-6 w-full px-2 sm:pr-10 ${dialogsCompleted ? '' : 'pointer-events-none opacity-50'}`}>
          <div className="welcome py-2 px-4 rounded">
            <h1 className="text-2xl text-white-800 font-bold">
              Welcome {user?.name}
            </h1>
          </div>
          <div className="announcement bg-dseublue py-2 px-4 rounded shadow w-full h-full">
            <h1 className="text-xl text-white font-bold">
              <CampaignIcon /> Announcement
            </h1>
            <ul className="text-white">
              <li className="my-6">Result for previous semester is available.</li>
              {/* {examControl ? (
                <li className="my-6">Exam registrations are live now!</li>
              ) : (
                <li>Exam registrations are closed now.</li>
              )} */}
            </ul>
          </div>
          <div className="announcement bg-white py-2 px-4 rounded shadow absolute w-full sm:w-1/4 h-1/4">
            <h1 className="text-xl text-black font-bold">Recent Activity</h1>
            <div className="mt-4">
              <div
                className="border-b pb-2 mb-2 cursor-pointer"
                onClick={handleExpandToggle}
              >
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
        open={categoryDialogOpen} 
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return; 
          }
          handleCloseCategory();
        }} 
        fullWidth={true} 
        maxWidth="md" 
        className="rounded shadow"
      >
        <DialogTitle className="bg-dseublue text-white">Select Category</DialogTitle>
        <DialogContent className="my-4 ">
          <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
            <FormControlLabel value="General" control={<Radio />} label="General" />
            <FormControlLabel value="OBC" control={<Radio />} label="OBC" />
            <FormControlLabel value="SC" control={<Radio />} label="SC" />
            <FormControlLabel value="ST" control={<Radio />} label="ST" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategory} disabled={!selectedCategory} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={lateralDialogOpen} 
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return; 
          }
          handleCloseLateral();
        }} 
        fullWidth={true} 
        maxWidth="md" 
        className="rounded shadow"
      >
        <DialogTitle className="bg-dseublue text-white">Are you Lateral Entry Student ??</DialogTitle>
        <DialogContent className="my-4">
          <RadioGroup value={isLateralEntry} onChange={handleLateralChange}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLateral} disabled={!isLateralEntry} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}