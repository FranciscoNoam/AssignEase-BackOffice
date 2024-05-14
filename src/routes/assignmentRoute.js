const express = require("express");
const router = express.Router();

const cAuth = require('../controllers/Authentification.controller');
const assignmentController = require('../controllers/assignmentsController');

router.post("/" ,assignmentController.getAssignments);
router.post("/" ,assignmentController.postAssignment);
router.put("/" , cAuth.verifyJWT,assignmentController.updateAssignment);
router.get("/:id" ,assignmentController.getAssignment);
router.delete("/:id" , cAuth.verifyJWT ,assignmentController.deleteAssignment);


module.exports = router;