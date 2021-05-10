/* eslint-disable */
import React from "react";
import {Button, Divider,IconButton, Paper, TextField, Typography} from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { useSnackbar } from "notistack";
import jwt_decode from "jwt-decode";
import {getToken} from "../authentication/cookies";
require('dotenv').config()

const ChatScreen = (props) => {
    const [messages, setMessages] = React.useState([]);
    const [render, setRender] = React.useState(false);
    const [slug, setSlug] = React.useState(null);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let socket;

    React.useEffect(() => {
        setSlug(props.slug);
    }, [])
    
    React.useEffect(()=>{
        if(slug) {
            console.log(true);
            socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/chat/${props.slug}/`);
            socket.onopen = function(e) {
                console.log("Connection established");
            };

            socket.onmessage = (e)=>{
                setMessages(JSON.parse(e.data).messages)
            }

            socket.onclose = function(event) {
                if (event.wasClean) {
                    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                    // e.g. server process killed or network down
                    // event.code is usually 1006 in this case
                    alert('[close] Connection died');
                }
            };

            socket.onerror = function(error) {
                console.log(error.message);
            };
            // Destroys the socket reference
            // when the connection is close
            return () => {
                socket.close();
            };
        }
    },[])

    const handleCreateChat = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/chat/`,
            {
                hospital: props.hospital_slug
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${getToken()}`,
                }
            }
        ).then(res => setSlug(res.data.slug))
    }

    return (
       <Paper elevation={3}>
           <div style={{display:'flex',justifyContent:'space-between',padding:10}}>
            <Typography variant='h4'>Chat</Typography>
               {!slug &&
                   <Button
                       variant='contained'
                       onClick={handleCreateChat}
                   >
                       Connect with us!
                   </Button>}
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
               {props.slug && (
                   <Paper elevation={10}>

                   </Paper>
               )}
               <TextField
                    placeholder="Type a message"
                    variant='outlined'
                    fullWidth
                    disabled={!slug}
               />
                <IconButton disabled={!slug}>
                    <SendIcon fontSize='large'/>
                </IconButton>
           </div>
       </Paper>
    )
}

export default ChatScreen;