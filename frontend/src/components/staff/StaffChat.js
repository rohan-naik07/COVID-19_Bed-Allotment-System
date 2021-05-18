import React from "react";
import { Box, Chip,Grid, IconButton, Paper, TextField, Typography,makeStyles} from "@material-ui/core";
import { Redirect } from "react-router";
import jwtDecode from 'jwt-decode'
import axios from "axios";
import {getToken} from "../authentication/cookies";
import Button from "@material-ui/core/Button";
import { SendRounded } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    messageLeft : {
        display:'flex',
        justifyContent:'flex-start'
    },
    messageRight : {
        display:'flex',
        justifyContent:'flex-end'
    },
    message : {
        padding:5,
        margin : 5,
        justifyContent : 'flex-end',
        backgroundColor : theme.palette.primary,
        width:'fit-content'
    }
}));

const StaffChat = () => {
    let token = getToken();
    const is_staff = token ==='' ? 'true' : jwtDecode(token).is_staff;
    const [text, setText] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const [chats,setChats] = React.useState([]);
    const [socket,setSocket] = React.useState(null);
    const classes = useStyles();
    const [currentChatUser,setcurrentChatUser] = React.useState({email : '',name : '',slug : ''});
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const showAlert = (key,message,variant)=>enqueueSnackbar(message, {variant: variant, key: key});
    const closeAlert = (key,time)=>setTimeout(() => closeSnackbar(key),time);

    React.useEffect(() => {
        showAlert('chats','Getting your chats...','info');
        axios.get(`${process.env.REACT_APP_API_URL}/portal/hospitals/${jwtDecode(token).hospital_slug}/`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}` // fetch all chats of hospital
                }
            }).then(res=>{
                closeAlert('chats',2000);
                setChats(res.data.chats);
                setcurrentChatUser({
                    ...currentChatUser,
                    email : res.data.chats[0].user_email,
                    name : res.data.chats[0].name,
                    slug : res.data.chats[0].chat_slug
                })
                connecttoSocket(res.data.chats[0].chat_slug);
            }).catch((error)=>{
                closeAlert('chats',2000);
                showAlert('chats_error',error.message,'error');
                closeAlert('chats_error',2000);
            })

            return ()=>{
                if(socket){
                    socket.close();
                }
            }
    }, []);

    
    if(token === '' || is_staff===false) {
        return <Redirect to='/'/>
    }

    const connecttoSocket = (slug)=>{
        var element = document.getElementById("chat");
        let socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/chat/${slug}/`);
        socket.onopen = function(e) {
            socket.send(JSON.stringify({
                'command': 'fetch_messages',
                'email': jwtDecode(token).email,
                'chatSlug': slug
            }))
            setMessages(JSON.parse(e.data).messages)
            element.scrollTop = element.scrollHeight;
        };

        socket.onmessage = (e)=>{
            setMessages(JSON.parse(e.data).messages)
            element.scrollTop = element.scrollHeight;
        }

        socket.onclose = function(event) {
            if (event.wasClean) {
                showAlert('socket_close',`Connection closed cleanly, code=${event.code} reason=${event.reason}`,'error');
            } else {
                showAlert('socket_close','Connection died','error');
            }
            closeAlert('socket_close',2000);
        };

        socket.onerror = function(error) {
            showAlert('socket_error',error,'error');
            closeAlert('socket_error',2000);
        }; 
        setSocket(socket);
    }


    const sendMessage = () => {
        socket.send(JSON.stringify({
            'message': text,
            'from': (jwtDecode(getToken())).email,
            'command': 'new_message',
            'chatSlug': currentChatUser.slug //old state
        }));
        
        let user_chats = [...chats];
        user_chats.forEach(chat=>{
            if(chat.user_email === currentChatUser.email){
                chat.last_message = text;
            }
        })
        setChats(user_chats);
        setText('');
    }

    const broadcastMessage = () => {
        socket.send(JSON.stringify({
            'message': text,
            'from': jwtDecode(getToken()).email,
            'command': 'broadcast_message',
        }));
    }

    const handleChange = (email,name,slug)=>{
        if(email!==currentChatUser.email){
            setcurrentChatUser({
                ...currentChatUser,
                email : email,
                name : name,
                slug : slug
            })
            //connect to socket
            if(socket){
                socket.close();
            }    
            connecttoSocket(slug); 
        }
    }

    const renderMessages = ()=>(
        <React.Fragment>
            {messages.map(message=>(
                <Box key={message.id} color="primary.main" className={clsx({
                    [classes.messageLeft] : (message.user !== jwtDecode(token).email), //always applies
                    [classes.messageRight] : (message.user === jwtDecode(token).email) //only when open === true
                })}>
                    <Paper variant='outlined' className={classes.message}>
                        <Typography variant='h6'>{message.message}</Typography>
                        <Typography variant='caption' color='textSecondary'>{renderTimestamp(message.timestamp)}</Typography>
                    </Paper>
                </Box>
            ))}
        </React.Fragment>
    )
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
            prefix = `${new Date(timestamp).toDateString()}`;
        }
        return prefix;
    };

    const renderChats = ()=>(
        <React.Fragment>
            {chats.map(chat=>( 
                <Paper elevation={2} key={chat.chat_slug} 
                        style={{marginTop:10,padding:10,display:"flex",justifyContent:'space-between'}}
                        onClick={handleChange.bind(this,chat.user_email,chat.name,chat.chat_slug)}
                        >
                    <div>
                        <Typography variant='h6'>{chat.name}</Typography>
                        <Typography variant='caption' color="textSecondary">{chat.last_message}</Typography>
                    </div>
                    <Chip size='small' label={'Active'} color='primary'/>
                </Paper>
                    )
                )
            }
        </React.Fragment>
    )

    return (
       <Grid container spacing={3} direction="row" justify="center">
           <Grid item xs={12} sm={6} container direction="row" justify="center">
                <Grid item xs={12}>
                    <Paper elevation={2} style={{padding:10,display:"flex",justifyContent:'space-between'}}>
                        <Typography variant='h4'>Chats</Typography>
                        <Button variant='contained' color='primary' size="small">Broadcast Message</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    {renderChats()}
                </Grid>
           </Grid>
           <Grid item xs={12} sm={6}>
                <Box>
                    <Paper elevation={3} style={{padding:10}}>
                        <Typography variant='h5'>{currentChatUser.name}</Typography>
                        <Typography variant='h6' color="textSecondary" >{currentChatUser.email}</Typography>
                    </Paper>
                    <Paper elevation={3} id='chat' style={{
                        marginTop:10,
                        height:500,
                        padding:10,
                        overflow:'auto'
                        }}>
                        {renderMessages()}
                    </Paper>
                    <Paper elevation={3} style={{
                        padding :10,
                        alignItems:'center',
                        bottom:0,
                        overflow:'hidden',
                        display:'flex',
                        justifyContent:'space-between',
                        marginTop:10
                    }}>
                        <TextField
                            placeholder="Type a message"
                            variant='outlined'
                            onChange={(event => setText(event.target.value))}
                            value={text}
                            fullWidth
                        />
                        <IconButton  onClick={sendMessage}>
                            <SendRounded fontSize='large'/>
                        </IconButton>
                    </Paper>           
                </Box>           
           </Grid>
       </Grid>
    )
}

export default StaffChat;