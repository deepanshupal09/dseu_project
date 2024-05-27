import React, { useEffect, useRef, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFViewer,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";
import "react-pdf/dist/esm/Page/TextLayer.css";
import logo from "./images/dseu_logo.png";
import log from "./images/g22.png";
import { StudentData } from "./page";
import { BlobProvider } from '@react-pdf/renderer';
import PdfExport from "./PdfExport";
import { Button, CircularProgress } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface User {
  campus: string;
  programName: string;
  name: string;
  rollno: string;
  dob: string;
  papers: Paper[];
  photo: string;
}

interface Paper {
  sno: number;
  paperCode: string;
  paperName: string;
  semester: string;
  examType: string;
}

const dummyUser: User[] = [
  {
    campus: "G.B. Pant DSEU Okhla I Campus",
    programName: "Computer Science",
    name: "John Doe",
    rollno: "CS001",
    dob: "1990-01-01",
    photo: "https://exam.dseu.ac.in/image/41521001_photo.jpg",
    papers: [
      {
        sno: 1,
        paperCode: "CS101",
        paperName: "Introduction to Computer Science",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 2,
        paperCode: "CS102",
        paperName: "Data Structures and Algorithms",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 3,
        paperCode: "CS103",
        paperName: "Database Management Systems",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 4,
        paperCode: "CS104",
        paperName: "Operating Systems",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 5,
        paperCode: "CS105",
        paperName: "Computer Networks",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 6,
        paperCode: "CS106",
        paperName: "Software Engineering",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 7,
        paperCode: "CS107",
        paperName: "Web Development",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 8,
        paperCode: "CS108",
        paperName: "Artificial Intelligence",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 9,
        paperCode: "CS109",
        paperName: "Machine Learning",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 10,
        paperCode: "CS110",
        paperName: "Computer Graphics",
        semester: "Spring 2024",
        examType: "Regular",
      },
      // Add more papers as needed
    ],
  },
  {
    campus: "G.B. Pant DSEU Okhla I Campus",
    programName: "Computer Science",
    name: "John Doe",
    rollno: "CS001",
    dob: "1990-01-01",
    photo: "https://exam.dseu.ac.in/image/41521001_photo.jpg",
    papers: [
      {
        sno: 1,
        paperCode: "CS101",
        paperName: "Introduction to Computer Science",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 2,
        paperCode: "CS102",
        paperName: "Data Structures and Algorithms",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 3,
        paperCode: "CS103",
        paperName: "Database Management Systems",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 4,
        paperCode: "CS104",
        paperName: "Operating Systems",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 5,
        paperCode: "CS105",
        paperName: "Computer Networks",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 6,
        paperCode: "CS106",
        paperName: "Software Engineering",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 7,
        paperCode: "CS107",
        paperName: "Web Development",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 8,
        paperCode: "CS108",
        paperName: "Artificial Intelligence",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 9,
        paperCode: "CS109",
        paperName: "Machine Learning",
        semester: "Spring 2024",
        examType: "Regular",
      },
      {
        sno: 10,
        paperCode: "CS110",
        paperName: "Computer Graphics",
        semester: "Spring 2024",
        examType: "Regular",
      },
      // Add more papers as needed
    ],
  },
];

Font.register({
  family: "Roboto",

  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-thin-webfont.ttf",
      fontWeight: 100,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 600,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-black-webfont.ttf",
      fontWeight: 900,
    },
  ],
});

const styles = StyleSheet.create({
  logo: {
    width: "40%",
    paddingBottom: "2px",
  },
  page: {
    paddingTop: "5pt",
    paddingLeft: "60pt",
    paddingRight: "40pt",
  },
  flexcontainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },

  flexitem1: {
    flex: 2,
    height: "10vh",

    //    boxSizing: "border-box",
  },
  flexitem2: {
    flex: 0.5,
    height: "10vh",

    //    boxSizing: "border-box",
  },
  flexitem3: {
    flex: 0.8,
    height: "10vh",

    //    boxSizing: "border-box",
    alignItems: "center",
  },
  camp: {
    border: "1.2pt solid black",
    fontSize: "12pt",
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "10px",
    paddingRight: "20px",
  },
  h1: {
    fontSize: "13pt",
    paddingBottom: "4px",
  },
  h2: {
    fontSize: "12pt",
  },
  h55: {
    paddingTop: "8px",
    fontSize: "11pt",
  },
  h56: {
    paddingTop: "2px",
    fontSize: "11pt",
  },
  h3: {
    fontSize: "10pt",
    paddingBottom: "2px",
  },
  wrap: {
    paddingTop: "4px",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  columnItem: {
    height: "10vh",
    width: "87.5%",
    //    boxSizing: "border-box",
  },
  columnItemText: {
    // fontWeight: "bolder",
  },
  columnItem2: {
    height: "10vh",
    width: "17.5%",
    border: "1px solid black",
    //    boxSizing: "border-box",
  },
  table2: {
    marginTop: "10px",
    width: "100%",
    height: "3%",
    display: "flex",
    flexDirection: "row",
  },
  table: {
    width: "100%",
    height: "2%",
    display: "flex",
    flexDirection: "row",
  },
  tablecol1: {
    flex: 0.3,
    display: "flex",
    paddingLeft: "5px",
    border: "1px solid black",
  },
  tablecol2: {
    flex: 0.8,
    display: "flex",
    border: "1px solid black",
    paddingLeft: "5px",
  },
  tablecol3: {
    flex: 2.3,
    display: "flex",
    border: "1px solid black",
    paddingLeft: "5px",
  },
  tablecol4: {
    flex: 0.6,
    display: "flex",
    border: "1px solid black",
    paddingLeft: "5px",
  },
  tablecol5: {
    flex: 0.85,
    display: "flex",
    border: "1px solid black",
    paddingLeft: "5px",
  },
  campdir: {
    marginTop: "20px",
    fontSize: "11pt",
    textAlign: "right",
  },
});

