import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

interface CollegeDetails {
    username: string,
    rollno: number,
    semester: number, 
    campusName: string,
    programName: string
}

const ProfileHeader: React.FC<CollegeDetails> = ({ username, rollno, semester, campusName, programName }) => (
    <div className="bg-dseublue py-2 px-6 rounded shadow mx-auto my-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl text-white">
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={6} md={7} lg={8}>
                <div className="flex items-center">
                    {/* Display profile icon or photo */}
                    <Avatar>{username[0]}</Avatar>
                    <div className="ml-4">
                        <Typography variant="h6" component="h2">{username}</Typography>
                        <Typography variant="body1" component="p">Roll Number: {rollno}</Typography>
                        <Typography variant="body1" component="p">Semester: {semester}</Typography>
                    </div>
                </div>
            </Grid>
            <Grid item xs={12} sm={6} md={5} lg={4}>
                <div className="text-right">
                    <Typography variant="body1" component="p">Campus: {campusName}</Typography>
                    <Typography variant="body1" component="p">Program: {programName}</Typography>
                </div>
            </Grid>
        </Grid>
    </div>
);

export default ProfileHeader;