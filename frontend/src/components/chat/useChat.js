import { useEffect, useRef, useState } from "react";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]); // Sent and received messages
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

    socketRef.current.onopen = function(e) {
      alert("[open] Connection established");
      alert("Sending to server");
      socket.send("My name is John");
    };

    socketRef.current.onmessage = function(event) {
      alert(`[message] Data received from server: ${event.data}`);
    };

    socketRef.current.onclose = function(event) {
      if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
      }
    };

    socketRef.current.onerror = function(error) {
      alert(`[error] ${error.message}`);
    };
    
    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.close();
    };
  }, [roomId]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;