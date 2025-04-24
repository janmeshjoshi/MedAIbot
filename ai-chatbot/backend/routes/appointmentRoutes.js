const express = require("express");
const { bookAppointment } = require("../Controller/appointmentController");
const router = express.Router();

router.post("/api/appointment", bookAppointment);

module.exports = router;