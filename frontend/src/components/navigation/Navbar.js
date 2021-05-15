import React, {useEffect} from 'react';
import {
    makeStyles,
    Grid,
    Tooltip,
    List,
    Toolbar,
    Typography,
    Divider,
    ListItem,
    IconButton,
    Drawer,
    AppBar,
    CssBaseline,
    Badge,
    Hidden,
    Tabs,
    Tab,
    colors, SwipeableDrawer
} from '@material-ui/core';
import {AccountCircle, ChatBubble, ListAlt, LocalHospital, LockOpen, Mail, Brightness4, Brightness7, Menu} from "@material-ui/icons";
import {getCookie, getToken} from "../authentication/cookies";
import {Login} from "../authentication/Login";
import {SignUp} from "../authentication/SignUp";
import UserProfile from "../profile/UserProfile";
import {OTP} from "../authentication/OTP";
import {Logout} from "../authentication/Logout";
import {Switch, Route, useHistory, useLocation} from "react-router";
import Home from "../home/Home";
import About from "../about/About";
import Graphs from "../charts/Graphs";
import {ThemeContext} from "../../context/ThemeContext";
import HospitalDetail from "../hospital/HospitalDetail";
import StaffChat from '../staff/StaffChat';
import jwtDecode from 'jwt-decode';

const drawerWidth = 80;

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
        overflowX: 'hidden',
    },
    drawerPaper: {
        width: drawerWidth,
        overflowX: 'hidden'
    },
    drawerContainer: {
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
    },
    content: {
        flexGrow: 1,
        margin: theme.spacing(3),
        paddingTop: theme.spacing(2),
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



const Navbar = () => {
    const classes = useStyles();
    const [login, setLogin] = React.useState(false);
    const [signUp, setSignUp] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [logout, setLogout] = React.useState(false);
    const [otp, setOTP] = React.useState(false);
    const [tab, setTab] = React.useState(0);
    const {dark, toggleTheme} = React.useContext(ThemeContext);
    const [openProfile, setOpenProfile] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    let token = getToken();
    const is_staff = token===''  ? false : jwtDecode(token).is_staff;

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
                    <Hidden smUp>
                        <IconButton onClick={() => setOpen(!open)}>
                            <Menu/>
                        </IconButton>
                    </Hidden>
                    <Typography variant="h5" noWrap>
                        COBAS
                    </Typography>
                    {is_staff===true ? (
                         <Typography variant="caption" noWrap style={{marginLeft:10}}>
                             Staff
                        </Typography>
                    ) : null}
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
                                <Mail />
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
            <Hidden smUp>
                <SwipeableDrawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <Toolbar/>
                    {!loggedIn?(
                        <List>
                            <ListItem button key={'Login'} onClick={() => setLogin(true)}>
                                <Tooltip title='Login'>
                                    <IconButton fontSize='large'><LockOpen /></IconButton>
                                </Tooltip>
                            </ListItem>
                            <ListItem button key={'SignUp'} onClick={() => setSignUp(true)}>
                                <Tooltip title='Sign Up'>
                                    <IconButton fontSize='large'><AccountCircle /></IconButton>
                                </Tooltip>
                            </ListItem>
                        </List>
                    ): !is_staff? (
                        <Grid container direction="column" alignItems="center" spacing={3} justify="center">
                            <Grid item xs={12}>
                                <IconButton style={{ backgroundColor: colors.blue[600]}}>
                                    <Tooltip title='Your Applications'>
                                        <ListAlt />
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <IconButton style={{ backgroundColor: colors.orange[600]}}>
                                    <Tooltip title='Your Chats'>
                                        <ChatBubble/>
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <IconButton style={{ backgroundColor: colors.green[600]}}>
                                    <Tooltip title='Search Hospitals'>
                                        <LocalHospital />
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <IconButton onClick={() => setLogout(true)} style={{ backgroundColor: colors.cyan[600]}}>
                                    <Tooltip title='Logout'>
                                        <LockOpen />
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                        </Grid>
                    ) : (
                        <List>
                            <ListItem button key={'Chats'} onClick={() => history.push('/staffchat')}>
                                <Tooltip title='Chats'>
                                    <IconButton fontSize='large'><ChatBubble/></IconButton>
                                </Tooltip>
                            </ListItem>
                            <ListItem button key={'Logout'} onClick={() => setLogout(true)}>
                                <Tooltip title='Logout'>
                                    <IconButton fontSize='large'><LockOpen /></IconButton>
                                </Tooltip>
                            </ListItem>
                        </List>
                    )}
                </SwipeableDrawer>
            </Hidden>
            <Hidden smDown>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    anchor="left"
                    open={true}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <Toolbar/>
                    {!loggedIn?(
                        <List>
                            <ListItem button key={'Login'} onClick={() => setLogin(true)}>
                                <Tooltip title='Login'>
                                    <IconButton fontSize='large'><LockOpen /></IconButton>
                                </Tooltip>
                            </ListItem>
                            <ListItem button key={'SignUp'} onClick={() => setSignUp(true)}>
                                <Tooltip title='Sign Up'>
                                    <IconButton fontSize='large'><AccountCircle /></IconButton>
                                </Tooltip>
                            </ListItem>
                        </List>
                    ): !is_staff? (
                        <Grid container direction="column" alignItems="center" spacing={3} justify="center">
                            <Grid item xs={12}>
                                <IconButton style={{ backgroundColor: colors.blue[600]}}>
                                    <Tooltip title='Your Applications'>
                                        <ListAlt />
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <IconButton style={{ backgroundColor: colors.orange[600]}}>
                                    <Tooltip title='Your Chats'>
                                        <ChatBubble/>
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <IconButton style={{ backgroundColor: colors.green[600]}}>
                                    <Tooltip title='Search Hospitals'>
                                        <LocalHospital />
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <IconButton onClick={() => setLogout(true)} style={{ backgroundColor: colors.cyan[600]}}>
                                    <Tooltip title='Logout'>
                                        <LockOpen />
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                        </Grid>
                    ) : (
                        <List>
                            <ListItem button key={'Chats'} onClick={() => history.push('/staffchat')}>
                                <Tooltip title='Chats'>
                                    <IconButton fontSize='large'><ChatBubble/></IconButton>
                                </Tooltip>
                            </ListItem>
                            <ListItem button key={'Logout'} onClick={() => setLogout(true)}>
                                <Tooltip title='Logout'>
                                    <IconButton fontSize='large'><LockOpen /></IconButton>
                                </Tooltip>
                            </ListItem>
                        </List>
                    )}
                </Drawer>
            </Hidden>
            <Login open={login} setOpen={setLogin} setOTP={setOTP}/>
            <SignUp open={signUp} setOpen={setSignUp} otp={otp} setOTP={setOTP}/>
            <OTP open={otp} setOpen={setOTP} setLoggedIn={setLoggedIn}/>
            <Logout open={logout} setOpen={setLogout} setLoggedIn={setLoggedIn}/>
            <UserProfile open={openProfile} handleClose = {handleProfileClose}/>
            <main className={classes.content}>
                <Toolbar variant='dense'/>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/about' component={About}/>
                    <Route exact path='/graphs' component={Graphs}/>
                    <Route path='/hospital/:slug' component={HospitalDetail}/>
                    <Route exact path='/staffchat' component={StaffChat}/>
                </Switch>
            </main>
        </div>
    );
}

export default Navbar;
