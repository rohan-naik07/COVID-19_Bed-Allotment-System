import React, {createContext, useState} from 'react';

const MessageContext = createContext();

const MessageContextProvider = (props) => {
    const [messages, setMessages] = useState([]);

    return (
        <MessageContext.Provider value={{ 
            messages : messages,
            setMessages : setMessages
           }}>
            {props.children}
        </MessageContext.Provider>
    )
}

export {
    MessageContext,
    MessageContextProvider
}