const MyDocument = ({ users }: { users: StudentData[] }) => {
  return (
    <Document>
      {users.map((user) => {
        return (
          <>
            <Page size="A4" style={styles.page}>
              <View>
                <View style={styles.flexcontainer}>
                  <View style={styles.flexitem3}>
                    <Image src={logo.src} style={styles.logo} />
                    <Text style={styles.camp}>Campus Copy</Text>
                  </View>
                  <View style={[styles.flexitem1, styles.wrap]}>
                    <Text style={styles.h3}>
                      DELHI SKILL AND ENTREPRENEURSHIP UNIVERSITY
                    </Text>
                    <Text style={styles.h3}>
                      (A State University Established under Govt. of Delhi Act
                      04 of 2020)
                    </Text>
                    <Text style={styles.h3}>
                      Sector 9, Dwarka, Delhi-110077
                    </Text>
                    <Text style={styles.h3}>Website: https://dseu.ac.in</Text>
                    <Text style={styles.h1}>Admit Card</Text>
                    <Text style={styles.h2}>
                      End Term Examination May 2023-24
                    </Text>
                  </View>
                  <View style={styles.flexitem2}>
                    <Image src={log.src} />
                  </View>
                </View>
              </View>

              <View style={styles.column}>
                <View style={styles.columnItem}>
                  <Text style={[styles.h55, styles.columnItemText]}>
                    Campus:&nbsp; {user.campus}
                  </Text>
                  <Text style={[styles.h56, styles.columnItemText]}>
                    Program:&nbsp; {user.programName}
                  </Text>
                  <Text style={[styles.h56, styles.columnItemText]}>
                    Name:&nbsp; {user.name}
                  </Text>
                  <Text style={[styles.h56, styles.columnItemText]}>
                    RollNo: &nbsp;{user.rollno}
                  </Text>
                  <Text style={[styles.h56, styles.columnItemText]}>
                    Date of Birth: &nbsp;{user.dob}
                  </Text>
                  <Text style={[styles.h55, styles.columnItemText]}>
                    Paper Details
                  </Text>
                </View>
                <View style={styles.columnItem2}>
                  <Image src={user.photo} />
                </View>
              </View>
              <View style={styles.table2}>
                <View style={styles.tablecol1}>
                  <Text style={styles.h3}>S. No</Text>
                </View>
                <View style={styles.tablecol2}>
                  <Text style={styles.h3}>Course Code</Text>
                </View>
                <View style={styles.tablecol3}>
                  <Text style={styles.h3}>Course </Text>
                </View>
                <View style={styles.tablecol4}>
                  <Text style={styles.h3}>Semester </Text>
                </View>
                <View style={styles.tablecol5}>
                  <Text style={styles.h3}>Exam Type</Text>
                  <Text style={styles.h3}>Regular/Reappear</Text>
                </View>
              </View>
              {/* {console.} */}

              {user.papers.map((e, index) => {
                
                return (
                  <>
                    <View key={index} style={styles.table}>
                      <View style={styles.tablecol1}>
                        <Text style={styles.h3}>{e.sno}</Text>
                      </View>
                      <View style={styles.tablecol2}>
                        <Text style={styles.h3}>{e.paperCode}</Text>
                      </View>
                      <View style={styles.tablecol3}>
                        <Text style={styles.h3}>{e.paperName}</Text>
                      </View>
                      <View style={styles.tablecol4}>
                        <Text style={styles.h3}>{e.semester}</Text>
                      </View>
                      <View style={styles.tablecol5}>
                        <Text style={styles.h3}>{e.examType}</Text>
                        {/* <Text style={styles.h3}>{e.typee}</Text> */}
                      </View>
                    </View>
                  </>
                );
              })}

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.campdir}>Student Signature</Text>
                <Text style={styles.campdir}>Campus Director</Text>
              </View>
              <Text style={styles.h55}>
                ------------------------------------------------------------------Cut
                here---------------------------------------------------------
              </Text>

              <View>
                <View style={styles.flexcontainer}>
                  <View style={styles.flexitem3}>
                    <Image src={logo.src} style={styles.logo} />
                    <Text style={styles.camp}>Candidate Copy</Text>
                  </View>
                  <View style={[styles.flexitem1, styles.wrap]}>
                    <Text style={styles.h3}>
                      DELHI SKILL AND ENTREPRENEURSHIP UNIVERSITY
                    </Text>
                    <Text style={styles.h3}>
                      (A State University Established under Govt. of Delhi Act
                      04 of 2020)
                    </Text>
                    <Text style={styles.h3}>
                      Sector 9, Dwarka, Delhi-110077
                    </Text>
                    <Text style={styles.h3}>Website: https://dseu.ac.in</Text>
                    <Text style={styles.h1}>Admit Card</Text>
                    <Text style={styles.h2}>
                      End Term Examination May 2023-24
                    </Text>
                  </View>
                  <View style={styles.flexitem2}>
                    <Image src={log.src} />
                  </View>
                </View>
              </View>

              <View style={styles.column}>
                <View style={styles.columnItem}>
                  <Text style={[styles.h55, styles.columnItemText]}>
                    Campus:&nbsp; {user.campus}
                  </Text>
                  <Text style={[styles.h56, styles.columnItemText]}>
                    Program:&nbsp; {user.programName}
                  </Text>
                  <Text style={[styles.h56, styles.columnItemText]}>
                    Name:&nbsp; {user.name}
                  </Text>
                  <Text style={[styles.h56, styles.columnItemText]}>
                    RollNo: &nbsp;{user.rollno}
                  </Text>
                  <Text style={[styles.h56, styles.columnItemText]}>
                    Date of Birth: &nbsp;{user.dob}
                  </Text>
                  <Text style={[styles.h55, styles.columnItemText]}>
                    Paper Details
                  </Text>
                </View>
                <View style={styles.columnItem2}>
                  <Image src={user.photo} />
                </View>
              </View>

              <View style={styles.table2}>
                <View style={styles.tablecol1}>
                  <Text style={styles.h3}>S. No</Text>
                </View>
                <View style={styles.tablecol2}>
                  <Text style={styles.h3}>Course Code</Text>
                </View>
                <View style={styles.tablecol3}>
                  <Text style={styles.h3}>Course </Text>
                </View>
                <View style={styles.tablecol4}>
                  <Text style={styles.h3}>Semester </Text>
                </View>
                <View style={styles.tablecol5}>
                  <Text style={styles.h3}>Exam Type</Text>
                  <Text style={styles.h3}>Regular/Reappear</Text>
                </View>
              </View>

              {user.papers.map((e, index) => {
                return (
                  <>
                    <View key={index} style={styles.table}>
                      <View style={styles.tablecol1}>
                        <Text style={styles.h3}>{e.sno}</Text>
                      </View>
                      <View style={styles.tablecol2}>
                        <Text style={styles.h3}>{e.paperCode}</Text>
                      </View>
                      <View style={styles.tablecol3}>
                        <Text style={styles.h3}>{e.paperName}</Text>
                      </View>
                      <View style={styles.tablecol4}>
                        <Text style={styles.h3}>{e.semester}</Text>
                      </View>
                      <View style={styles.tablecol5}>
                        <Text style={styles.h3}>{e.examType}</Text>
                        {/* <Text style={styles.h3}>{e.typee}</Text> */}
                      </View>
                    </View>
                  </>
                );
              })}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.campdir}>Student Signature</Text>
                <Text style={styles.campdir}>Campus Director</Text>
              </View>
            </Page>
          </>
        );
      })}
    </Document>
  );
};

const AdmitCard = ({ admitCardData }: { admitCardData: StudentData[] }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isIFrameLoaded, setIsIFrameLoaded] = useState<boolean>(false);
  const iframeCurrent = iframeRef.current;
  useEffect(() => {
    iframeCurrent?.addEventListener("load", () => setIsIFrameLoaded(true));
    return () => {
      iframeCurrent?.removeEventListener("load", () => setIsIFrameLoaded(true));
    };
  }, [iframeCurrent]);
  return (
    <>
{/* 
      <div className="border-2 min-w-[50px] min-h-[50px]">
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <MyDocument users={admitCardData} />
        </PDFViewer>
      </div> */}
       <PDFDownloadLink
              document={<MyDocument users={admitCardData} />}
              fileName={`Admit Card ${admitCardData[0].campus} ${admitCardData[0].programName}.pdf`}
            >
              {({ loading }) =>
                loading ? <CircularProgress />: <Button size="large" className="flex items-center" variant="contained"><CloudDownload   /> &nbsp;&nbsp;<span> Download PDF </span></Button>
              }
            </PDFDownloadLink>
    </>
  );
};

export default AdmitCard;
