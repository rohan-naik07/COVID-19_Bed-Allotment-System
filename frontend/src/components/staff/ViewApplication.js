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
import { Box, Chip, Grid, Link, Paper, Typography } from '@material-ui/core';

const ViewApplication = ({ open, setOpen ,application }) => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const token = getToken();
    const [errors, setErrors] = useState("")
    const handleClose = () => setOpen(false);
    const showAlert = (key,message,variant)=>enqueueSnackbar(message, {variant: variant, key: key});
    const closeAlert = (key,time)=>setTimeout(() => closeSnackbar(key),time);

    const handleSubmit = (accepted) => {
        showAlert('try_data','Sending...','error');
        axios({
            method: 'PATCH',
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Token ${token}`
            },
            data : {
                accepted : accepted
            },
            url: `${process.env.REACT_APP_API_URL}/portal/patients/${application.id}/`
        }).then(response => {
            closeAlert('try_data',2000);
            showAlert('try_data','Successfully updated status!','error');
            closeAlert('try_data',2000);
        }).catch(error => {
            closeAlert('data',2000);
            showAlert('error',error.message,'error');
            closeAlert('error',2000);
        })
    }

    const filters =()=>{
        let object = {
          "First dose taken" : application.is_first_dose,
          "Second dose taken" : application.is_second_dose,
        }
        let key = Object.keys(object).filter(key=>filters[key]===true);
        if(key.length===0){
          return "No doses taken";
        } 
        return key[0];
      } 
    

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-login" fullWidth={true}>
            <DialogTitle id="form-dialog-login">{`Application by ${application.user.first_name} ${application.user.last_name}`}</DialogTitle>
            <DialogContent>
                <Paper elevation={3} style={{margin:10,padding:10,display:'flex',justifyContent:'space-between'}}>
                    <Typography variant='h6' color='textSecondary'> {`Email`}</Typography>
                    <Typography variant='h6' color='primary'> {`${application.user.email}`}</Typography>
                </Paper>
                <Paper elevation={3} style={{margin:10,padding:10,display:'flex',justifyContent:'space-between'}}>
                    <Typography variant='h6' color='textSecondary'> {`Age`}</Typography>
                    <Typography variant='h6' color='primary'> {Math.round(
                        (new Date().getTime()-new Date(application.user.birthday).getTime())/(365*1000*60*60*24))}</Typography>
                </Paper>
                <Paper elevation={3} style={{margin:10,padding:10,display:'flex',justifyContent:'space-between'}}>
                    <Typography variant='h6' color='textSecondary'>{`Contact`}</Typography>
                    <Typography variant='h6' color='primary'>{application.user.contact}</Typography>
                </Paper>
                <Paper elevation={3} style={{margin:10,padding:10,display:'flex',justifyContent:'space-between'}}>
                    <Typography variant='h6' color='textSecondary'>{`Weight`}</Typography>
                    <Typography variant='h6' color='primary'>{application.user.weight}</Typography>
                </Paper>
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
                    <Chip
                        label={filters()}
                        variant="primary"
                        style={{ margin: '1% 1% 0 0'}}/> 
                 </Paper>
                <Box style={{padding:10}}>
                    <Typography variant='h6'>{`Required Documents`}</Typography>
                    {application.documents.map(document=>(
                        <Paper elevation={3} 
                        style={{margin:10,
                            padding:10,
                            display:'flex',
                            justifyContent:'space-between'}}>
                            <Typography variant='caption'>{document.split('/')[3]}</Typography>
                            <Button variant='contained' color='secondary'
                              onClick={()=>window.open(`${process.env.REACT_APP_API_URL}${document}`)}
                            >View Document</Button>
                        </Paper>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit.bind(this,true)} color="primary" variant='contained'>
                    Accept
                </Button>
                <Button onClick={handleSubmit.bind(this,false)} color="secondary" variant='contained'>
                    Reject
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ViewApplication;