import { Request, Response } from "express";
import { fetchTheStudentDetailsFromInternal, 
    handleStudentDetailsFromInternal,
    fetchTheStudentDetailsFromExternal,
    handleStudentDetailsFromExternal,
    handleStudentDetailsFromAggregate,
    toggleMarksControlService,
    fetchMarksService,
    fetchStudentsCourseCodeService
} from "./marks_service";

const fetchStudentDetailsFromInternalController= (req: Request, res: Response):void => {
    try{
      const details=req.body;
    //   console.log("semester , course_code :", semester, program);
      fetchTheStudentDetailsFromInternal(details).then((results) => {
        res.status(200).send(results);
      }).catch((error) => {
        res.status(500).send("internal server fetch internal 2");
      })
    }
    catch(error) {
      res.send("Internal server error internal 3");
    }
}

const fetchStudentDetailsFromExternalController= (req: Request, res: Response):void => {
    try{
      const details=req.body;
    //   console.log("semester , course_code :", semester, program);
      fetchTheStudentDetailsFromExternal(details).then((results) => {
        res.status(200).send(results);
      }).catch((error) => {
        res.status(500).send("internal server fetch internal 2");
      })
    }
    catch(error) {
      res.send("Internal server error internal 3");
    }
}

const handleStudentDetailsFromInternalController = (req: Request, res: Response):void => {
    try{
      const details=req.body;
    //   console.log("semester , course_code :", semester, program);
      handleStudentDetailsFromInternal(details).then((results) => {
        res.status(200).send("Operation Successfull!");
      }).catch((error) => {
        res.status(500).send("internal server insert internal 2");
      })
    }
    catch(error) {
      res.send("Internal server error insert internal 3");
    }
}

const handleStudentDetailsFromExternalController = (req: Request, res: Response):void => {
    try{
      const details=req.body;
    //   console.log("semester , course_code :", semester, program);
      handleStudentDetailsFromExternal(details).then((results) => {
        res.status(200).send("Operation Successfull!");
      }).catch((error) => {
        res.status(500).send("internal server insert internal 2");
      })
    }
    catch(error) {
      res.send("Internal server error insert internal 3");
    }
}

const handleStudentDetailsFromAggregateController = (req: Request, res: Response):void => {
    try{
      const details=req.body;
    //   console.log("semester , course_code :", semester, program);
      handleStudentDetailsFromAggregate(details).then((results) => {
        res.status(200).send("Operation Successfull!");
      }).catch((error) => {
        res.status(500).send("internal server insert internal 2");
      })
    }
    catch(error) {
      res.send("Internal server error insert internal 3");
    }
}

const toggleMarksControlController = (req:Request, res:Response)=>{
  try{
    const details=req.body;
    toggleMarksControlService(details).then((results)=>{
      res.status(200).send("Marks control toggled!");
    }).catch((error)=>{
      res.status(500).send("internal server error at toggle marks control 1");
    })
  } catch(error){
    res.send("internal server error at toggle marks control 2");
  }
}

const fetchMarksController = (req:Request, res:Response)=>{
  try{
    const rollno: string = req.headers.rollno as string;
    const academic_year: string = req.headers.academicyear as string;
    fetchMarksService(rollno, academic_year).then((results)=>{
      res.status(200).send(results);
    }).catch((error)=>{
      console.log("error:",error);
      res.status(500).send("internal server error at marks fetch 1");
    })
  } catch(error){
    res.send("internal server error at marks fetch 2");
  }
}

const fetchStudentsCourseCodeController = (req:Request, res:Response)=>{
  try{
    const course_code: string = req.headers.coursecode as string;
    const campus: string = req.headers.campus as string;
    const program_type: string = req.headers.programtype as string;
    const program: string = req.headers.program as string;
    const semester: string = req.headers.semester as string;
    const academic_year: string = req.headers.academicyear as string;

    fetchStudentsCourseCodeService(course_code, campus,program_type,program,semester,academic_year).then((results)=>{
      res.status(200).send(results);
    }).catch((error)=>{
      console.log("error:",error);
      res.status(500).send("internal server error at student fetch");
    })
  } catch(error){
    res.send("internal server error at student fetch 2");
  }
}

export {
    fetchStudentDetailsFromInternalController,
    handleStudentDetailsFromInternalController,
    fetchStudentDetailsFromExternalController,
    handleStudentDetailsFromExternalController,
    handleStudentDetailsFromAggregateController,
    toggleMarksControlController,
    fetchMarksController,
    fetchStudentsCourseCodeController
}