import { Router } from 'express';
import * as controller from './controller';

const router = Router();
router.get("/",(req,res)=>{
    res.send("Welcome to admin route")
});

router.get("/fetchExamRegistrationByProgramAndSemester", controller.fetchExamRegistrationByProgramAndSemester);
router.get("/fetchStudentByProgramAndSemester", controller.fetchStudentByProgramAndSemester);
router.get("/fetchStudentByCampusAndProgram", controller.fetchStudentByCampusAndProgram);
router.get("/fetchCoursesBySemester",controller.fetchCoursesBySemester);
router.get("/fetchExamRegistrationByCourseCode",controller.fetchExamRegistrationByCourseCode);
router.post("/fetchCourseDetailsByCourseCode", controller.fetchCourseDetailsByCourseCode);
router.get("/getUserByRollno", controller.getUserByRollno);
router.post("/updateDetailsByRollno",controller.updateDetailsByRollno);
router.get("/fetchCampusDetails", controller.fetchCampusDetails);
router.get("/deleteExamRegistrationByRollno",controller.deleteExamRegistrationByRollno);
router.post("/updateExamControl", controller.updateExamControl);
router.get("/fetchAllExamControlDetailsController", controller.fetchAllExamControlDetailsController);
router.post("/resetStudentController", controller.resetStudentController);
router.get("/fetchExamRegistrationByRollNo",controller.fetchExamRegistrationByRollNo);
router.get("/fetchCoursesByRollNo",controller.fetchCoursesByRollNo);
router.post("/addExamRegisterations",controller.addExamRegisterations);


export default router;