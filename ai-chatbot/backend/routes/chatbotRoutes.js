const express = require("express");
const router = express.Router();
const { processChat } = require("../Controller/chatController");


// router.post("/query", async (req, res) => {
//     const {userMessage} = req.body;
//     const aiResponse = await queryAI(userMessage);
//     res.json({ response: aiResponse });
// });

//for streaming endpoint
router.get("/", processChat);


// //for non-streamig end point
// router.post("/", async (req, res) => {
//      console.log("Non-Streaming endpoint hit!"); 
//     try{
//         const { userMessage } = req.body;
//         const botResponse = await generateBotResponse(userMessage);
//         res.status(200).json({botResponse});
//     } catch (error) {
//         console.error("Chat Route Error (Non-stream)", error);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// });


module.exports = router;