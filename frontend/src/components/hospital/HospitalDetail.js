/* eslint-disable */
import React from "react";
import {Grid, Paper, CardContent, Avatar, Typography, makeStyles, Card, CardMedia, Chip, colors} from "@material-ui/core";
import {Widget, addResponseMessage, addUserMessage, dropMessages} from "react-chat-widget";
import Geocode from "react-geocode";
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps';
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
        padding: 0,
    },
    title: {
        margin: '2%',
        lineHeight: '1.15',
        [theme.breakpoints.down('md')]: {
            fontSize: '3.5rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '4.5rem'
        },
    },
    media: {
    },
}));

const HospitalDetail = (props) => {
    const [hospital, setHospital] = React.useState({});
    const [socket, setSocket] = React.useState(null);
    const [render, setRender] = React.useState(false);
    const [text, setText] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const classes = useStyles();

    React.useEffect(() => {
        Geocode.setApiKey(process.env.REACT_APP_API_KEY);
        axios.get(`${process.env.REACT_APP_API_URL}/portal/hospitals/${props.match.params.slug}/`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${getToken()}`,
                }
            }).then(res => {
                setHospital(res.data);
                console.log(res.data);
                if(res.data.chat_slug) {
                    let socket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws/chat/${res.data.chat_slug}/`);
                    socket.onopen = function(e) {
                        socket.send(JSON.stringify({
                            'command': 'fetch_messages',
                            'email': (jwtDecode(getToken())).email,
                            'chatSlug': res.data.chat_slug
                        }))
                        dropMessages();
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
                        dropMessages();
                        JSON.parse(e.data).messages.map((message, i) => {
                            if(message.user===jwtDecode(getToken()).email)
                                addUserMessage(message.message);
                            else
                                addResponseMessage(message.message);
                        })
                    }

                    socket.onclose = function(event) {
                        if (event.wasClean) {
                            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                        } else {
                            // e.g. server process killed or network down
                            // event.code is usually 1006 in this case
                            console.log('[close] Connection died');
                        }
                    };

                    socket.onerror = function(error) {
                        console.log(error.message);
                    };
                    setSocket(socket);
                }
        })
    }, []);

    React.useEffect(() => {
        Geocode.fromLatLng(hospital.latitude, hospital.longitude).then(
            (response) => {
                setAddress(response.results[0].formatted_address);
            },
            (error) => {
            }
        );
        setRender(true);
    }, [hospital])

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
        <Grid item container direction="row" justify="center" alignItems="flex-start" className={classes.container} spacing={3}>
            <Grid item xs={12} sm={6} container direction="column" spacing={3}>
                <Grid item xs={12}>
                    <h1 className={classes.title}>
                        {hospital.name}
                    </h1>
                </Grid>
                <Grid item xs={12} container direction="row" alignItems="center" spacing={2}>
                    <Grid item xs>
                        <Chip
                            avatar={<Avatar>{hospital.staff?hospital.staff.first_name[0].toUpperCase():'N'}</Avatar>}
                            label={hospital.staff?hospital.staff.first_name.toUpperCase():'No staff'}
                            variant="default"
                            style={{ margin: '1% 1% 0 0'}}
                        />
                    </Grid>
                    <Grid item xs>
                        <Chip
                            avatar={<Avatar style={{ backgroundColor: colors.pink[500] }}>{hospital.total_beds}</Avatar>}
                            label="Total Beds"
                            variant="default"
                            color='secondary'
                            style={{ margin: '1%'}}
                        />
                    </Grid>
                    <Grid item xs>
                        <Chip
                            avatar={<Avatar>{hospital.available_beds}</Avatar>}
                            label="Available Beds"
                            variant="default"
                            color='primary'
                            style={{ margin: '1%'}}
                        />
                    </Grid>
                </Grid>
                {!hospital.patient && (
                    <Grid item xs={12}>
                        <Button
                            color='primary'
                            variant='contained'
                            fullWidth
                        >
                            Apply for Bed
                        </Button>
                    </Grid>
                )}
                {!hospital.chat_slug && (
                    <Grid item xs={12}>
                        <Button
                            variant='contained'
                            onClick={handleCreateChat}
                        >
                            Connect with us!
                        </Button>
                    </Grid>
                )}
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card className={classes.paper} component={Paper} elevation={10}>
                    <CardMedia
                        component='img'
                        className={classes.media}
                        image={hospital.imageUrl}
                        title={hospital.name}
                    />
                    <CardContent>
                        <Typography variant='h6'>
                            {address}
                        </Typography>
                    </CardContent>
                </Card>
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
                        title='Chat with the Staff'
                        subtitle={hospital.name}
                        showTimeStamp={false}
                    />
                </Grid>
            )}
        </Grid>
    )
}

export default HospitalDetail;