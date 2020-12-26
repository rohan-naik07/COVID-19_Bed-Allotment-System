import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useTheme from "@material-ui/core/styles/useTheme";
import { useSnackbar } from "notistack";
import TextField from "@material-ui/core/TextField";
import axios from 'axios';
import {getToken} from "./cookies";

export const OTP = ({ open, setOpen, setLoggedIn }) => {
    const theme = useTheme();
    const [state, setState] = React.useState({
        verify: null,
        error: false,
    });
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [disabled, setDisabled] = React.useState(true)

    const handleChange = (e) => {
        setState({
            ...state,
            [e.currentTarget.id]: e.currentTarget.value
        })
    }

    const handleResend = () => {
        enqueueSnackbar('Resending...', {variant: 'info', key: 'resend'})
        axios({
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Token ${getToken()}`,
            },
            url: '/auth/verify-otp/'
        }).then(response => {
            closeSnackbar('resend')
            enqueueSnackbar('Resent Successfully!', {variant: 'success', key: 'success-resend'})
            setTimeout(() => closeSnackbar('success-resend'), 2000)
        }).catch(error => {
            closeSnackbar('resend')
            setDisabled(false);
            enqueueSnackbar('Failed to send OTP', {variant: 'error', key: 'fail-resend'})
            setTimeout(() => closeSnackbar('fail-resend'), 2000)
        })
        setDisabled(true);
        setTimeout(() => setDisabled(false), 30*1000);
    }

    const handleSubmit = () => {
        enqueueSnackbar('Verifying....', {variant: 'info', key: 'verification'})
        if(state.verify === '')
            setState({
                ...state,
                error: true,
            })
        axios({
            method: 'post',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Token ${getToken()}`,
            },
            data: {
                otp: state.verify,
            },
            url: '/auth/verify-otp/'
        }).then(response => {
            document.cookie = "verification=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            closeSnackbar('verification')
            enqueueSnackbar('Otp verified Successfully!', {variant: 'success', key: 'success'})
            setTimeout(() => closeSnackbar('success'), 3000)
            setOpen(false)
        }).catch(error => {
            enqueueSnackbar(error.response.data.message, {variant: 'error', key: 'false-otp'})
            setTimeout(() => closeSnackbar('false-otp'))
            setState({
                ...state,
                error: true
            })
        })
    }

    const handleCancellation = () => {
        enqueueSnackbar('Logging out....', {variant: 'info', key: 'logging_out'})
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setTimeout(() => closeSnackbar('logging_out'), 3000);
        setTimeout(() => enqueueSnackbar('Logged out Successfully!', {variant: 'success', key: 'logged_out'}), 3000);
        setTimeout(() => closeSnackbar('logged_out'), 6000);
        setTimeout(() => setLoggedIn(false), 3000);
        setOpen(false);
    }

    React.useEffect(() => {
        setDisabled(true);
        setTimeout(() => setDisabled(false), 30*1000);
    }, [open])

    return (
        <div>
            <Dialog open={open} aria-labelledby="form-dialog-otp">
                <DialogTitle id="form-dialog-otp">OTP Verification</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: theme.palette.text.primary }}>
                        Verify the one time password sent on your email
                    </DialogContentText>
                    <TextField
                        id="verify"
                        variant="outlined"
                        label="Verification OTP"
                        type="text"
                        name="verify"
                        margin="normal"
                        onChange={handleChange}
                        helperText={state.error?"Enter a valid OTP":null}
                        error={state.error}
                        fullWidth
                        autoFocus
                        required
                    />
                    <DialogContentText style={{ color: theme.palette.text.primary }}>
                        You have to wait for 30 seconds before resending OTP
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancellation} color="primary">
                        Cancel Verification
                    </Button>
                    <Button onClick={handleResend} color="primary" disabled={disabled}>
                        Resend OTP
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Verify
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
