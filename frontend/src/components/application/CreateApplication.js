import React from "react";
import {Box, Typography,Checkbox,Paper,Grid, FormControl, Select, InputLabel,makeStyles,IconButton} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {getToken} from "../authentication/cookies";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CloudUpload } from "@material-ui/icons";
import { Document, Page, pdfjs  } from 'react-pdf';
import { useHistory } from "react-router";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles(theme=>({
  map : {
      padding : 10
  },
  large: {
      width: theme.spacing(5),
      height: theme.spacing(5),
  },
  input: {
      display: 'none',
  }
}))

const CreateApplication = () => {
    const token = getToken();
    const history = useHistory();
    const hospital = history.location.state.hospital;
    const [vaccine_info,setVaccineinfo] = React.useState("");
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [url,setUrl] = React.useState(null);
    const classes = useStyles();
    const [switchData,setswitchData] = React.useState({
        is_diabetic: false,
        is_corona_positive : false,
        is_heart_patient : false,
        on_medications: false
    });
    const [numPages, setNumPages] = React.useState(null);
    const [documents,setDocuments] = React.useState([]);
    const [pageNumber, setPageNumber] = React.useState(1);
    const onDocumentLoadSuccess = ({ numPages })=> setNumPages(numPages);
    

    const UploadButtons = ()=> {
      return (
        <React.Fragment>
          <input
            className={classes.input}
            onChange={handlefileUpload}
            type="file"
          />
          <input className={classes.input} id="icon-button-file" type="file" onChange={handlefileUpload}/>
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <CloudUpload fontSize='large'/>
            </IconButton>
          </label>
          
        </React.Fragment>
      );
    }

    const base64toBlob = (data) => {
      // Cut the prefix `data:application/pdf;base64` from the raw base 64
      let base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);
      let bytes = atob(base64WithoutPrefix);
      let length = bytes.length;
      let out = new Uint8Array(length);
      while (length--) {
          out[length] = bytes.charCodeAt(length);
      }
      return new Blob([out], { type: 'application/pdf' });
    };

    const handlefileUpload = (event)=>{
      handleDisplayFile(event.target.files[0]);
      setDocuments([...documents,event.target.files[0]]);
    }

    const handleDisplayFile = (file)=>{
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        let blob = base64toBlob(reader.result);
        let url = URL.createObjectURL(blob);
        setUrl(url)
      }.bind(this);
    }
    const handlefileDelete=(name)=>{
      setDocuments(documents.filter(document=>document.name!==name));
      setUrl(null);
    }
    const handleSwitchChange = (event) =>setswitchData({ ...switchData, [event.target.name]: event.target.checked });
    

    const handleSubmit = () => {
        let data = new FormData();
        let dataObj = {
          ...switchData,
          vaccines : vaccine_info,
          slug : hospital.slug
        }
        data.append('data',JSON.stringify(dataObj));
        documents.forEach((document,index)=>data.append(`file ${index}`,document));

        enqueueSnackbar('Sending data....', {variant: "info", key: 'try_signUp'})
        axios({
            method: 'POST',
            headers: {
                "Content-Type" : "multipart/form-data",
                Authorization: `Token ${token}`
            },
            data: data,
            url: `${process.env.REACT_APP_API_URL}/portal/patients/`
        }).then(response => {
            closeSnackbar('try_signUp')
            enqueueSnackbar('Application Successfull!', { variant: 'success', key: 'signUp_success'})
            setTimeout(() => closeSnackbar('signUp_success'), 5000);
            enqueueSnackbar('Sending OTP...', {variant: 'info', key: 'send-otp'})
        }).catch(error => {
            closeSnackbar('try_signUp')
            enqueueSnackbar('Failed to Register Application', { variant: 'error', key: 'signUp_error'})
            setTimeout(() => closeSnackbar('signUp_error'), 5000)
        })
    }

    return (
      <Grid container spacing={2} justify='center'>
        <Grid item xs={12} md={6} justify='center' alignItems='center'>
          <Paper elevation={3} style={{padding:10,width:'100%',textAlign:'center'}}>
              <Typography variant='h4'>Create an Application for Bed</Typography>
              <Paper elevation={4} style={{padding:10}}>
                <Typography variant='h5' color='textSecondary'>{hospital.name}</Typography>
              </Paper>
                  <FormGroup style={{padding:10}}>
                      <FormControlLabel
                          key={'one'}
                          control={
                          <Checkbox checked={switchData.is_corona_positive}
                            onChange={handleSwitchChange}
                            name="is_corona_positive" />
                          }
                          label="Are you COVID Positive ?"
                      />
                      <FormControlLabel
                          key={'two'}
                          control={<Checkbox checked={switchData.is_diabetic}
                            onChange={handleSwitchChange} 
                            name="is_diabetic" />
                          }
                          label="Are you diabetic?"
                      />
                      <FormControlLabel
                          key={'three'}
                          control={
                          <Checkbox checked={switchData.is_heart_patient}
                            onChange={handleSwitchChange}
                            name="is_heart_patient" />
                          }
                          label="Do you have heart complications ?"
                      />
                      <FormControlLabel
                          key={'four'}
                          control={
                          <Checkbox checked={switchData.on_medications}
                            onChange={handleSwitchChange}
                            name="on_medications" />
                          }
                          label="Are you on some medication ?"
                      />
                </FormGroup>
                  <FormControl style={{width:'100%'}}>
                    <InputLabel id="demo-simple-select-label">Number of Vaccines Doses Taken</InputLabel>
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
                <div style={{
                  display:'flex',
                  justifyContent : 'space-between',
                  alignItems : 'center',
                  width : '100%'
              }}>
                  <Typography variant='h6'>
                      Add Required Documents
                  </Typography>
                  {UploadButtons()}
              </div> 
              <Box style={{margin:10}}>
                {documents.map(document=>(
                  <Paper elevation={3} onClick={handleDisplayFile.bind(this,document)}
                        style={{margin:10,
                                padding:10,
                                display:'flex',
                                justifyContent:'space-between'}}>
                    <Typography variant='caption'>{document.name}</Typography>
                    <Button variant='contained' color='secondary' 
                      onClick={handlefileDelete.bind(this,document.name)}>Remove</Button>
                  </Paper>
                ))}
              </Box>
                <Box style={{margin:10,display:'flex',justifyContent:'space-between'}}>
                    <Button color='secondary' variant='contained' onClick={()=>{
                      setDocuments([]);
                      setVaccineinfo("");
                      setswitchData({
                        is_diabetic: false,
                        is_corona_positive : false,
                        is_heart_patient : false,
                        on_medications: false
                      });
                      setUrl(null);
                    }}>
                        Reset
                    </Button>
                    <Button color="primary" variant='contained' onClick={handleSubmit}>
                        Proceed
                    </Button>
                </Box>
          </Paper> 
       </Grid>
        <Grid item container xs={12} md={6} justify='center' alignItems='center'>
          <Paper elevation={3} style={{overflow:'hidden'}}>
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} />
              </Document>
          </Paper>
        </Grid>
      </Grid>
    )
}

export default CreateApplication;