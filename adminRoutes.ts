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
router.get("/deleteExamRegisterationByRollno",controller.deleteExamRegisterationByRollno);





export default router;