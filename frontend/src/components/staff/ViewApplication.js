/* eslint-disable */
import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { useSnackbar } from "notistack";
import {getToken} from "../authentication/cookies";
import { Chip, Grid, Paper } from '@material-ui/core';

const ViewApplication = ({ open, setOpen ,id }) => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [errors, setErrors] = useState("")
    const [application,setApplication] = useState(null);
    const [status,setStatus] = React.useState({
        accepted : false,
        rejected : false
    });
    const handleClose = () => setOpen(false);
    const showAlert = (key,message,variant)=>enqueueSnackbar(message, {variant: variant, key: key});
    const closeAlert = (key,time)=>setTimeout(() => closeSnackbar(key),time);

    React.useEffect(() => {
        showAlert('data','Loading...','info');
        axios.get(`${process.env.REACT_APP_API_URL}/portal/patients/${id}/`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${getToken()}`,
                }
            }).then(res => {
                closeAlert('data',2000);
                setApplication(res.data);
                console.log(res.data);
            }).catch(err=>{
                closeAlert('data',2000);
                setErrors(err.message)
                showAlert('error',err.message,'error');
                closeAlert('error',2000);
            })
    }, []);


    const handleSubmit = (accepted) => {
        let data = {
            ...application,
            accepted : accepted,
            rejected : !accepted
        };
        axios({
            method: 'PATCH',
            headers: {
                "Content-Type" : "application/json"
            },
            data : data,
            url: `${process.env.REACT_APP_API_URL}/portal/patients/${id}/`
        }).then(response => {
            closeAlert('data',2000);
        }).catch(error => {
            closeAlert('data',2000);
            showAlert('error',error.message,'error');
            closeAlert('error',2000);
        })
    }
    

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-login">
            <DialogTitle id="form-dialog-login">Application</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} justify='center' alignItems='center'>
                        <Paper elevation={3} style={{display:'flex',justifyContent:'center'}}>
                            {application.is_diabetic ? <Chip
                                label="Diabetic"
                                variant="default"
                                style={{ margin: '1% 1% 0 0'}}/> : null}
                            {application.is_corona_positive ? <Chip
                                label="Corona Positive"
                                variant="default"
                                style={{ margin: '1% 1% 0 0'}}/> : null}
                            {application.is_heart_patient ? <Chip
                                label="Heart Patient"
                                variant="default"
                                style={{ margin: '1% 1% 0 0'}}/> : null}
                            {application.on_medications ? <Chip
                                label="On Medications"
                                variant="default"
                                style={{ margin: '1% 1% 0 0'}}/> : null}
                        </Paper>
                        <Paper elevation={3} style={{padding:10,textAlign:'center'}}>
                            {application.vaccines}
                        </Paper>
                        <Paper elevation={3} style={{padding:10}}>
                            
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} justify='center' alignItems='center'>
                        
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit.bind(this,true)} color="primary">
                    Accept
                </Button>
                <Button onClick={handleSubmit.bind(this,false)} color="secondary">
                    Reject
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ViewApplication;