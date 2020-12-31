import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, CircularProgress, Container, FormGroup, FormControlLabel, Switch, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { Bar, Doughnut } from 'react-chartjs-2';
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import News from "../home/News";

const color = ['rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)',
'rgba(75, 192, 192, 0.8)','rgba(153, 102, 255, 0.8)','rgba(255, 159, 64, 0.8)','rgba(255, 99, 132, 0.8)',
'rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)','rgba(75, 192, 192, 0.8)','rgba(153, 102, 255, 0.8)',
'rgba(255, 159, 64, 0.8)','rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)',
'rgba(75, 192, 192, 0.8)','rgba(153, 102, 255, 0.8)','rgba(255, 159, 64, 0.8)','rgba(255, 99, 132, 0.8)',
'rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)','rgba(75, 192, 192, 0.8)','rgba(153, 102, 255, 0.8)',
'rgba(255, 159, 64, 0.8)','rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)',
'rgba(75, 192, 192, 0.8)','rgba(153, 102, 255, 0.8)','rgba(255, 159, 64, 0.8)','rgba(255, 99, 132, 0.8)',
'rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)','rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)',
'rgba(255, 206, 86, 0.8)','rgba(75, 192, 192, 0.8)',]

const useStyles = makeStyles({
    card: {
        overflowX: "auto",
        marginBottom: "20px"   
    },
    loading : {
        margin: 'auto',
        width: '50%',
        textAlign:'center',
        paddingTop: '15%'
    },
    root: {
        width: '100%',
        height: '40%',
    }  
})

const Graphs = () => {
    const dummy = null;
    const classes = useStyles();
    const [spinner, setSpinner] = useState(true);
    const [toggle,setToggle] = useState({
        switch1: true,
        switch2: true,
        switch3: true,
    });
    const [location, setLocation] = useState([]);
    const [totalConfirmed, setTotalConfirmed] = useState([]);
    const [deaths, setDeaths] = useState([]);
    const [discharged, setDischarged] = useState([]);
    const [time, setTime] = useState({});
    const [type, setType] = useState('totalConfirmed');

    const fetchCases = () => {
        axios({
            method:'get',
            headers: {
                'Content-type':'application/json'
            },
            url: 'https://api.rootnet.in/covid19-in/stats/latest'
        })
            .then(response => {
                setTimeout(() => setSpinner(false), 1000);
                const labels = response.data.data.regional;
                setLocation(labels.map(label => label.loc));
                setTotalConfirmed(labels.map(label => label.totalConfirmed));
                setDeaths(labels.map(label => label.deaths));
                setDischarged(labels.map(label => label.discharged));
                setTime(response.data.lastRefreshed);
            })
            .catch(() => window.alert("Please Check you internet connection!"))
    }

    useEffect(() => {
        fetchCases()
    },[dummy]);

    const handleSwitch = (event) => {
        if(event.currentTarget.id === 'switch1') {
            setToggle({...toggle, switch1: !toggle.switch1})
        }
        else if(event.currentTarget.id === 'switch2') {
            setToggle({...toggle, switch2:!toggle.switch2})
        }
        else if(event.currentTarget.id === 'switch3') {
            setToggle({...toggle, switch3:!toggle.switch3})
        }
    }

    const generateChart = (loc, data, label) => {
        return({
            data: {
                labels:loc,
                datasets:[
                    {
                        label: label,
                        data: data,
                        backgroundColor: color,
                        borderColor: color,
                        borderWidth: 2,
                        hoverBorderWidth:2,
                        hoverBorderColor:'#000'

                    }
                ],
            },
            width: 1152,
            height: 648,
            tooltips: {
                enabled: false,
              },
            options: {
                legend:{
                    display:true,
                    position:'right'
                },
                scales: {
                    xAxes: [{display: false}]
                  },
                maintainAspectRatio: true,
                responsive: true
            }
        });
    }

    return (
        <div className="charts">
            {
                spinner ?
                    (
                        <div className={classes.loading}>
                            <CircularProgress />
                            <Typography variant="h6">Loading your data..</Typography>
                        </div>
                    ):(
                        <Container>
                             <Grid container className={classes.root} spacing={3}>
                             <Grid item xs={8}>
                            <Card className={classes.card}>
                                <Typography variant="h4" align="center" style={{fontWeight:'lighter', paddingTop: '20px'}}>
                                    {type==='totalConfirmed'?'Total Confirmed Cases':
                                    type==='totalDeaths'?'Total Deaths':'Total Recovered'}
                                </Typography>
                                <Typography variant="h4" align="center" style={{fontWeight:'lighter', paddingTop: '20px'}}>
                                    <TextField
                                        type='text'
                                        select
                                        value={type}
                                        variant='standard'
                                        color='primary'
                                        margin='normal'
                                        onChange={(event) => setType(event.target.value)}
                                    >
                                        <MenuItem value='totalConfirmed'>Total Confirmed Cases</MenuItem>
                                        <MenuItem value='totalDeaths'>Total Deaths</MenuItem>
                                        <MenuItem value='totalRecovered'>Total Recovered</MenuItem>
                                    </TextField>
                                </Typography>
                                <div style = {{padding: "10px"}}>
                                    {
                                        toggle.switch1 ?
                                            <Bar {...generateChart(location, type==='totalConfirmed'?
                                                totalConfirmed:type==='totalDeaths'?deaths:discharged, type.slice(5, type.length))}/> :
                                            <Doughnut {...generateChart(location, type==='totalConfirmed'?
                                                totalConfirmed:type==='totalDeaths'?deaths:discharged, type.slice(5, type.length))}/>
                                    }
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={<Switch onChange={handleSwitch} id="switch1" />}
                                            label="Switch Graph Type"
                                        />
                                    </FormGroup>
                                </div>
                            </Card>
                             </Grid>
                             <Grid item xs={4}><News/></Grid>
                             </Grid>
                            
                        </Container>
                    )
            }
        </div>
    );
}

export default Graphs;