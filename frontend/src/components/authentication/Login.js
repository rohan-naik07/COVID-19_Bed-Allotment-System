import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import useTheme from "@material-ui/core/styles/useTheme";
import axios from 'axios';
import { useSnackbar } from "notistack";
import {getToken, setCookie} from "./cookies";

export const Login = ({ open, setOpen, setOTP }) => {
    const theme = useTheme();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [values, setValues] = useState({
        email: null,
        password: null,
    });
    const [errors, setErrors] = useState({
        emailError: false,
        passwordError: false,
        loginError: false
    })
    const [visible, setVisible] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.currentTarget.id]: e.currentTarget.value
        })
        if(e.currentTarget.id === 'email')
            setErrors({...errors, emailError: (values.email === null || values.email === '')});
        if(e.currentTarget.id === 'password')
            setErrors({...errors, passwordError: (values.password === null || values.password === '')});
    }

    const handleSubmit = () => {
        if(values.email === null || !values.email.length){
            setErrors({...errors, emailError: true})
            return;
        }
        if(values.password === null || !values.password.length){
            setErrors({...errors, passwordError: true})
            return;
        }

        if(!(errors.passwordError || errors.emailError))
        {
            enqueueSnackbar('Sending data....', {variant: 'info', key: 'try_login'})
            axios({
                method: 'POST',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json"
                },
                data: {
                    email: values.email,
                    password: values.password
                },
                url: '/auth/login/'
            }).then(response => {
                closeSnackbar('try_login')
                setCookie(response.data.token, 'token');
                setErrors({...errors, loginError: false});
                setOpen(false);
                enqueueSnackbar('Logged In Successfully!', { variant: 'success', key: 'login_success'})
                setTimeout(() => closeSnackbar('login_success'), 5000)
                if(!response.data.is_otp_verified)
                {
                    setOTP(true);
                    setCookie(response.data.is_otp_verified, 'verification')
                    enqueueSnackbar('Sending OTP...', {variant: 'info', key: 'send-otp'})
                    axios({
                        method: 'GET',
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type" : "application/json",
                            "Authorization": `Token ${getToken()}`,
                        },
                        url: '/auth/verify-otp/'
                    }).then(response => {
                        closeSnackbar('send-otp')
                        enqueueSnackbar('OTP sent to your email Successfully!', {variant: 'success', key: 'success-send'})
                        setTimeout(() => closeSnackbar('success-resend'), 2000)
                    }).catch(error => {
                        closeSnackbar('resend')
                        enqueueSnackbar('Failed to send OTP', {variant: 'error', key: 'fail-send'})
                        setTimeout(() => closeSnackbar('fail-send'), 2000)
                    })
                }
            }).catch(error => {
                closeSnackbar('try_login')
                setErrors({...errors, loginError: true});
                enqueueSnackbar('Failed to log in', { variant: 'error', key: 'login_error'})
                setTimeout(() => closeSnackbar('login_error'), 5000)
            })
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-login">
                <DialogTitle id="form-dialog-login">Login</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: theme.palette.text.primary }}>
                        You can login into this portal if you have registered on this portal, with a valid email address.
                    </DialogContentText>
                    <TextField
                        id="email"
                        variant="outlined"
                        label="Email Address"
                        type="email"
                        name="email"
                        margin="normal"
                        onChange={handleChange}
                        helperText={errors.emailError?"Enter a valid email address":errors.loginError?"Invalid credentials":null}
                        error={errors.emailError || errors.loginError}
                        fullWidth
                        autoFocus
                        required
                    />
                    <TextField
                        id="password"
                        variant="outlined"
                        label="Password"
                        margin="normal"
                        type={visible? "text":"password"}
                        helperText={errors.passwordError?"Enter a valid password":errors.loginError?"Invalid credentials":null}
                        name="password"
                        onChange={handleChange}
                        InputProps={{
                            endAdornment:
                            <IconButton
                                aria-label="Toggle visibility"
                                onClick={() => setVisible(!visible)}
                            >
                                {visible? <Visibility /> : <VisibilityOff /> }
                            </IconButton>
                        }}
                        error={errors.passwordError || errors.loginError}
                        fullWidth
                        autoFocus
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
