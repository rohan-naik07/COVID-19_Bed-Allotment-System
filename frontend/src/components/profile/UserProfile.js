import React, {useEffect, useState,useCallback} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fade from "@material-ui/core/Fade";
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { lightBlue } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import axios from "axios";
import { useSnackbar } from "notistack";
import {getToken} from "../authentication/cookies";
import DateFnsUtils from "@date-io/date-fns";
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from "@material-ui/core/CircularProgress";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
      root: {
        padding: '20px',
        width: '100%'
      },
      closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
      paper: {
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
        width : 250
      },
      bannerBackground: {
        borderRadius: '5px',
        backgroundSize: 'cover',
        display : 'flex',
        justifyContent : 'center',
        backgroundRepeat: 'no-repeat',
    },
    avatar: {
        backgroundColor: lightBlue[900],
        color: 'white',
        width: theme.spacing(15),
        marginBottom : 40,
        boxShadow: theme.shadows[10],
        fontSize: 50,
        borderStyle: 'solid',
        borderColor: 'white',
        height: theme.spacing(15)
    },
    progressBar : {
      display: 'flex',
      '& > * + *': {
          marginLeft: theme.spacing(2),
      },
      justifyContent: 'center',
  } 
  })
);


const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);


export default function UserProfile(props) {
  const {open,handleClose} = props;
  const styles = useStyles();
  const [spinner, setSpinner] = useState(true);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [values, setValues] = useState({
      first_name: '',
      last_name: '',
      contact: null,
      email: '',
      birthday: '',
      weight : 0});
  const [editable,setEditable] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [errors, setErrors] = useState({
          nameError: false,
          contactError: false,
          editError: false});
  const setProfileEdit = ()=> setEditable(editable=>!editable);
 

  useEffect(() => {
          axios({
              method: 'GET',
              headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type" : "application/json",
                  "Authorization": `Token ${getToken()}`,
              },
              url: '/portal/patient-details/'
          }).then(res => {
              setValues({
                  first_name: res.data.data.first_name,
                  last_name: res.data.data.last_name,
                  contact: res.data.data.contact,
                  email: res.data.data.email,
                  graduation: res.data.data.graduation,
                  birthday: res.data.data.birthday,
                  weight: res.data.data.weight,
              });
              handleDateChange(new Date(res.data.birthday));
              console.log(res.data)
              return true;
          }).then(val => {
              setSpinner(false);
          }).catch(error => {
              console.log(error);
          })
      }, [open])

      const handleChange = (e) => {
        setValues({
            ...values,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth={true}>
        <MuiDialogTitle disableTypography className={styles.root}>
          <Typography variant="h6">User Profile</Typography>
            <IconButton aria-label="edit" className={styles.closeButton} onClick={setProfileEdit}>
              <EditIcon />
            </IconButton>
        </MuiDialogTitle>
                <DialogContent dividers>
                <Grid container className={styles.root} spacing={3}>
                  {spinner ? (
                    <Grid item xs={12}>
                      <Typography variant='h4'>Loading your info...</Typography>
                    </Grid>
                  ) : (
                    <React.Fragment>
                    <Fade in={true} timeout={1000}>
                         <Grid item xs={6}>
                           <Paper className={styles.bannerBackground} elevation={0}>
                               <Avatar className={styles.avatar}>H</Avatar>
                           </Paper>
                           <Paper className={styles.paper} elevation={2}>
                             <TextField
                                 id="email"
                                 variant="outlined"
                                 label='Email'
                                 type="text"
                                 defaultValue={values.email}
                                 name="Email"
                                 margin="normal"
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
                             <TextField
                                 id="contact"
                                 variant="outlined"
                                 label='Contact'
                                 type="number"
                                 name="Contact"
                                 margin="normal"
                                 defaultValue={values.contact}
                                 autoFocus
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
                           </Paper>
                         </Grid>
                     </Fade>
                     <Fade in={true} timeout={1000}>
                     <Grid item xs={6}>
                         <Paper className={styles.paper} elevation={2}>
                             <TextField
                                 id="first_name"
                                 variant="outlined"
                                 label="First Name"
                                 type="text"
                                 defaultValue={values.first_name}
                                 name="first_name"
                                 margin="normal"
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
                             <TextField
                                 id="last_name"
                                 variant="outlined"
                                 label="Last Name"
                                 type="text"
                                 name="last_name"
                                 margin="normal"
                                 defaultValue={values.last_name}
                                 autoFocus
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
                             <TextField
                                 id="weight"
                                 variant="outlined"
                                 label="Weight"
                                 type="number"
                                 name="Weight"
                                 margin="normal"
                                 defaultValue={values.weight}
                                 autoFocus
                                 style={{ marginLeft: "20px" }}
                                 disabled={!editable}
                                 error={errors.nameError || errors.editError}
                                 helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                 onChange={handleChange}/>
 
                             <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                 <KeyboardDatePicker
                                     clearable
                                     placeholder="Enter your birth date"
                                     defaultValue={values.birthday}
                                     inputVariant={'outlined'}
                                     minDate={new Date(1950, 5, 1)}
                                     format="MM/dd/yyyy"
                                     label='Birthday'
                                     margin="normal"
                                     style={{ marginLeft: "20px"}}
                                     disabled={!editable}
                                     error={errors.nameError || errors.editError}
                                     helperText={errors.nameError?"Enter a valid name":errors.editError?"Invalid credentials":null}
                                     onChange={handleChange}
                                 />
                             </MuiPickersUtilsProvider>
                         </Paper>
                     </Grid>
                     </Fade></React.Fragment>
                  )}
                </Grid>
            </DialogContent>
      </Dialog>
    </div>
  );
}