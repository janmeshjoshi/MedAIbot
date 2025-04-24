import { useState } from "react";

const AppointmentForm = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [date, setDate] = useState("");
    const [clinic, setClinic] = useState("");
    const [message, setMessage] = useState("");

    const bookAppointment = async () => {
        try{
            const res = await fetch("http://localhost:5000/api/appointment",{
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({name, phone, symptoms, appointmentdate: date, clinic }),
            });

            const data = await res.json();
            
            if(res.ok) {
                setMessage("Appointment Booked Successfully");
            } else{
                setMessage("Error Booking Appointment");
            }
        } catch (error) {
            setMessage("Failed to connect to server");
        }
    };

    return (
        <div>
            <h2>Book an Appointment</h2>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input placeholder="Symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
            <input placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input placeholder="Clinic" value={clinic} onChange={(e) => setClinic(e.target.value)} />
            <button onClick={bookAppointment}>Book</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AppointmentForm;

