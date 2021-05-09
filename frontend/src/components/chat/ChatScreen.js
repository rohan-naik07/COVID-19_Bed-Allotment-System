import React from "react";
import {Button, Divider, Grid, IconButton, Paper, TextField, Typography} from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';

const ChatScreen = (props) => {

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

    return (
       <Paper elevation={3}>
           <div style={{display:'flex',justifyContent:'space-between',padding:10}}>
            <Typography variant='h4'>Chat</Typography>
            <Button variant='contained'>Connect with us!</Button>
           </div>
           <Divider/>
           <div style={{
               width : '48%',
               position:'absolute',
               overflow:'hidden',
               margin : 10,
               padding :10,
               bottom:0,
               display:'flex',
               justifyContent:'space-between'
           }}>
               <TextField
                    placeholder="Type a message"
                    variant='outlined'
                    fullWidth
               />
                <IconButton>
                    <SendIcon fontSize='large'/>
                </IconButton>
           </div>
       </Paper>
    )
}

export default ChatScreen;