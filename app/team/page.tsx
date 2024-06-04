"use client";
import { useState } from "react";
import Head from "next/head";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Dialog } from "@headlessui/react";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const DSEUTypography = styled(Typography)(({ theme }) => ({
  color: "#0071BC",
  position: "relative",
  fontFamily: "'Roboto', serif",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: -10,
    left: "50%",
    transform: "translateX(-50%)",
    width: "0%",
    height: "3px",
    backgroundColor: "orange",
    transition: "width 0.3s ease-in-out",
  },
  "&:hover::before": {
    width: "100%",
  },
}));
const LoraTypography = styled(Typography)(({ theme }) => ({
  color: "#253878",
  fontFamily: "'Roboto', serif",
}));
const LoraTypography2 = styled(Typography)(({ theme }) => ({
  color: "#42526E",
  fontFamily: "'Roboto', serif",
}));
const LoraTypography3 = styled(Typography)(({ theme }) => ({
  color: "#091E6E",
  fontFamily: "'Roboto', serif",
}));
const RectangularAvatar = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "200px",
  height: "300px",
  borderRadius: "8px",
  fontFamily: "'Roboto', serif",
  overflow: "hidden",
  "& img": {
    transition: "opacity 0.5s ease-in-out",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  "& img:nth-of-type(2)": {
    opacity: 0,
  },
  "&:hover img:nth-of-type(2)": {
    opacity: 1,
  },
}));

const RectangularAvatar1 = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "310px",
  height: "320px",
  borderRadius: "8px",
  fontFamily: "'Roboto', serif",
  overflow: "hidden",
  "& img": {
    transition: "opacity 0.5s ease-in-out",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  "& img:nth-of-type(2)": {
    opacity: 0,
  },
  "&:hover img:nth-of-type(2)": {
    opacity: 1,
  },
}));
const ResponsiveDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxWidth: "90%",
    width: "90%",
    minHeight: "fit-content",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      maxWidth: "50%",
      width: "65%",
    },
    [theme.breakpoints.up("md")]: {
      maxWidth: "60%",
      width: "0%",
    },
  },
}));

const MemberCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "400px",
}));

const MemberCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  hoverImageUrl: string;
  intro: string;
  resume?: string;
  resumePdfUrl?: string;
  linkedinUrl?: string;
}

