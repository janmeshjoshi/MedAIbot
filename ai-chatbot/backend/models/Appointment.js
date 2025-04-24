const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    appointmentDate: { type: Date, required: true },
    symptoms: { type: String, required: true },
    date: {type: Date, required: true},
    clinic: {type: String, required: true},
});

module.exports = mongoose.model("Appointment", AppointmentSchema);