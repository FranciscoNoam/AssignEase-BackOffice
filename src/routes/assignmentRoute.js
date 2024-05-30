const express = require("express");
const router = express.Router();

const cAuth = require("../controllers/Authentification.controller");
const assignmentController = require("../controllers/assignmentsController");

router.post("/",cAuth.verifyJWT, assignmentController.getAssignments);

router.post("/add", cAuth.verifyJWT, (req, res) => {
  if (req.user.role == "ADMIN") {
    assignmentController.postAssignment(req, res);
  } else {
    return res.json({ status: 400, error: "No permission for action" });
  }
});

router.put("/", cAuth.verifyJWT, (req, res) => {
  if (req.user.role == "ADMIN") {
    assignmentController.updateAssignment(req, res);
  } else {
    return res.json({ status: 400, error: "No permission for action" });
  }
});

router.get("/:id",cAuth.verifyJWT, assignmentController.getAssignment);

router.delete("/:id", cAuth.verifyJWT, (req, res) => {
  if (req.user.role == "ADMIN") {
    assignmentController.deleteAssignment(req, res);
  } else {
    return res.json({ status: 400, error: "No permission for action" });
  }
});

module.exports = router;
