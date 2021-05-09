/* eslint-disable */
import React from "react";
import {Button, Divider,IconButton, Paper, TextField, Typography} from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { useSnackbar } from "notistack";
require('dotenv').config()

const ChatScreen = (props) => {
    const [messages,setMessages] = React.useState([]);
    const [render,setRender] = React.useState(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    let socket;

    const recieveData = ()=>{
        enqueueSnackbar('Connecting...', {variant: 'info', key: 'try_connect'})
            axios({
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json"
                },
                data: {
                   id : props.id
                },
                url: `${process.env.REACT_APP_API_URL}/auth/login/`
            }).then(response => {
               
                
            }).catch(error => {
                closeSnackbar('try_login')
                setErrors({...errors, loginError: true});
                enqueueSnackbar('Failed to log in', { variant: 'error', key: 'login_error'})
                setTimeout(() => closeSnackbar('login_error'), 5000)
            })
    }
    
    React.useEffect(()=>{
        socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/chat`);
        socket.onopen = function(e) {
            alert("[open] Connection established");

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
            alert(`[error] ${error.message}`);
          };
          // Destroys the socket reference
            // when the connection is close
            setRender(true);
            return () => {
                socket.close();
            };
    },[])

    

    return render && (
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