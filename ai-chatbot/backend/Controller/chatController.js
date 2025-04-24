const Chat = require("../models/Chat");
const { queryAI } = require("../services/aiServices"); 

// const generateBotResponse = (message) =>{
//     if(message.includes("fever")) return "Can you describe your symptoms in detail?";
// };

exports.processChat = async (req, res, next) =>{
    try {
        const userMessage = req.query.message;

        if (!userMessage || typeof userMessage !== "string") {
            const error = new Error("User message is required");
            error.statusCode = 400;
            throw error;
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const fullResponse = await queryAI(userMessage, res);
        const chat = new Chat({userMessage: userMessage, botResponse: fullResponse,});

        await chat.save();

        if(!res.finished){
        res.write('data: [DONE]\n\n');
        res.end();
        }


    } catch (error) {
        console.error("Chat Error", error);
        next(error);
    }
};