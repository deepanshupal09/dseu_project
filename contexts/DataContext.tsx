"use client";
import { fetchCampusDetailsGlobal } from "@/app/actions/api";
import { CircularProgress } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of your data

type CampusDetailType = {
  program_type: string;
  campus: string;
  semester: number;
  exam_control: boolean;
  program: string;
};

interface DataContextProps {
  data: DataType | null;
}
type ProgramListByTypeType = {
  [key: string]: string[];
}

type DataType = {
  campusList: string[],
  programTypeList: string[],
  programListByType: ProgramListByTypeType
} 

const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<DataType|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: CampusDetailType[] = await fetchCampusDetailsGlobal();
        const campusList: string[] = Array.from(
          new Set(data.map((entry) => entry.campus))
        );
        const programTypeList: string[] = Array.from(
          new Set(data.map((entry) => entry.program_type))
        );
        const programListByType:ProgramListByTypeType = {}
        data.map((entry) => {
          if (!programListByType[entry.program_type]) {
            programListByType[entry.program_type] = [];
            programListByType[entry.program_type].push(entry.program)
          } else {
            if(!programListByType[entry.program_type].includes(entry.program)) {
              programListByType[entry.program_type].push(entry.program)
            }
          }
        })
        console.log("Campus List:", campusList);
        console.log("Program Type List:", programTypeList);
        console.log("Program List by Type:", programListByType);
        setData({campusList, programTypeList, programListByType});
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    ); // Loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Error state
  }

  return (
    <DataContext.Provider value={{data}}>{children}</DataContext.Provider>
  );
};

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
