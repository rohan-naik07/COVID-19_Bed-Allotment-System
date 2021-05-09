import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import {reviews} from './reviews';
import ChatScreen from './ChatScreen';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme)=>({
    table: {
      minWidth: 650,
    },
    chatSection: {
      width: '100%',
      height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
      height: '70vh',
      overflowY: 'auto'
    },
    container: {
        position: 'relative',
        borderRadius : 20,
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
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
        backgroundColor: 'rgba(0,0,0,.2)',
      },
      content: {
        position: 'relative',
        width : '100%',
        paddingTop: theme.spacing(1),
        marginTop: 100,
        [theme.breakpoints.up('md')]: {
          padding: theme.spacing(6),
          paddingRight: 0,
        },
      }
  }));

const Chat = (props) => {
    const classes = useStyles();
    const hospital = props.location.state.hospital;

    const renderReviews = ()=>{
        return (
            <React.Fragment>
                {reviews.map(review=>(
                    <Paper key={review._id} elevation={2} style={{
                        margin : 10,
                        padding : 10
                    }}>
                        <div style={{display:'flex',justifyContent : 'space-between'}}>
                            <Typography variant="h6">
                                {review.feedback}
                            </Typography>
                            <Rating name="read-only" value={review.overallRating} readOnly />
                        </div>
                        <Divider fullWidth/>
                        <Typography variant="h6" color='textSecondary'>
                            {review.reviewDate}
                        </Typography>
                    </Paper>
                ))}
            </React.Fragment>
        )
    }


    return (
        <Grid container spacing={2} style={{ overflow:'hidden',}}>
            <Grid item xs={6}>
                <Paper elevation={3} style={{padding:10}}>
                    <Paper className={classes.container} style={{ backgroundImage: `url(${hospital.img})` }}>
                        {/* Increase the priority of the hero background image */}
                        {<img style={{ display: 'none',marginTop:"10Px" }} src={`url(${hospital.img})`} alt='bg'/>}
                        <div className={classes.overlay} />
                        <Grid container>
                            <Grid item md={12}>
                                <div className={classes.content}>
                                    <Typography component="h1" variant="h3" color="inherit">
                                        {hospital.name}
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Paper>
                    <div style={{display:'flex',justifyContent:'space-around'}}>
                        <Chip size='large' label={`${hospital.total_beds} beds `} color='primary'/>
                        <Chip size='large' label={`${hospital.beds_availiable} beds availiable`} color='secondary'/>
                        <Button variant='contained' color='primary'>Book a bed</Button>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',paddingTop:10}}>
                        <a href={hospital.website} style={{width:"50%"}}>
                            <Button variant='outlined' color='primary'>Visit Us</Button>
                        </a>
                        <Paper elevation={1} style={{width:"50%",textAlign:'center'}}>
                            <Typography variant='h4'>{hospital.contact}</Typography>
                        </Paper>
                    </div>
                </Paper>
                <Paper  elevation={3} style={{
                    width : '100%',
                    height : 200,
                    marginTop : 10,
                    overflow : 'auto'
                }}>
                    {renderReviews()}
                </Paper>
            </Grid>
            <Grid item xs={6}>
                  <ChatScreen id={hospital._id} />  
            </Grid>
        </Grid>
    )
}

export default Chat;