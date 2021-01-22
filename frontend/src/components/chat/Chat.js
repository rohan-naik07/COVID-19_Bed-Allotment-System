import React from 'react';
import WebSocketInstance from "../../websocket";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    chatSection: {
      width: '100%',
      height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
      height: '70vh',
      overflowY: 'auto'
    }
  });

const Chat = (props) => {
    const [state, setState] = React.useState({message: ""});
    const [messages,setMessages] = React.useState([]);
    const classes = useStyles();

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

    /**
     * 
     axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`${HOST_URL}/chat/?username=${username}`)
      .then(res => dispatch(getUserChatsSuccess(res.data)));
  };
     */

    const RenderMessages = messages => {
        const currentUser = props.username;
        return messages.map((message, i, arr) => (
            <ListItem key={message.id} style={{ marginBottom: arr.length - 1 === i ? "300px" : "15px" }}>
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText align={message.author === currentUser ? "left" : "right"}
                            primary={message.content}></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText align={message.author === currentUser ? "left" : "right"}
                            secondary={renderTimestamp(message.timestamp)}></ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
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

    return (
        <div>
             <Typography variant="h5" className="header-message">Chat</Typography>
             <List className={classes.messageArea}>
                   <RenderMessages/>
            </List>
            <Divider />
            <Grid container style={{padding: '20px'}}>
                <Grid item xs={11}>
                    <TextField id="outlined-basic-email" label="Type Something" fullWidth />
                </Grid>
                <Grid xs={1} align="right">
                    <Fab color="primary" aria-label="add"><SendIcon /></Fab>
                </Grid>
            </Grid>
        </div>
    )
}

export default Chat;