import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import clsx from "clsx";
import {AccountCircle, ChatBubble, ListAlt, LocalHospital, LockOpen} from "@material-ui/icons";
import {getCookie, getToken} from "../authentication/cookies";
import {Login} from "../authentication/Login";
import {SignUp} from "../authentication/SignUp";
import UserProfile from "../profile/UserProfile";
import {OTP} from "../authentication/OTP";
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Hidden from "@material-ui/core/Hidden";
import {Logout} from "../authentication/Logout";
import {Switch, Route, useHistory, useLocation} from "react-router";
import Home from "../home/Home";
import About from "../about/About";
import Graphs from "../charts/Graphs";
import Hospitals from '../hospital/Hospitals'
import Chat from '../chat/Chat'
import {Brightness4, Brightness7} from "@material-ui/icons";
import {ThemeContext} from "../../context/ThemeContext";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    grow: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    space : {
        marginRight: theme.spacing(3),
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    themer: {
        color: theme.palette.text.primary
    }
}));

export default function ClippedDrawer() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState(false);
    const [signUp, setSignUp] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [logout, setLogout] = React.useState(false);
    const [otp, setOTP] = React.useState(false);
    const [tab, setTab] = React.useState(0);
    const {dark, toggleTheme} = React.useContext(ThemeContext);
    const [openProfile, setOpenProfile] = React.useState(false);

    const handleProfileClickOpen = () => {
      setOpenProfile(true);
    };
    const handleProfileClose = () => {
      setOpenProfile(false);
    };
    const location = useLocation();
    const history = useHistory();
    
    const menuId = 'primary-search-account-menu';
    useEffect(() => {
        let token = getToken();
        if(token !== '') {
            setLoggedIn(true);
            if(getCookie('verification')==='false')
            {
                setOTP(true);
            }
        }
        const path = location.pathname;
        switch (path) {
            case '/':
                setTab(0);
                break;
            case '/about':
                setTab(1);
                break;
            case '/graphs':
                setTab(2);
                break;
            case '/hospitals':
                setTab(3);
                break;
            case '/sentiments':
                setTab(4);
                break;
            default:
                setTab(null);
        }
    }, [location, login, signUp, logout])

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
        switch(newTab) {
            case 0:
                history.push('/');
                break;
            case 1:
                history.push('/about');
                break;
            case 2:
                history.push('/graphs');
                break;
            default:
                history.push('/');
        }
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar variant='dense'> 
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(!open)}
                        edge="start"
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        COBAS
                    </Typography>
                    <div className={classes.space}/>
                    {!loggedIn ? 
                        <Hidden smDown>
                            <Tabs value={tab} indicatorColor="primary" textColor="primary" onChange={handleTabChange}>
                                <Tab label="Home" />
                                <Tab label="About Us" />
                                <Tab label="Stats" />
                            </Tabs>
                        </Hidden> : null}
                    <IconButton edge='end' className={classes.themer} onClick={toggleTheme}>
                        {dark ? <Brightness7/>: <Brightness4/>}
                    </IconButton>
                    <div className={classes.grow} />
                    {loggedIn ? 
                    <div className={classes.sectionDesktop}>
                        <IconButton aria-label="show 4 new mails" color="inherit">
                            <Badge color="secondary">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            color="inherit"
                            onClick = {handleProfileClickOpen}
                        >
                            <AccountCircle />
                        </IconButton>
                    </div> : null}
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar variant='dense' />
                <div className={classes.drawerContainer}>
                    {!loggedIn?(
                        <List>
                            <ListItem button key={'Login'} onClick={() => setLogin(true)}>
                                <ListItemIcon><LockOpen /></ListItemIcon>
                                <ListItemText primary={'Login'} />
                            </ListItem>
                            <ListItem button key={'SignUp'} onClick={() => setSignUp(true)}>
                                <ListItemIcon><AccountCircle /></ListItemIcon>
                                <ListItemText primary={'Sign Up'} />
                            </ListItem>
                        </List>
                    ):(
                        <List>
                             <ListItem button key={'Your Applications'}>
                                <ListItemIcon><ListAlt /></ListItemIcon>
                                <ListItemText primary={'Your Applications'} />
                            </ListItem>
                             <ListItem button key={'Your Chats'} >
                                <ListItemIcon><ChatBubble/></ListItemIcon>
                                <ListItemText primary={'Your Chats'} />
                            </ListItem>
                             <ListItem button key={'Search Hospitals'}>
                                <ListItemIcon><LocalHospital /></ListItemIcon>
                                <ListItemText primary={'Search Hospitals'} />
                            </ListItem>
                            <ListItem button key={'Logout'} onClick={() => setLogout(true)}>
                                <ListItemIcon><LockOpen /></ListItemIcon>
                                <ListItemText primary={'Logout'} />
                            </ListItem>
                        </List>
                    )}
                    <Divider />
                </div>
            </Drawer>
            <Login open={login} setOpen={setLogin} setOTP={setOTP}/>
            <SignUp open={signUp} setOpen={setSignUp} otp={otp} setOTP={setOTP}/>
            <OTP open={otp} setOpen={setOTP} setLoggedIn={setLoggedIn}/>
            <Logout open={logout} setOpen={setLogout} setLoggedIn={setLoggedIn}/>
            <UserProfile open={openProfile} handleClose = {handleProfileClose}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <Toolbar variant='dense'/>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/about' component={About}/>
                    <Route exact path='/graphs' component={Graphs}/>
                    <Route path='/hospital/:slug' component={Chat}/>
                    <Route exact path='/hospitals' component={Hospitals}/>
                </Switch>
            </main>
        </div>
    );
}
