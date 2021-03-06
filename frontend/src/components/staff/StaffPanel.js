import React from "react";
import {Box, Divider, Grid, makeStyles, TextField,Typography,Paper,Button,Chip, Container} from "@material-ui/core";
import jwtDecode from 'jwt-decode'
import {getToken} from "../authentication/cookies";
import { LineChart,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from "axios";
import { useSnackbar } from "notistack";
import { EventNote } from "@material-ui/icons";
import ViewApplication from "./ViewApplication";

const useStyles = makeStyles((theme)=>({
    container: {
        position: 'relative',
        borderRadius : 20,
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(3),
        backgroundImage: `url(${Image})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      },
      overlay: {
        position: 'absolute',
        top: 0,
        borderRadius : 20,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.5)',
      },
      content: {
        position: 'relative',
        width : '100%',
        paddingTop: theme.spacing(5),
        padding : 10
      }
  }));

const StaffPanel = () => {
    let token = getToken();
    const classes = useStyles();
    const [hospital,setHospital] = React.useState([]);
    const [edit,setEdit] = React.useState(false);
    const [id,setId] = React.useState(null);
    const [beds,setBeds] = React.useState(0);
    const [graphData,setgraphData] = React.useState([]);
    const [applications,setApplications] = React.useState([]);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const showAlert = (key,message,variant)=>enqueueSnackbar(message, {variant: variant, key: key});
    const closeAlert = (key,time)=>setTimeout(() => closeSnackbar(key),time);
    const [open,setOpen] = React.useState(false);

    React.useEffect(()=>{
      showAlert('data','Loading...','info');
      let slug = token==='' ? '' : jwtDecode(token).hospital_slug;
      if(slug===''){ return; }
      axios.get(`${process.env.REACT_APP_API_URL}/portal/hospitals/${slug}/`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${getToken()}`,
            }
        }).then(res=>{
          closeAlert('data',2000);
          setHospital(res.data)
          setBeds(res.data.total_beds);
          showAlert('data','Loading applications...','info');
          axios.get(`${process.env.REACT_APP_API_URL}/portal/patients/`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${getToken()}`,
            }
            }).then(res=>{
              closeAlert('data',2000);
              setApplications(res.data);
              getGraphData(res.data);
            }).catch(err=>{
              closeAlert('data',2000);
              showAlert('chats_error',err.message,'error');
              closeAlert('chats_error',2000);
            })
        }).catch(err=>{
          closeAlert('data',2000);
          showAlert('chats_error',err.message,'error');
          closeAlert('chats_error',2000);
        })
        // eslint-disable-next-line
    },[])

    const getGraphData = (applications)=>{
      let data = [];
      let obj={}
      applications.forEach(application=>obj[new Date(application.applied_date).toDateString()] = 0);
      applications.forEach(application=>obj[new Date(application.applied_date).toDateString()] +=1);
      Object.keys(obj).map(key=>data.push({date : key,number:obj[key]}));
      setgraphData(data);
    }

    const updateBeds = ()=>{
      let slug = token==='' ? '' : jwtDecode(token).hospital_slug;
      if(slug===''){ 
        return; 
      }
      showAlert('bed','Updating bed capacity...','info');
      axios.patch(`${process.env.REACT_APP_API_URL}/portal/hospitals/${slug}/`,{
        total_beds : beds
      },{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${getToken()}`,
            }
        }).then(res=>{
          closeAlert('bed',2000);
          showAlert('bed_update','Successfully updated bed capacity!','info');
          closeAlert('bed_update',2000);
        }).catch(err=>{
          closeAlert('bed',2000);
          showAlert('bed_error',err.message,'error');
          closeAlert('bed_error',2000);
        })
    }

    const filters =(application)=>{
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
      <Container>
        <Grid container style={{padding:5}} spacing={2}>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.container} style={{ backgroundImage: `url(${hospital.imageUrl})` }}>
                    {<img style={{ display: 'none',marginTop:"10Px" }} src={`url(${hospital.imageUrl})`} alt='bg'/>}
                    <div className={classes.overlay} />
                    <Box className={classes.content}>
                        <Typography component="h1" variant="h3" color="inherit">
                            {hospital.name}
                        </Typography>
                        <br/>
                        <Box style={{display:'flex',justifyContent:'flex-end'}}>
                            <Chip size='medium' variant='outlined' label={`Average Rating : 3.4`} color='primary'/>
                        </Box>
                    </Box>
                </Paper>
                <Paper elevation={3} style={{padding:10}}>
                    <Typography component="h1" variant="h4" color="textSecondary">
                        Bed Allotment Status
                    </Typography>
                    <Divider/>
                    <Box style={{display:'flex',padding:10,justifyContent:'space-around'}}>
                        <Chip size='medium' label={`${hospital.available_beds} Beds Available`} color='primary'/>
                        <Chip size='medium' label={`${100-(Math.round(hospital.available_beds/beds*100))}% occupied`}/>
                    </Box>
                    <Box style={{display:'flex',justifyContent:'space-between',padding:10,alignItems:'center'}}>
                        <Typography  variant="h5">
                            Total Beds
                        </Typography>
                        <TextField variant='outlined' value={beds} disabled={edit===true} onChange={event=>setBeds(event.target.value)}/>
                        {edit===false ? 
                          <Button variant='outlined' color='primary' onClick={()=>{
                            updateBeds();
                            setEdit(!edit);
                          }}>Update</Button> :
                          <Button variant='outlined' color='primary' onClick={()=>setEdit(!edit)}>Edit</Button>
                        }
                    </Box>                     
                </Paper>
                <Paper elevation={3} style={{padding:10,marginTop:20}}>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart width={600} height={200} data={graphData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="number" stroke="#ffc107" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={3} style={{padding:10,display:'flex',alignItems:'center'}}>
                <EventNote fontSize='large' color='primary'/>
                <Typography component="h1" variant="h4" style={{marginLeft:10}}>
                  Applications
                </Typography>
              </Paper>
              <Box style={{padding:10,height:600,overflow:'auto'}}>
                  {applications.map(application=>(
                    <Paper elevation={3} key={application.user.id} style={{padding:10,marginTop:10}}>
                      <Typography component="h1" variant="h5">
                        {`${application.user.first_name} ${application.user.last_name}`}
                      </Typography>
                      <Box style={{display:'flex',justifyContent:'space-between',padding:5}}>
                        <Chip size='medium' label={`Age ${Math.round(
                          (new Date().getTime()-new Date(application.user.birthday).getTime())/(365*1000*60*60*24)
                          )}`} color='primary'/>
                        <Chip size='medium' label={filters(application)}/>
                      </Box>
                      <Box style={{display:'flex',justifyContent:'space-between',padding:5,alignItems:'center'}}>
                        <Typography component="h1" variant="caption">
                          {new Date(application.applied_date).toDateString()}
                        </Typography>
                        <Button variant='contained' color='primary' onClick={()=>{
                          setOpen(true);
                          setId(application);
                        }}>View Details</Button>
                      </Box>
                    </Paper>
                  ))}
              </Box>           
            </Grid>
            {id ? <ViewApplication open={open} setOpen={setOpen} application={id}/> : null}
        </Grid>
      </Container>
    )
}

export default StaffPanel;