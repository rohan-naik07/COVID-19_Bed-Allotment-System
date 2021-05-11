/* eslint-disable */
import React from "react";
import {Grid, Paper, CardHeader, Avatar, Typography, TextField, IconButton, makeStyles} from "@material-ui/core";
import {Send} from "@material-ui/icons";
import {Widget, addResponseMessage, addUserMessage} from "react-chat-widget";
import axios from "axios";
import {getToken} from "../authentication/cookies";
import jwtDecode from "jwt-decode";
import Button from "@material-ui/core/Button";
import 'react-chat-widget/lib/styles.css';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '2%'
    },
    paper: {
        padding: '2%',
    }
}));

const HospitalDetail = (props) => {
    const [hospital, setHospital] = React.useState({});
    const [socket, setSocket] = React.useState(null);
    const [render, setRender] = React.useState(false);
    const [text, setText] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const classes = useStyles();

    React.useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/portal/hospitals/${props.match.params.slug}/`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${getToken()}`,
                }
            })
            .then(res => {
                setHospital(res.data);
                if(res.data.chat_slug) {
                    let socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/chat/${res.data.chat_slug}/`);
                    socket.onopen = function(e) {
                        socket.send(JSON.stringify({
                            'command': 'fetch_messages',
                            'email': (jwtDecode(getToken())).email,
                            'chatSlug': res.data.chat_slug
                        }))
                        setMessages(JSON.parse(e.data).messages)
                        JSON.parse(e.data).messages.map((message, i) => {
                            if(message.user===jwtDecode(getToken()).email)
                                addUserMessage(message.message);
                            else
                                addResponseMessage(message.message);
                        })
                    };

                    socket.onmessage = (e)=>{
                        setMessages(JSON.parse(e.data).messages)
                        JSON.parse(e.data).messages.map((message, i) => {
                            if(message.user===jwtDecode(getToken()).email)
                                addUserMessage(message.message);
                            else
                                addResponseMessage(message.message);
                        })
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
    }, []);

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

    const sendMessage = (new_message) => {
        socket.send(JSON.stringify({
            'message': new_message,
            'from': (jwtDecode(getToken())).email,
            'command': 'new_message',
            'chatSlug': hospital.chat_slug
        }));
        setText('');
    }

    return render && (
        <Grid item container direction="row" justify="center" alignItems="center" className={classes.container} spacing={2}>
            <Grid item container direction="column" spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <Paper elevation={10} style={{ backgroundImage: `url(${hospital.imageUrl})` }}>
                        <Typography variant='h3'>
                            {hospital.name}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            {!hospital.chat_slug?(
                <Grid item xs={12}>
                    <Button
                        style={{width:'30%'}}
                        variant='contained'
                        onClick={handleCreateChat}
                    >
                        Connect with us!
                    </Button>
                </Grid>
            ):(
                <Grid item xs={12}>
                    <Widget
                        handleSubmit={sendMessage}
                        title='Chat with the staff!'
                        subtitle={hospital.name}
                    />
                </Grid>
            )}
        </Grid>
    )
}

export default HospitalDetail