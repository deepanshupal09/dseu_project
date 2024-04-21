import { Router } from 'express';
import * as controller from './controller';

const router = Router();

router.get("/getUserByRollno", controller.getUserByRollno);
router.post("/updateDetailsByRollno",controller.updateDetailsByRollno);
router.post("/addExamRegisterationByRollNo",controller.addExamRegisterationByRollNo);
router.get("/fetchCoursesBySemester",controller.fetchCoursesBySemester);
router.get("/fetchCoursesByRollNo",controller.fetchCoursesByRollNo);
router.get("/fetchExamRegistrationByRollNo",controller.fetchExamRegistrationByRollNo);
router.get("/fetchExamRegistrationByCourseCode",controller.fetchExamRegistrationByCourseCode);
router.get("/fetchExamRegistrationByProgramAndSemester",controller.fetchExamRegistrationByProgramAndSemester);

export default router;
