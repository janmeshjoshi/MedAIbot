import { useEffect, useState, useRef } from "react";


const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const eventSourceRef = useRef(null);
    const fullResponseRef = useRef("");

    useEffect(() => {
        return () => {
            if(eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {

        if(!message || typeof message !== "string" || message.trim().length === 0) {
            setError("please enter a message.")
            return;
        }

        setIsLoading(true);
        setError("");
        setResponse("");
        fullResponseRef.current = ""; 
        
        try {
            
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            const newEventSource = new EventSource(
                `http://localhost:5000/app/chat?message=${encodeURIComponent(message.trim())}`
            );
            eventSourceRef.current = newEventSource;

           

            newEventSource.onmessage = (event) => {
                if(event.data === '[DONE]') {
                    newEventSource.close();
                    setIsLoading(false);
                    return;
                }

                try {
                    const data = JSON.parse(event.data);
                    if (data.response) {
                        fullResponseRef.current += data.response;
                        setResponse(fullResponseRef.current);
                    }
                    if (data.error) {
                        setError(data.error);
                        newEventSource.close();
                    }
                } catch (e) {
                    console.error("Parsing error:", e);
                }
            };

            newEventSource.onerror = () => {
                newEventSource.close();
                setIsLoading(false);
                if (!fullResponseRef.current) {
                    setError("Connection failed or was interrupted");
                }
            };

        } catch (err) {
            console.error("Error setting up SSE:", err);
            setError("Failed to connect to server.");
            setIsLoading(false);
        }
       
    };

    
    return (
        <div>
            <h2>AI CHATBOT</h2>
            <div style={{display: 'flex', gap: '10px'}}>
                <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                style={{ flex: 1, padding: '8px'}}
                onKeyDown={handleKeyDown}
                />
                <button
                    onClick={sendMessage}
                    disabled={isLoading}
                    style={{padding: '8px 16px'}}
                >
                    {isLoading ? "Sending..." : "Send"}
                </button>
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}
            <div style={{
                marginTop: '20px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                minHeight: '100px',
                whiteSpace: 'pre-wrap'
            }}>
                { response || (isLoading ? "AI is thhinking...": "")}
            </div>
        </div>
    );
};

export default Chatbot;