const devteam: TeamMember[] = [
  {
    name: "Deepanshu Pal",
    role: "Fullstack Developer",
    imageUrl: "images/deepanshu.png",
    hoverImageUrl: "images/deepanshu-hover.png",
    intro:
      "Dr. Anu Bharadwaj is an esteemed Professor specializing in computer networks and cybersecurity. With expertise in network architecture and security protocols, Dr. Bharadwaj educates the next generation of cybersecurity professionals and conducts research to address emerging threats.Dr. Anu Bharadwaj is an esteemed Professor specializing in computer networks and cybersecurity. With expertise in network architecture and security protocols, Dr. Bharadwaj educates the next generation of cybersecurity professionals and conducts research to address emerging threats.Dr. Anu Bharadwaj is an esteemed Professor specializing in computer networks and cybersecurity. With expertise in network architecture and security protocols, Dr. Bharadwaj educates the next generation of cybersecurity professionals and conducts research to address emerging threats.Dr. Anu Bharadwaj is an esteemed Professor specializing in computer networks and cybersecurity. With expertise in network architecture and security protocols, Dr. Bharadwaj educates the next generation of cybersecurity professionals and conducts research to address emerging threats.Dr. Anu Bharadwaj is an esteemed Professor specializing in computer networks and cybersecurity. With expertise in network architecture and security protocols, Dr. Bharadwaj educates the next generation of cybersecurity professionals and conducts research to address emerging threats.",
    linkedinUrl: "https://www.linkedin.com/in/deepanshupal09/",
  },
  {
    name: "Duke Dhal",
    role: "Backend Developer",
    imageUrl: "/images/duke.png",
    hoverImageUrl: "/images/duke-hover.png",
    intro:
      "Duke is the backend developer in this project. His responsibility in the project involved working with rest APIs in Node.js, Express.js, TypeScript, and the PostgreSQL database. Personally, Duke is proficient in multiple programming languages with experience in both frontend and backend including SQL and NoSQL based databases. With his interest inclined more towards the backend, he also has a keen interest in competitive programming leading him and his team, Maniaxe, to achieve an All India Rank of 45 in the ICPC 2023-24 Regionals. He is a music enthusiast, produced songs of genres including pop and hip hop. He also has an undying affection for Japanese comics called manga and anime as well.",
    linkedinUrl: "https://www.linkedin.com/in/duke-d-575154275/",
  },
  {
    name: "Shubham Vashisht",
    role: "Frontend Developer",
    imageUrl: "/images/shubham.png",
    hoverImageUrl: "/images/shubham-hover.png",
    intro:
      "Shubham is the frontend developer in this project. His responsibilities included crafting intuitive and engaging interfaces using Vue.js, React, Next.js, and Tailwind. Shubham's proficiency extends beyond the frontend, with knowledge in backend technologies like Express and MongoDB, and experience in various programming languages. As the captain of the college volleyball team, Shubham's leadership and team skills shine through. Additionally, he is passionate about writing, creating music, and playing all kinds of sports. His entrepreneurial spirit was recognized when he was selected by top startups from the university. Shubham's diverse interests and skills make him a versatile and dynamic member of the team.",
    linkedinUrl: "https://www.linkedin.com/in/shubham-vashisht-174722238/",
  },
  {
    name: "Anant Bansal",
    role: "Project Manager",
    imageUrl: "/images/anant.png",
    hoverImageUrl: "/images/anant-hover.png",
    intro:
      "Dr. Sushil Kumar is a distinguished Professor specializing in advanced data analytics and machine learning. With a passion for research and teaching, Dr. Kumar mentors students and conducts groundbreaking research in artificial intelligence and data science.",
    linkedinUrl: "https://www.linkedin.com/in/bansalanant/",
  },
  {
    name: "Abhinav Mangalore",
    role: "Frontend Developer",
    imageUrl: "/images/abhinav.png",
    hoverImageUrl: "/images/abhinav-hover.png",
    intro:
      "Abhinav contributes as the frontend developer in this project. His responsibilities included building engaging interfaces using Next.js, TailwindCSS, and React. He is also proficient in backend technologies like ExpressJS, NodeJS, Typescript, including managing SQL and NoSQL databases, and has experience in various programming languages. Additionally, he is also a Kaggle 2x Expert, showcasing proficiency in machine learning, deep learning, computer vision and NLP. His scholarly pursuits include a seminar publication in ICCSAI-2022. Apart from all these, Abhinav is also an avid pianist and plays badminton, reads novels and watches anime in his leisure time.",
    linkedinUrl: "https://www.linkedin.com/in/abhinav-mangalore-919b0a193/",
  },
];

