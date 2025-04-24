const Appointment = require("../models/Appointment");

exports.bookAppointment = async (req, res) => {
    try{
        const {name, phone, symptoms, appointmentDate} = req.body;
        const appointment = new Appointment({ name, phone, symptoms, appointmentDate});
        await appointment.save();

        res.json({message: "Appointment booked successfully", appointment});
    } catch (error) {
        console.error("Appointment booking error", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};