import React from "react";
import {Box, Typography,withStyles,Paper,TextField, FormControl, Select, InputLabel} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import axios from "axios";
import { useSnackbar } from "notistack";

const IOSSwitch = withStyles((theme) => ({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });
  

const CreateApplication = () => {
    const [errors, setErrors] = React.useState(false);
    const [aadharNumber, setaadharNumber] = React.useState("");
    const [vaccine_info,setVaccineinfo] = React.useState("");
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [switchData,setswitchData] = React.useState({
        is_diabetic: true,
        is_corona_positive : true,
        is_heart_patient : true,
        on_medications: true
    });
    const handleChange = (e) => {
      var numbers = /^[0-9]+$/;
      if(e.target.value.match(numbers)){
        setErrors(true)
      } else {
        setaadharNumber(e.target.value);
      }
    }
    const handleSwitchChange = (event) => {
        setswitchData({ ...setswitchData, [event.target.name]: event.target.checked });
    };
    const handleSubmit = () => {
        enqueueSnackbar('Sending data....', {variant: "info", key: 'try_signUp'})
        axios({
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            data: {
            },
            url: `${process.env.REACT_APP_API_URL}/auth/register/`
        }).then(response => {
            closeSnackbar('try_signUp')
            setErrors({...errors, signUpError: false});
            enqueueSnackbar('Signed Up Successfully!', { variant: 'success', key: 'signUp_success'})
            setTimeout(() => closeSnackbar('signUp_success'), 5000);
            enqueueSnackbar('Sending OTP...', {variant: 'info', key: 'send-otp'})
        }).catch(error => {
            closeSnackbar('try_signUp')
            setErrors({...errors, signUpError: true});
            enqueueSnackbar('Failed to Register', { variant: 'error', key: 'signUp_error'})
            setTimeout(() => closeSnackbar('signUp_error'), 5000)
        })
    }

    return (
       <Paper elevation={3} style={{margin : 10,padding:10}}>
           <Typography variant='h4'>Create an Application for Bed</Typography>
           <Paper elevation={3} style={{margin:10,padding:10}}>
               <FormControl component='fieldset'>
                <FormGroup>
                    <FormControlLabel
                        control={<IOSSwitch checked={switchData.is_corona_positive} onChange={handleSwitchChange} name="is_corona_positive" />}
                        label="Are you COVID Positive ?"
                    />
                    <FormControlLabel
                        control={<IOSSwitch checked={switchData.is_diabetic} onChange={handleSwitchChange} name="is_diabetic" />}
                        label="Are you diabetic?"
                    />
                    <FormControlLabel
                        control={<IOSSwitch checked={switchData.is_heart_patient} onChange={handleSwitchChange} name="is_heart_patient" />}
                        label="Do you have heart complications ?"
                    />
                    <FormControlLabel
                        control={<IOSSwitch checked={switchData.on_medications} onChange={handleSwitchChange} name="on_medications" />}
                        label="Are you on some medication ?"
                    />
                    </FormGroup>
               </FormControl>
           </Paper>
            <Paper elevation={3} style={{margin:10,padding:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <FormControl style={{width:'100%'}}>
                  <InputLabel id="demo-simple-select-label">Select Number of Vaccines Doses Taken</InputLabel>
                  <Select
                    labelId="vaccine"
                    value={vaccine_info}
                    onChange={(e)=>setVaccineinfo(e.target.value)}
                  >
                    <MenuItem value={'No Doses Taken'}>No Doses Taken</MenuItem>
                    <MenuItem value={'First Dose Over'}>First Dose Over</MenuItem>
                    <MenuItem value={'All Doses Over'}>All Doses Over</MenuItem>
                  </Select>
                </FormControl>
            </Paper>
           <TextField
                variant="outlined"
                label="Your Aadhar Number"
                type="text"
                margin="normal"
                value={aadharNumber}
                error={errors}
                helperText={errors?"Enter a valid number":null}
                onChange={handleChange}
                fullWidth
                required
            />
            <Box style={{margin:10,display:'flex',justifyContent:'space-between'}}>
                <Button color="primary">
                    Reset
                </Button>
                <Button color="primary">
                    Proceed
                </Button>
            </Box>
       </Paper>
    )
}

export default CreateApplication;