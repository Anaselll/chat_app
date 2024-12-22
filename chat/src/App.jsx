import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css"; // Import the CSS file

export default function App() {
  const [messages, setMessages] = useState([]);
  const [id,setId]=useState('')
  const [typing,setTyping]=useState(false)


  const messageRef = useRef(); 
  const [socket, setSocket] = useState(null); 
  const f = import.meta.env.VITE_PRODUCTION_URL || "http://localhost:3000"; ;

   

  useEffect(() => {
    const newSocket = io(f);
    setSocket(newSocket);
    newSocket.on("connect", () => {
      setId(newSocket.id);
    });

   
   

    newSocket.on("test_from_server_to_client", (data) => {
      console.log("Message from server:", data);
    });
    
    newSocket.on("send_message", ({message,userId}) => {
      setMessages((prevMessages) => [...prevMessages,{message,userId} ]);
     newSocket.on('userTyping',()=>{
       setTyping(true)
     })
      

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
      socket.emit("send_message", { message: messageRef.current.value ,userId:id});
      
      messageRef.current.value = ""; 
    }
  };
  const broad=()=>{
    socket.emit("typing",{userId:socket.id})
    
  }

  return (
    <div className="app-container">

      <form onSubmit={sendMessage} className="form-container">
        <input 
          onChange={()=>broad() }
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
     {message.userId} :
     {message.message} 
            
          </div>
          
        ))}
      </div>
      <div>
        {typing? <p>typing...</p>:null}
      </div>

    </div>

  );
}
