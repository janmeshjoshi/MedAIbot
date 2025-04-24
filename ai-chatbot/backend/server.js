const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const chatbotRoutes = require("./routes/chatbotRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

require("dotenv").config();


const app=express();

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL and port
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'], // Add other methods if needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers if needed
    credentials: true, // If using cookies or authentication
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});

connectDB();

app.use("/app/chat", chatbotRoutes);
app.use("/app/appointment", appointmentRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use((req, res, next) => {
        res.status(404).json({error: 'Not Found'});
});

app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack);


    if (req.path && req.path.includes('/chat') && !res.headerSent) {
       
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.write(`data: ${JSON.stringify({error: err.message})}\n\n`);
            res.write(`data: [DONE]\n\n`);
            return res.end();
        } catch (e) {
            console.error('failed to send error stream: ', e);
        }
   }

    if (!res.headerSent) {

        res.status(500).json({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
   }
   
});






const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log("Server Running on Port: ", PORT);
});

process.on('unhandledRejection', (err) => {
    console.error('Uncaught rejection:', err);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    server.close(() => process.exit(1));
});


process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});


