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
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import clsx from "clsx";
import {AccountCircle, ExitToApp, LockOpen, People} from "@material-ui/icons";
import {getCookie, getToken} from "../authentication/cookies";
import {Login} from "../authentication/Login";
import {SignUp} from "../authentication/SignUp";
import {OTP} from "../authentication/OTP";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
    },
    menuButton: {
        marginRight: theme.spacing(2),
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
}));

export default function ClippedDrawer() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState(false);
    const [signUp, setSignUp] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [logout, setLogout] = React.useState(false);
    const [otp, setOTP] = React.useState(false);

    useEffect(() => {
        let token = getToken();
        if (token !== '') {
            setLoggedIn(true);
            if (getCookie('verification')) {
                setOTP(true);
            }
        }
    }, [])

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
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
                <Toolbar />
                <div className={classes.drawerContainer}>
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
                    <Divider />
                </div>
            </Drawer>
            <Login open={login} setOpen={setLogin} setOTP={setOTP}/>
            <SignUp open={signUp} setOpen={setSignUp} otp={otp} setOTP={setOTP}/>
            <OTP open={otp} setOpen={setOTP} setLoggedIn={setLoggedIn}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <Toolbar />
                <Typography paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
                    facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
                    gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
                    donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                    adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
                    Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
                    imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
                    arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                    donec massa sapien faucibus et molestie ac.
                </Typography>
                <Typography paragraph>
                    Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
                    facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
                    tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
                    consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
                    vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
                    hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
                    tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
                    nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
                    accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
                </Typography>
            </main>
        </div>
    );
}
