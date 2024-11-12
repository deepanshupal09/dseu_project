import { Router } from "express";
import * as controller from "./controller";
import * as marks_controller from "./marks/marks_controller";

const router = Router();
router.get("/", (req, res) => {
    res.send("Welcome to admin route");
});

router.get("/fetchExamRegistrationByProgramAndSemester", controller.fetchExamRegistrationByProgramAndSemester);
router.get("/fetchStudentByProgramAndSemester", controller.fetchStudentByProgramAndSemester);
router.get("/fetchStudentByCampusAndProgram", controller.fetchStudentByCampusAndProgram);
router.get("/fetchCoursesBySemester", controller.fetchCoursesBySemester);
router.get("/fetchExamRegistrationByCourseCode", controller.fetchExamRegistrationByCourseCode);
router.post("/fetchCourseDetailsByCourseCode", controller.fetchCourseDetailsByCourseCode);
router.get("/getUserByRollno", controller.getUserByRollno);
router.post("/updateDetailsByRollno", controller.updateDetailsByRollno);
router.post("/updateNameByRollno", controller.updateNameByRollno);
router.get("/fetchAllUsersController", controller.fetchAllUsersController);
router.get("/fetchCampusDetails", controller.fetchCampusDetails);
router.get("/deleteExamRegistrationByRollno", controller.deleteExamRegistrationByRollno);
router.post("/updateExamControl", controller.updateExamControl);
router.get("/fetchAllExamControlDetailsController", controller.fetchAllExamControlDetailsController);
router.post("/resetStudentController", controller.resetStudentController);
router.get("/fetchExamRegistrationByRollNo", controller.fetchExamRegistrationByRollNo);
router.get("/fetchCoursesByRollNo", controller.fetchCoursesByRollNo);
router.post("/addExamRegisterations", controller.addExamRegisterations);
router.get("/fetchExamControl", controller.fetchExamControl);
router.post("/handleStudentDetailsFromInternalController", marks_controller.handleStudentDetailsFromInternalController);
router.post("/fetchStudentDetailsFromInternalController", marks_controller.fetchStudentDetailsFromInternalController);
router.post("/handleStudentDetailsFromExternalController", marks_controller.handleStudentDetailsFromExternalController);
router.post("/fetchStudentDetailsFromExternalController", marks_controller.fetchStudentDetailsFromExternalController);
router.post("/handleStudentDetailsFromAggregateController", marks_controller.handleStudentDetailsFromAggregateController);
router.post("/toggleMarksControlController", marks_controller.toggleMarksControlController);
router.get("/fetchStudentsByCourseCode", marks_controller.fetchStudentsCourseCodeController);
router.post("/fetchStudentDetailsFromAggregateController", marks_controller.fetchStudentDetailsFromAggregateController);
router.get("/fetchMarkControlDetailsController", marks_controller.fetchMarkControlDetailsController);
router.get("/fetchDepartDetailsByEmailid", marks_controller.fetchDepartDetailsByEmailidController);
router.get("/checkDepartment", marks_controller.checkDepartment);
router.post("/insertBridgeDetails", marks_controller.insertBridgeDetails);
router.post("/fetchBridgeDetails", marks_controller.fetchBridgeDetails);
router.post("/deleteBridgeDetails", marks_controller.deleteBridgeDetails);
router.get("/fetchMarksDetailsController",marks_controller.fetchMarksDetailsController);
router.post("/toggleResultControlController",marks_controller.toggleResultControlController);
router.get("/fetchAllResultController",marks_controller.fetchAllResultController);
router.get("/fetchAllMarkSheetsController",marks_controller.fetchAllMarkSheetsController);
router.post("/sendEmailNotFreeze",marks_controller.sendEmailNotFreeze);


export default router;
