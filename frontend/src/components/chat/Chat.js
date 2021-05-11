/* eslint-disable */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import {reviews} from './reviews';
import Chip from '@material-ui/core/Chip';
import {getToken} from "../authentication/cookies";
import axios from "axios";
import {Dialog, IconButton, TextField} from '@material-ui/core';
import { ChatBubble } from '@material-ui/icons';
import SendIcon from "@material-ui/icons/Send";
import jwtDecode from "jwt-decode";

const useStyles = makeStyles((theme)=>({
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
    },
    container: {
        position: 'relative',
        borderRadius : 20,
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        backgroundImage: `url(${Image})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      },
      overlay: {
        position: 'absolute',
        top: 0,
        borderRadius : 20,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.5)',
      },
      content: {
        position: 'relative',
        width : '100%',
        paddingTop: theme.spacing(5),
        marginTop: 100,
        padding : 10
      },
      reviews : {
        height : 250,
        marginTop : 10,
        overflow : 'auto'
    },
    chatModal : {
        [theme.breakpoints.up('sm')]:{
            display : 'none'
        }
    },
    chat : {
        [theme.breakpoints.down('sm')]:{
            display : 'none'
        } 
    }
  }));

const Chat = (props) => {
    const classes = useStyles();
    const [hospital, setHospital] = React.useState({});
    const [text, setText] = React.useState('');
    const [render, setRender] = React.useState(false);
    const [messages, setMessages] = React.useState([]);
    const [open,setOpen] = React.useState(false);
    const [socket, setSocket] = React.useState(null);

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/portal/hospitals/${props.match.params.slug}/`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${getToken()}`,
                }
            }).then(res => {
                setHospital(res.data);
                if(res.data.chat_slug) {
                    let socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/chat/${res.data.chat_slug}/`);
                    socket.onopen = function(e) {
                        console.log("Connection established");
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
                    setSocket(socket);
                    }
            })
        setRender(true);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // const renderChatModal = ()=>{
    //     return (
    //         <Dialog  open={open} onClose={handleClose} style={{height:'100%'}}>
    //             <ChatScreen slug={hospital.chat_slug} hospital_slug={hospital.slug}/>
    //         </Dialog>
    //     )
    // }

    const handleCreateChat = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/chat/`,
            {
                hospital: hospital.slug
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${getToken()}`,
                }
            }
        ).then(res => setHospital({...res.data.hospital, slug: res.data.slug}))
    }

    const sendMessage = () => {
        console.log(messages);
        socket.send(JSON.stringify({
            'message': text,
            'from': (jwtDecode(getToken())).email,
            'command': 'new_message',
            'chatSlug': hospital.chat_slug
        }));
        setText('');
    }

    const renderReviews = ()=>{
        return (
            <React.Fragment>
                {reviews.map(review=>(
                    <Paper key={review._id} elevation={2} style={{
                        margin : 10,
                        padding : 10
                    }}>
                        <div style={{display:'flex',justifyContent : 'space-between'}}>
                            <Typography variant="h6">
                                {review.feedback}
                            </Typography>
                            <Rating name="read-only" value={parseInt(review.overallRating)} readOnly />
                        </div>
                        <Divider/>
                        <Typography variant="h6" color='textSecondary'>
                            {review.reviewDate}
                        </Typography>
                    </Paper>
                ))}
            </React.Fragment>
        )
    }


    return render && (
        <React.Fragment>
            <Grid container spacing={2} style={{ overflow:'hidden',}}>
                <Grid item container md={6} xs={12}>
                    <Grid item xs={12}>
                        <Paper elevation={3} style={{padding:10}}>
                            <Paper className={classes.container} style={{ backgroundImage: `url(${hospital.imageUrl})` }}>
                                {/* Increase the priority of the hero background image */}
                                {<img style={{ display: 'none',marginTop:"10Px" }} src={`url(${hospital.imageUrl})`} alt='bg'/>}
                                <div className={classes.overlay} />
                                <Grid container>
                                    <Grid item md={6} className={classes.chatModal}>
                                        <IconButton onClick={()=>{setOpen(true)}} variant='outlined' style={{display:'flex'}}>
                                            <ChatBubble fontSize='large'/>
                                            <Typography  variant="h5" color="inherit">Chat</Typography>
                                        </IconButton>  
                                    </Grid>
                                    <Grid item md={12}>
                                        <div className={classes.content}>
                                            <Typography component="h1" variant="h3" color="inherit">
                                                {hospital.name}
                                            </Typography>
                                            <br/>
                                            <div style={{display:'flex',justifyContent:'space-around'}}>
                                                <Chip size='medium' label={`${hospital.total_beds} beds `} color='primary'/>
                                                <Chip size='medium' label={`${hospital.available_beds} beds availiable`} color='secondary'/>
                                                <Button variant='contained' color='primary'>Book a bed</Button>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Paper>
                            <div style={{display:'flex',justifyContent:'space-between'}}>
                                <a href={hospital.website}>
                                    <Button variant='outlined' color='primary'>Visit Us</Button>
                                </a>
                                <Typography variant='h5'>{hospital.contact}</Typography>
                                <Button variant='outlined' color='primary'>Review Us</Button>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} className={classes.reviews} >
                            {renderReviews()}
                    </Grid>
                </Grid>
                <Grid item md={6} className={classes.chat}>
                    <Paper elevation={3} style={{height:'100%',padding:10}}>
                        <div style={{display:'flex',justifyContent:'space-between',padding:10,height:'10%'}}>
                            <Typography variant='h4' style={{width:'70%'}}>Chat</Typography>
                            {!hospital.chat_slug &&
                            <Button
                                style={{width:'30%'}}
                                variant='contained'
                                onClick={handleCreateChat}
                            >
                                Connect with us!
                            </Button>}
                        </div>

                        <div style={{height:'80%'}}>
                            <Divider/>
                        </div>
                        <div style={{
                            padding :10,
                            alignItems:'center',
                            overflow:'hidden',
                            height : '10%',
                            display:'flex',
                            justifyContent:'space-between'
                        }}>
                            <TextField
                                placeholder="Type a message"
                                variant='outlined'
                                onChange={(event => setText(event.target.value))}
                                value={text}
                                fullWidth
                                disabled={!hospital.chat_slug}
                            />
                            <IconButton disabled={!hospital.chat_slug} onClick={sendMessage}>
                                <SendIcon fontSize='large'/>
                            </IconButton>
                        </div>
                    </Paper>
                </Grid>  
            </Grid>
        </React.Fragment>  
    )
}

export default Chat;