import React from "react";
import { Box, Chip, Divider,Grid, IconButton, Paper, TextField, Typography,makeStyles} from "@material-ui/core";
import { Redirect } from "react-router";
import jwtDecode from 'jwt-decode'
import axios from "axios";
import {getToken} from "../authentication/cookies";
import Button from "@material-ui/core/Button";
import { SendRounded } from "@material-ui/icons";
import { mergeClasses } from "@material-ui/styles";
import clsx from "clsx";
//import {getToken} from "../authentication/cookies";

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
    //const is_staff = token ==='' ? 'true' : jwtDecode(token).is_staff;
    //let socket;
    const [text, setText] = React.useState('');
    //const [messages, setMessages] = React.useState([]);
    //const [chats,setChats] = React.useState([]);
    const classes = useStyles();
    const [currentChatUser,setcurrentChatUser] = React.useState({
        email : '',
        name : ''
    });

    const chats = [
        {
            _id : "121",
            user : "Rohan Naik",
            email : "ml km",
            no_of_messages : 2,
            latest_message : "Thala deto saglyana spanking"
        },{
            _id : "221",
            user : "Piyush Thite",
            email : "ml km",
            no_of_messages : 1,
            latest_message : "Thala la milala spanking"
        },{
            _id : "321",
            user : "Pranjal Newalkar",
            email : "ml km",
            no_of_messages : 3,
            latest_message : "Kaam wali bai majhi bae"
        }
    ]

    const messages = [
        {
            _id : "023",
            message : "lswpo skwpdoe slwkp",
            user : "noyou",
            time:"2021-05-12 03:28:19"
        },{
            _id : "123",
            message : "lswpo",
            user : "you",
            time:"2021-05-12 03:28:19"
        },{
            _id : "223",
            message : "lswpo skwpdoe swpmdpewoop dewkok[ wdkk[pckp",
            user : "noyou",
            time:"2021-05-12 03:28:19"
        },{
            _id : "323",
            message : "Hi",
            user : "you",
            time:"2021-05-12 03:28:19"
        },{
            _id : "423",
            message : "spsw smwpdmp",
            user : "you",
            time:"2021-05-12 03:28:19"
        }, {
            _id : "523",
            message : "lswpo skwpdoe slwkp",
            user : "noyou",
            time:"2021-05-12 03:28:19"
        },{
            _id : "623",
            message : "lswpo",
            user : "you",
            time:"2021-05-12 03:28:19"
        },{
            _id : "723",
            message : "lswpo skwpdoe swpmdpewoop dewkok[ wdkk[pckp",
            user : "noyou",
            time:"2021-05-12 03:28:19"
        },{
            _id : "823",
            message : "Hi",
            user : "you",
            time:"2021-05-12 03:28:19"
        },{
            _id : "923",
            message : "spsw smwpdmp",
            user : "you",
            time:"2021-05-12 03:28:19"
        }
    ]

    /*if(token === '') {
        return <Redirect to='/'/>
    }

    if(is_staff==='false'){
        return <Redirect to='/hospitals'/>
    }

    React.useEffect(() => {
        /* axios.get(`${process.env.REACT_APP_API_URL}/chat/`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${getToken()}`, // fetch all chats of hospital
                },
                data : {
                    hospital_slug : jwtDecode(getToken()).hospital_slug,
                }
            }).then(res=>{
                setChat(res.data);

                setcurrentChatUser({
                    ...currentChatUser,
                    email : res.data[0].email,
                    name : res.data[0].user
                })
                connecttoSocket(res.data[0].email);
            })
    }, []);

    const connecttoSocket = (email)=>{
        axios.post(`${process.env.REACT_APP_API_URL}/chat/`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${getToken()}`, // fetch chat slug of specific user and hospital
                },
                data : {
                    hospital_slug : jwtDecode(getToken()).hospital_slug,
                    user: currentChatUser.email
                }
            })
            .then(res => {
                if(res.data.chat_slug) {
                    socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/chat/${res.data.chat_slug}/`);
                    socket.onopen = function(e) {
                        socket.send(JSON.stringify({
                            'command': 'fetch_messages',
                            'email': (jwtDecode(getToken())).email,
                            'chatSlug': res.data.chat_slug
                        }))
                        setMessages(JSON.parse(e.data).messages)
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
                }
        })
    }


    const sendMessage = (new_message) => {
        socket.send(JSON.stringify({
            'message': new_message,
            'from': (jwtDecode(getToken())).email,
            'command': 'new_message',
            'chatSlug': hospital.chat_slug
        }));
        setText('');
    }*/

    React.useEffect(()=>{
        var element = document.getElementById("chat");
    	element.scrollTop = element.scrollHeight;
    },[])

    const handleChange = (email,name)=>{
        setcurrentChatUser({
            ...currentChatUser,
            email : email,
            name : name
        })
        //connect to socket 
    }

    const renderMessages = ()=>(
        <React.Fragment>
            {messages.map(message=>(
                <Box key={message._id} color="primary.main" className={clsx({
                    [classes.messageLeft] : (message.user === 'you'), //always applies
                    [classes.messageRight] : (message.user === 'you') //only when open === true
                })}>
                    <Paper variant='outlined' className={classes.message}>
                        <Typography variant='h6'>{message.message}</Typography>
                        <Typography variant='caption' color='textSecondary'>{message.time}</Typography>
                    </Paper>
                </Box>
            ))}
        </React.Fragment>
    )

    const renderChats = ()=>(
        <React.Fragment>
            {chats.map(chat=>( 
                <Paper elevation={2} key={chat._id} 
                        style={{marginTop:10,padding:10,display:"flex",justifyContent:'space-between'}}
                        onClick={handleChange.bind(this,chat.email,chat.user)}>
                    <div>
                        <Typography variant='h6'>{chat.user}</Typography>
                        <Typography variant='caption' color="textSecondary">{chat.latest_message}</Typography>
                    </div>
                    <Chip size='small' label={chat.no_of_messages} color='primary'/>
                </Paper>
                    )
                )
            }
        </React.Fragment>
    )

    return (
       <Grid container spacing={3}>
           <Grid item xs={6}>
                <Paper elevation={2} style={{padding:10,display:"flex",justifyContent:'space-between'}}>
                    <Typography variant='h4'>Chats</Typography>
                    <Button variant='contained' color='primary' size="small">Broadcast Message</Button>
                </Paper>   
                {renderChats()}
           </Grid>
           <Grid item xs={6}>
                <Box>
                    <Paper elevation={3} style={{display:'flex',justifyContent:'space-between',padding:10}}>
                        <Typography variant='h5'>{'User Name'}</Typography>
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
                        <IconButton>
                            <SendRounded fontSize='large'/>
                        </IconButton>
                    </Paper>           
                </Box>           
           </Grid>
       </Grid>
    )
}

export default StaffChat;