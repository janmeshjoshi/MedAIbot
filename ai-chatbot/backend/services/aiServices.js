const ollama = require("ollama").default;
const axios = require("axios");
const { response } = require("express");

// async function queryAI(userMessage) {
//     try{
//         if (!userMessage || typeof userMessage !== "string") {
//             throw new Error("Invalid user message");
//         }

//         const prompt = `you are a helpful medical chatbot. Answer user queries professionally. User: ${userMessage} AI`;
//         const response = await ollama.chat({
//             model: "mistral",
//             messages: [{ role: "user", content: userMessage}],
//             timeout: 30000,
//         });

//         console.log("AI Response", response);

//         if(response && response.message && response.message.length >0){
//             return response.message[0].content;
//         } else {
//             throw new Error("Unexpected response structure");
//         }
//     } catch (error){
//         console.error("AI query error", error);
//         return "there has been an error in processing your request";
//     }
// }


async function queryAI(userMessage, res) {
    try{
        if (!userMessage || typeof userMessage !== "string") {
            throw new Error("Invalid user message");
        }

        //let fullResponse = "";

       

        const stream = await ollama.generate({
            model: "mistral",
            prompt: `You are a medical assistant. Provide professional, accurate responses to: ${userMessage}`,
            stream: true,
            options: {
                temperature: 0.5,
                top_k: 40,
                top_p: 0.85,
                num_ctx: 2048,
            }
        });

        let fullResponse = '';
        for await (const chunk of stream){
            if(chunk?.response){
                fullResponse += chunk.response;
                res.write(`data: ${JSON.stringify({response: chunk.response})}\n\n`);
            }
        }

        return fullResponse;
        
        // response.data.on('data', (chunk) =>{
        //     const chunkString = chunk.toString();
        //     const lines = chunkString.split('\n');
        //     lines.forEach(line => {
        //         if(line.trim() !== "") {
        //             try{
        //                 const jsonChunk = JSON.parse(line);
        //                 fullResponse += jsonChunk.response;
        //             } catch (jsonError) {
        //                 console.error("Error parsing JSON chunk:", jsonError, line);
        //             }
        //         }
        //     });
        // });

        // await new Promise((resolve, reject) => {
        //     response.data.on('end', resolve);
        //     response.data.on('end', reject);
        // });

        // console.log("Full Ollama Response (accumulated):", fullResponse);
        // return fullResponse;

    } catch (error){
        console.error("AI query error", error);
        res.write(`data: ${JSON.stringify({error: "Error communicating with Ollama." + error.message})}\n\n`);
        // res.end(n);
        throw error;
    }
}







// async function generateBotResponse(userMessage){
//     // try{
//     //     if (userMessage.trim().length === 0 || typeof userMessage !== "string") {
//     //         throw new Error("Invalid user message");
//     //     }
        
//     //     const botReply = await queryAI(userMessage);
//     //     if (typeof botReply === "string" && botReply.startsWith("There has been an error")) {
//     //         throw new Error(botReply);
//     //     }
//     //     return String(botReply);
//     // } catch (error){
//     //     console.error("chatbot response error", error);
//     //     return "I am unable to respond at this moment";
//     // }

//     return new Promise((resolve, reject) =>{
//         let fullResponse = "";
//         const mockRes = {
//             write: (chunk) => {
//                 const data = JSON.parse(chunk.toString().replace("data: ", "")).response;
//                 fullResponse += data;

//             },
//             end: () => resolve(fullResponse)
//         };

//         queryAI(userMessage, mockRes).then(() => resolve(fullResponse)).catch(reject);
//     });
// }

module.exports = { queryAI };


