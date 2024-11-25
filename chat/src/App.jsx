import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css"; // Import the CSS file

export default function App() {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(); 
  const [socket, setSocket] = useState(null); 

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("test_from_server_to_client", (data) => {
      console.log("Message from server:", data);
    });

    newSocket.on("send_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      newSocket.off("test_from_server_to_client");
      newSocket.off("send_message");
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageRef.current.value.trim()) {
      socket.emit("send_message", { message: messageRef.current.value });
      messageRef.current.value = ""; 
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={sendMessage} className="form-container">
        <input
          type="text"
          ref={messageRef}
          placeholder="Type your message..."
          className="input-message"
        />
        <button type="submit" className="button-send">
          Send
        </button>
      </form>

      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}
