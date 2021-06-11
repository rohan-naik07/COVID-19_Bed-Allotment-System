import React from "react";
import {Typography,Card,CardMedia,Grid,Paper,makeStyles,CardContent, Container} from "@material-ui/core";
import pranjal from './pranjal.jpg';
import thite from './thite1811-2.jpeg';
import rohan from './rohan.jpg'

const useStyles = makeStyles((theme) => ({
    card: {
        margin: '1.5rem',
        padding: '1.5rem',
        textAlign: 'center',
        textDecoration: 'none',
        justifyContent: 'center',
        border: '1px solid #eaeaea',
        borderRadius: '5%',
        transition: 'color 0.15s ease, border-color 0.15s ease',
        '&:hover, &:active, &:focus': {
            color: theme.palette.type === 'light'?'#0070f3': '#00c0ff',
            borderColor: theme.palette.type === 'light'?'#0070f3': '#00c0ff'
        },
        '& p': {
            margin: 0,
            fontSize: '1.25rem',
            lineHeight: '1.5'
        },
    },
    title: {
        margin: '2%',
        lineHeight: '1.15',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
            fontSize: '2.5rem',
        },
        [theme.breakpoints.up('md')]: {
            fontSize: '6.5rem'
        },
    },
    media: {
        height: 250,
        width: 250,
        margin: 'auto',
        borderRadius: '20px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    }
}))

const About = () => {
    const classes = useStyles();
    return (
        <Container>
        <Grid item container direction="row" justify="center" style={{ height: "100%",padding:10}}>
             <Grid item xs={12} sm={6}>
                <a href={"https://github.com/pranjal2410"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <Card className={classes.card} component={Paper} elevation={5}>
                    <CardMedia
                            className={classes.media}
                            image={pranjal}
                            component='img'
                            title='Pranjal Newalkar'
                        />
                        <Typography gutterBottom color='textPrimary' variant="h5" component="h2" style={{ marginTop: '5px'}}>
                            Pranjal Newalkar
                        </Typography>
                        <Typography variant='caption'>
                            I am a full stack web developer currently pursuing a bachelor's degree in 
                            Electronics and Telecommunication Engineering from Pune Institute of Computer Technology. 
                            I am highly interested in building web applications and services which make 
                            use of artificial intelligence and machine learning.
                        </Typography>
                    </Card>
                </a>
             </Grid>
             <Grid item xs={12} sm={6}>
                <a href={"https://github.com/rohan-naik07"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <Card className={classes.card} component={Paper} elevation={5}>
                        <CardMedia
                            className={classes.media}
                            image={rohan}
                            component='img'
                            title='Rohan Naik'
                        />
                        <Typography gutterBottom color='textPrimary' variant="h5" component="h2" style={{ marginTop: '5px'}}>
                             Rohan Naik
                        </Typography>
                        <Typography variant='caption'>
                            I am self driven passionate programmer who loves to translate solutions to real world problems into code. 
                            I am currently pursueing bachelor's degree in Computer Engineering from Pune Institute of Computer Technology.
                            My main areas of interest are full stack development,Data Structures and Algorithms,Deep Learning,Digital Designing
                            ,Cricket and Music.
                        </Typography>
                    </Card>
                </a>
             </Grid>
             <Grid item xs={12} sm={6}>
                <a href={"https://github.com/PiyushThite"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <Card className={classes.card} component={Paper} elevation={5}>
                        <CardContent>
                        <CardMedia
                            className={classes.media}
                            image={thite}
                            component='img'
                            title='Piyush Thite'
                        />
                        <Typography gutterBottom color='textPrimary' variant="h5" component="h2" style={{ marginTop: '5px'}}>
                                Piyush Thite
                        </Typography>
                        <Typography variant='caption'>
                            Glad to see you all here! My name is Piyush Thite and I am currently completing the bachelor's
                            program to pursue a degree in Electronics and Telecommunication Engineering from Vishwakarma
                            Institute of Technology, Pune. I like a bit of coding and am highly interested in Mechatronics.
                        </Typography>
                        </CardContent>
                    </Card>
                </a>
             </Grid>
        </Grid>   
        </Container>
    )
}

export default About;