const professors: TeamMember[] = [
  {
    name: "Mr. Manjeet Singh Pangtey",
    role: "Assistant Professor",
    imageUrl: "/images/Manjeet_Singh_Pangtey.png",
    hoverImageUrl: "/images/Manjeet_Singh_Pangtey-hover.png",
    intro:
      "Mr Manjeet has worked as a software engineer for 4 years where he was involved in designing and developing web solutions before choosing teaching as a profession. With a background in higher education administration and a commitment to student success, Mr. Pangtey fosters a culture of academic excellence and innovation. He works collaboratively with faculty, staff, and students to advance our university's mission and values.",
  },

  {
    name: "Dr. Pankaj Lathar",
    role: "Controller of Examinations",
    imageUrl: "images/Pankaj_Lathar.png",
    hoverImageUrl: "images/Pankaj_Lathar-hover.png",
    intro:
      "Dr. Pankaj Lathar has more than 21 years of teaching experience in various leading institutes such as Ch. Brahm Prakash Government Engineering College (Delhi), Maharaja Surajmal Institute (Delhi), Maharshi Dayanand University (Rohtak) at both UG & PG levels. He has published about 19 research papers in various national and international journals of repute and 5 books on various titles of Computer Science & Information Technology (IT).",
  },
  {
    name: "Dr. Sushil Kumar",
    role: "Assistant Controller of Examinations",
    imageUrl: "/images/Sushil_Kumar.png",
    hoverImageUrl: "/images/Sushil_Kumar-hover.png",
    intro:
      "Dr. Sushil Kumar began his academic career in July 2009 and joined the Computer Science and Engineering Department at G.B. Pant DSEU Okhla 1 Campus in December 2015. His research interests include Ad hoc Networks, Vehicular Ad hoc Networks, Machine Learning, and Data Science. He has published numerous papers in refereed journals and conferences and serves on the review board of various international and national journals. Additionally, he holds the position of Assistant Controller of Examination at DSEU and has also served as Faculty Incharge of Student Welfare and Cultural Activities at G.B. Pant DSEU Okhla 1 Campus.",
  },
];
const extendedteam: TeamMember[] = [
  {
    name: "Harshit Tiwari",
    role: "Assistant Professor",
    imageUrl: "/images/harshit1.png",
    hoverImageUrl: "/images/harshit2.png",
    intro:
      "Harshit Tiwari is a B.Tech Computer Science Engineering student at G.B Pant DSEU, Okhla-1 Campus, driven by a deep passion for coding and continuous learning. As a dedicated coder and tech enthusiast, he constantly explores the latest advancements in computer science, from algorithms to emerging technologies. Harshit values hands-on learning, which has equipped him with strong skills in software development, problem-solving, and collaboration. Open to opportunities that align with his passion, Harshit is eager to engage in internships, collaborations, and innovative projects.",
    linkedinUrl: "https://www.linkedin.com/in/abhinav-mangalore-919b0a193/",
  },
  {
    name: "Ashutosh Sahu",
    role: "Controller of Examinations",
    imageUrl: "images/ashu1.png",
    hoverImageUrl: "images/ashu2.png",
    intro:
      "Dr. Pankaj Lathar has more than 21 years of teaching experience in various leading institutes such as Ch. Brahm Prakash Government Engineering College (Delhi), Maharaja Surajmal Institute (Delhi), Maharshi Dayanand University (Rohtak) at both UG & PG levels. He has published about 19 research papers in various national and international journals of repute and 5 books on various titles of Computer Science & Information Technology (IT).",
    linkedinUrl: "https://www.linkedin.com/in/abhinav-mangalore-919b0a193/",
  },
];

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div>
      <Head>
        <title>Our Development Team</title>
        <meta name="description" content="Meet our dedicated team members" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
        />
      </Head>
      <main className="py-10">
        <Container maxWidth="lg">
          <DSEUTypography variant="h2" align="center" gutterBottom>
            Our Development Team
          </DSEUTypography>
          {/* Middle row for dev */}
          <div className="flex justify-center flex-wrap gap-6 ">
            {devteam.map((professor, index) => (
              <MemberCard
                key={index + devteam.length}
                className="shadow-lg cursor-pointer"
                onClick={() => setSelectedMember(professor)}
              >
                <MemberCardContent>
                  <RectangularAvatar1 className="mb-4">
                    <img
                      className="scale-115"
                      src={professor.imageUrl}
                      alt={`${professor.name} default`}
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />
                    <img
                      src={professor.hoverImageUrl}
                      alt={`${professor.name} hover`}
                      width="100%"
                      className="scale-115"
                      height="100%"
                      style={{
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    />
                  </RectangularAvatar1>
                  <LoraTypography variant="h5">{professor.name}</LoraTypography>
                  <LoraTypography2 color="textSecondary">
                    {professor.role}
                  </LoraTypography2>
                </MemberCardContent>
              </MemberCard>
            ))}
          </div>
          <div className="pt-10">
            <DSEUTypography variant="h3" align="center" gutterBottom>
              Our Mentors
            </DSEUTypography>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {professors.map((professor, index) => (
              <MemberCard
                key={index + professors.length}
                className="shadow-lg cursor-pointer"
                onClick={() => setSelectedMember(professor)}
              >
                <MemberCardContent>
                  <RectangularAvatar1 className="mb-4">
                    <img
                      src={professor.imageUrl}
                      alt={`${professor.name} default`}
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />
                    <img
                      src={professor.hoverImageUrl}
                      alt={`${professor.name} hover`}
                      width="100%"
                      height="100%"
                      style={{
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    />
                  </RectangularAvatar1>
                  <LoraTypography variant="h5">{professor.name}</LoraTypography>
                  <LoraTypography2 color="textSecondary">
                    {professor.role}
                  </LoraTypography2>
                </MemberCardContent>
              </MemberCard>
            ))}
          </div>
          <div className="p-10">
            <DSEUTypography variant="h3" align="center" gutterBottom>
              Extended Team
            </DSEUTypography>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {extendedteam.map((professor, index) => (
              <MemberCard
                key={index + extendedteam.length}
                className="shadow-lg cursor-pointer"
                onClick={() => setSelectedMember(professor)}
              >
                <MemberCardContent>
                  <RectangularAvatar1 className="mb-4">
                    <img
                      src={professor.imageUrl}
                      alt={`${professor.name} default`}
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />
                    <img
                      src={professor.hoverImageUrl}
                      alt={`${professor.name} hover`}
                      width="100%"
                      height="100%"
                      style={{
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    />
                  </RectangularAvatar1>
                  <LoraTypography variant="h5">{professor.name}</LoraTypography>
                  <LoraTypography2 color="textSecondary">
                    {professor.role}
                  </LoraTypography2>
                </MemberCardContent>
              </MemberCard>
            ))}
          </div>
        </Container>
      </main>

      {selectedMember && (
        <ResponsiveDialog
          open={Boolean(selectedMember)}
          onClose={() => setSelectedMember(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <IconButton
              aria-label="close"
              className="absolute top-4 right-4"
              onClick={() => setSelectedMember(null)}
            >
              <CloseIcon />
            </IconButton>
            <Box className="flex flex-col lg:flex-row items-center lg:items-start">
              <Box className="flex flex-col items-center justify-center lg:items-start mb-4 lg:mb-0 lg:mr-8">
                <RectangularAvatar className="mb-4">
                  <img
                    src={selectedMember.imageUrl}
                    alt={`${selectedMember.name} default`}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                  <img
                    src={selectedMember.hoverImageUrl}
                    alt={`${selectedMember.name} hover`}
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                </RectangularAvatar>
                <div className="flex items-center justify-center lg:justify-start">
                <Box className="flex items-center justify-center lg:justify-start ml-4">
                  {selectedMember.linkedinUrl && (
                    <IconButton
                      href={selectedMember.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                </Box>
                </div>
              </Box>
              <Box style={{ flex: 1 }}>
                <Box className="text-center lg:text-left">
                  <LoraTypography variant="h5" className="mb-2">
                    {selectedMember.name}
                  </LoraTypography>
                  <LoraTypography2 color="textSecondary" className="mb-4">
                    {selectedMember.role}
                  </LoraTypography2>
                </Box>
                <Box style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <LoraTypography variant="body1">
                    {selectedMember.intro}
                  </LoraTypography>
                </Box>
              </Box>
            </Box>
          </div>
        </ResponsiveDialog>
      )}
    </div>
  );
};

export default Team;
