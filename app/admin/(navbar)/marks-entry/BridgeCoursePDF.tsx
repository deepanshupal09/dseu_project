import React, { useState, useEffect } from "react";
import { getAuth, getAuthAdmin } from "../../../actions/cookie";
import { parseJwt } from "../../../actions/utils";
import { StudentDetails } from "../../../(navbar)/profile/page";
import { Select, MenuItem, FormControl, InputLabel, Button, CircularProgress } from "@mui/material";
import { fetchUserByRollno } from "../../../actions/api";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Font, PDFViewer } from "@react-pdf/renderer";
import logo from "../../../images/dseu.png";
import { Download } from "@mui/icons-material";

interface ResultDocumentProps {
  marks: any;
  campus: string;
  program: string;
  semester: string;
  academicYear: string;
  courseCode: string;
  courseName: string;
  maxMarks: string;
}

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
  page: {
    fontSize: 12,
    position: "relative",
    fontFamily: "Roboto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 50,
    marginTop: 20,
  },
  subHeading: {
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    width: "100%",

    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    position: "absolute",
    left: 0,
    top: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    width: "auto",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
  },
  subHeadingWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  signatureSection: {
    display: "flex",
    position: "absolute",
    bottom: 15,
    // left: 20,
    width: "95%",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const GeneratePDF: React.FC<ResultDocumentProps> = ({
  marks,
  campus,
  program,
  semester,
  academicYear,
  courseCode,
  courseName,
  maxMarks,
}) => { const [user, setUser] = useState<StudentDetails | null>(null);
  const [token, setToken] = useState("");

  const generateDummyData = () => {
    const dummyData = [];
    for (let i = 1; i <= 60; i++) {
      dummyData.push([
        i.toString(),
        `41521${i.toString().padStart(2, "0")}`,
        `Student ${i}`,
        Math.floor(Math.random() * 100).toString(),
        Math.random() > 0.5 ? "Regular" : "Reappear",
      ]);
    }
    return dummyData;
  };

  const dummyData = generateDummyData();

  useEffect(() => {
    getAuthAdmin().then((auth: any) => {
      const temp = parseJwt(auth?.value);
      setToken(auth?.value);
      setUser(temp.user);
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
          })
          .catch((error: any) => {});
      }
    });
  }, []);

  const ResultDocument: React.FC<ResultDocumentProps> = ({
    marks,
    campus,
    program,
    semester,
    academicYear,
    courseCode,
    courseName,
    maxMarks,
  }) => {
    const rowsPerPageFirst = 24;
    const rowsPerPageOther = 30;
    const totalPages = Math.ceil((marks.length - rowsPerPageFirst) / rowsPerPageOther) + 1;

    const createTable = (data: any[]) => (
      <View style={{ paddingLeft: 20, paddingRight: 20 }}>
        <View style={styles.table}>
          <View style={{ ...styles.tableRow, backgroundColor: "#eee", fontWeight: "bold" }}>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text style={styles.tableCell}>S.No</Text>
            </View>
            <View style={[styles.tableCol, { width: "30%" }]}>
              <Text style={styles.tableCell}>Roll No</Text>
            </View>
            <View style={[styles.tableCol, { width: "40%" }]}>
              <Text style={styles.tableCell}>Name</Text>
            </View>
            <View style={[styles.tableCol, { width: "20%" }]}>
              <Text style={styles.tableCell}>Marks</Text>
            </View>
          </View>
          {data.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text style={styles.tableCell}>{row.sno}</Text>
              </View>
              <View style={[styles.tableCol, { width: "30%" }]}>
                <Text style={styles.tableCell}>{row.rollno}</Text>
              </View>
              <View style={[styles.tableCol, { width: "40%" }]}>
                <Text style={styles.tableCell}>{row.name}</Text>
              </View>
              <View style={[styles.tableCol, { width: "20%" } ]}>
                <Text style={styles.tableCell}>{row.marks}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );

    return (
      <Document>
        {Array.from({ length: totalPages }, (_, pageIndex) => {
          const start = pageIndex === 0 ? 0 : rowsPerPageFirst + (pageIndex - 1) * rowsPerPageOther;
          const end = pageIndex === 0 ? rowsPerPageFirst : start + rowsPerPageOther;
          const pageData = marks.slice(start, end);

          return (
            <Page style={styles.page} size="A4" key={pageIndex}>
              {pageIndex === 0 && (
                <>
                  <Image src={logo.src} style={styles.logo} />
                  <View style={styles.header}>
                    <View style={styles.subHeading}>
                      <Text style={styles.title}>DELHI SKILL AND ENTREPRENEURSHIP UNIVERSITY</Text>
                    </View>
                  </View>
                  <View style={styles.subHeadingWrapper}>
                    <View style={styles.subHeading}>
                      <Text style={{ ...styles.bold, ...{ marginLeft: 50 } }}>{campus}</Text>
                    </View>
                    <View style={styles.subHeading}>
                      <Text style={{ ...styles.bold, ...{ marginLeft: 50 } }}>{program}</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", marginLeft: 20, marginRight: 20 }}>
                      <View
                        style={{ display: "flex", gap: 20, justifyContent: "space-between", width: "100%", flexDirection: "row" }}
                      >
                        <View>
                          <View style={{ display: "flex", flexDirection: "row" }}>
                            <View>
                              <Text style={styles.bold}>Semester: </Text>
                            </View>
                            <View>
                              <Text>{semester}</Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          <View style={{ display: "flex", flexDirection: "row" }}>
                            <View>
                              <Text style={styles.bold}>Academic Year: </Text>
                            </View>
                            <View>
                              <Text>{academicYear}</Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          <View style={{ display: "flex", flexDirection: "row" }}>
                            <View>
                              <Text style={styles.bold}>Max Marks: </Text>
                            </View>
                            <View>
                              <Text>{maxMarks}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", marginLeft: 20, marginRight: 20 }}>
                      <View
                        style={{ display: "flex", gap: 20, flexDirection: "row", justifyContent: "space-between", width: "100%" }}
                      >
                        <View>
                          <View style={{ display: "flex", flexDirection: "row" }}>
                            <View>
                              <Text style={styles.bold}>Course Code: </Text>
                            </View>
                            <View>
                              <Text>{courseCode}</Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          <View style={{ display: "flex", flexDirection: "row" }}>
                            <View>
                              <Text style={styles.bold}>Course Name: </Text>
                            </View>
                            <View>
                              <Text>{courseName}{"("}Bridge Course{")"}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              )}
              {createTable(pageData)}

              <View style={styles.signatureSection}>
                <Text>Name and Sign of FIC(Dept.)</Text>
                <Text>Name and Sign of Campus Director</Text>
                <Text>Name and Sign of Faculty</Text>
              </View>

              <Text style={styles.footer}>
                Page {pageIndex + 1} of {totalPages}
              </Text>
            </Page>
          );
        })}
      </Document>
    );
  };

  return (
    <>
      <PDFDownloadLink
        document={<ResultDocument
          maxMarks={maxMarks}
          marks={marks}
          campus={campus}
          program={program}
          semester={semester}
          academicYear={academicYear}
          courseCode={courseCode}
          courseName={courseName}
        />}
        fileName={`Marks-${campus}-${program}-${semester}-${courseName}-${academicYear}-${parseInt(maxMarks)===75?'Internal':parseInt(maxMarks)===25?'External':'Aggregate'}.pdf`}
      >
        {({ loading }) =>
          loading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" startIcon={<Download />}>
              Download PDF
            </Button>
          )
        }
      </PDFDownloadLink>
    </>
  );
}
export default GeneratePDF;
