import React from 'react';
import WebSocketInstance from "../../websocket";

const Chat = (props) => {
    const [state, setState] = React.useState({message: ""});

    const waitForSocketConnection = (callback) => {
        setTimeout(function() {
            if (WebSocketInstance.state() === 1) {
                console.log("Connection is made");
                callback();
                return;
            } else {
                console.log("wait for connection...");
                waitForSocketConnection(callback);
            }
        }, 100);
    }

    const initialiseChat = () => {
        waitForSocketConnection(() => {
            WebSocketInstance.fetchMessages(
                props.username,
                props.match.params.chatID
            );
        });
        WebSocketInstance.connect(props.match.params.chatID);
    }

    const messageChangeHandler = event => {
        setState({ message: event.target.value });
    };

    const sendMessageHandler = e => {
        e.preventDefault();
        const messageObject = {
            from: props.username,
            content: state.message,
            chatId: props.match.params.chatID
        };
        WebSocketInstance.newChatMessage(messageObject);
        setState({ message: "" });
    };

    const renderTimestamp = timestamp => {
        let prefix = "";
        const timeDiff = Math.round(
            (new Date().getTime() - new Date(timestamp).getTime()) / 60000
        );
        if (timeDiff < 1) {
            // less than one minute ago
            prefix = "just now...";
        } else if (timeDiff < 60 && timeDiff > 1) {
            // less than sixty minutes ago
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24 * 60 && timeDiff > 60) {
            // less than 24 hours ago
            prefix = `${Math.round(timeDiff / 60)} hours ago`;
        } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
            // less than 7 days ago
            prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix;
    };

    const renderMessages = messages => {
        const currentUser = props.username;
        return messages.map((message, i, arr) => (
            <li
                key={message.id}
                style={{ marginBottom: arr.length - 1 === i ? "300px" : "15px" }}
                className={message.author === currentUser ? "sent" : "replies"}
            >
                <img
                    src="http://emilcarlsson.se/assets/mikeross.png"
                    alt="profile-pic"
                />
                <p>
                    {message.content}
                    <br />
                    <small>{renderTimestamp(message.timestamp)}</small>
                </p>
            </li>
        ));
    };

    React.useEffect(() => {
        if (props.match.params.chatID !== newProps.match.params.chatID) {
            WebSocketInstance.disconnect();
            waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                    props.username,
                    newProps.match.params.chatID
                );
            });
            WebSocketInstance.connect(newProps.match.params.chatID);
        }
    })
}