import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import axios from "axios";
import { useSnackbar } from "notistack";
import {getToken, setCookie} from "./cookies";

export const SignUp = ({ open, setOpen, otp, setOTP }) => {
    const [values, setValues] = useState({
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        confirmPassword: null,
        contact: null,
    });
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [errors, setErrors] = useState({
        nameError: false,
        contactError: false,
        emailError: false,
        passwordError: false,
        confirmPasswordError: false,
        signUpError: false,
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
    }

    const handleSubmit = () => {
        if (values.first_name === null || values.first_name === '' || values.last_name === null || values.last_name === '') {
            setErrors({...errors, nameError: true})
            return;
        }
        if (values.contact === null || values.contact === '') {
            setErrors({...errors, contactError: true})
            return;
        }
        if (values.email === null || values.email === '') {
            setErrors({...errors, emailError: true})
            return;
        }
        if (values.password === null || values.password === '') {
            setErrors({...errors, passwordError: true})
            return;
        }
        if (values.confirmPassword !== values.password) {
            setErrors({...errors, confirmPasswordError: true})
            return;
        }
        if(!(errors.passwordError || errors.emailError || errors.confirmPasswordError || errors.nameError || errors.emailError))
        {
            enqueueSnackbar('Sending data....', {variant: "info", key: 'try_signUp'})
            axios({
                method: 'POST',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json"
                },
                data: {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    contact: values.contact,
                    email: values.email,
                    password: values.password
                },
                url: '/auth/register/'
            }).then(response => {
                closeSnackbar('try_signUp')
                setCookie(response.data.token, 'token');
                setCookie(response.data.is_otp_verified, 'verification');
                setErrors({...errors, signUpError: false});
                setOpen(false);
                enqueueSnackbar('Signed Up Successfully!', { variant: 'success', key: 'signUp_success'})
                setTimeout(() => closeSnackbar('signUp_success'), 5000);
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
            }).catch(error => {
                closeSnackbar('try_signUp')
                setErrors({...errors, signUpError: true});
                enqueueSnackbar('Failed to Register', { variant: 'error', key: 'signUp_error'})
                setTimeout(() => closeSnackbar('signUp_error'), 5000)
            })
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-login">
                <DialogTitle id="form-dialog-login">SignUp</DialogTitle>
                <DialogContent>
                    <TextField
                        id="first_name"
                        variant="outlined"
                        label="First Name"
                        type="text"
                        name="first_name"
                        margin="normal"
                        error={errors.nameError || errors.signUpError}
                        helperText={errors.nameError?"Enter a valid name":errors.signUpError?"Invalid credentials":null}
                        onChange={handleChange}
                        autoFocus
                        required
                    />
                    <TextField
                        id="last_name"
                        variant="outlined"
                        label="Last Name"
                        type="text"
                        name="last_name"
                        margin="normal"
                        onChange={handleChange}
                        error={errors.nameError || errors.signUpError}
                        helperText={errors.nameError?"Enter a valid name":errors.signUpError?"Invalid credentials":null}
                        autoFocus
                        style={{ marginLeft: "20px" }}
                        required
                    />
                    <TextField
                        id="email"
                        variant="outlined"
                        label="Email Address"
                        type="email"
                        name="email"
                        margin="normal"
                        onChange={handleChange}
                        helperText={errors.emailError?"Enter a valid email address":errors.signUpError?"Invalid credentials":null}
                        fullWidth
                        autoFocus
                        required
                    />
                    <TextField
                        id="contact"
                        variant="outlined"
                        label="Contact Number"
                        type="number"
                        name="contact"
                        margin="normal"
                        error={errors.contactError || errors.signUpError}
                        helperText={errors.contactError?"Enter a valid contact":errors.signUpError?"Invalid credentials":null}
                        onChange={handleChange}
                        autoFocus
                        required
                    />
                    <TextField
                        id="password"
                        variant="outlined"
                        label="Password"
                        margin="normal"
                        type={visible? "text":"password"}
                        error={errors.passwordError || errors.signUpError}
                        helperText={errors.passwordError?"Enter a valid password":errors.signUpError?"Invalid credentials":null}
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
                        fullWidth
                        autoFocus
                        required
                    />
                    <TextField
                        id="confirmPassword"
                        variant="outlined"
                        label="Confirm Password"
                        margin="normal"
                        type={visible? "text":"password"}
                        name="confirmPassword"
                        error={errors.confirmPasswordError || errors.signUpError}
                        helperText={errors.confirmPasswordError?"Passwords do not match!":errors.signUpError?"Invalid credentials":null}
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
                        SignUp
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
