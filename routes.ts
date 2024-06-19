import { Router } from 'express';
import * as controller from './controller';
import * as marks_controller from "./marks/marks_controller";

const router = Router();

router.post("/updateDetailsByRollno",controller.updateDetailsByRollno);
// router.post("/addExamRegisterationByRollNo",controller.addExamRegisterationByRollNo);
router.get("/fetchCoursesByRollNo",controller.fetchCoursesByRollNo);
router.get("/fetchExamRegistrationByRollNo",controller.fetchExamRegistrationByRollNo);
router.get("/fetchExamRegistrationByProgramAndSemester",controller.fetchExamRegistrationByProgramAndSemester);
router.post("/addUsers",controller.addUsers);
router.post("/addExamRegisterations",controller.addExamRegisterations);
router.get("/fetchExamControl", controller.fetchExamControl);
router.get("/getUserByRollno", controller.getUserByRollno);
router.post("/updateDetailsByRollno",controller.updateDetailsByRollno);
router.get("/fetchMarksController",marks_controller.fetchMarksController);


export default router;