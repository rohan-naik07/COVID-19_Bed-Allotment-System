import React from "react";
import "./hospital.css"
import GridList from '@material-ui/core/GridList';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {useHistory} from "react-router";
import MenuBookSharpIcon from '@material-ui/icons/MenuBookSharp';
import { Paper,Typography } from "@material-ui/core";
import Geocode from "react-geocode";
import {
  Divider
} from "@material-ui/core";
import { BarChart,Bar, XAxis, YAxis,Tooltip} from 'recharts';
require('dotenv').config();

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        marginTop : 10,
        transform: 'translateZ(0)'
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
    text : {
      padding : 5,
      borderWidth:5,
      borderRadius:10,
      borderColor : '#64b5f6'
    }
  }));

const Hospitals = (props) => {
    const classes = useStyles();
    const [address, setAddress] = React.useState("");
    const [maxBedHospital,setHospital] = React.useState("");
    const [graphData,setGraphData] = React.useState("");
    const history = useHistory();

      const tileData = [{
              id : '0',
              img: 'https://lh5.googleusercontent.com/p/AF1QipPH7DnJZLyEjyR9LgTAR3JIeeP-Kr4wTbxPG6yq=w426-h240-k-no',
              name: 'Deenanath Mangeshkar Hospital and Research Center',
              contact : '020 4015 1000',
              website : 'http://www.dmhospital.org/',
              latitude : '18.50243538786544',
              longitude : '73.83211347436865',
              total_beds : 150,
              beds_availiable : 78
            },
            {
              id : '1',
              img: 'https://lh5.googleusercontent.com/p/AF1QipP_Pw30A-Af42rEuxG9sn99NLp4GIYwaEONQO8V=w426-h240-k-no',
              name: 'Poona Hospital And Research Centre',
              contact : '020 6609 6000',
              website : 'http://www.poonahospital.org/',
              latitude : '18.511038110122588',
              longitude : '73.8420267818292',
              total_beds : 76,
              beds_availiable : 38
            },
            {
              id : '2',
              img: 'https://image.shutterstock.com/image-photo/modern-hospital-style-building-260nw-212251981.jpg',
              name: 'Global Hospital & Research Institute-Pune',
              contact : '020 4015 1000',
              website : 'http://www.globalhospitalpune.com/',
              latitude : '18.501458243017794',
              longitude : '73.84141698368317',
              total_beds : 50,
              beds_availiable : 40
            },
            {
              id : '3',
              img: 'https://image.shutterstock.com/image-photo/modern-hospital-style-building-260nw-212251981.jpg',
              name: 'Bois Hospital and Research Center',
              contact : '020 4015 1000',
              website : 'http://www.dmhospital.org/',
              latitude : '18.50243538786578',
              longitude : '73.83211347436830',
              total_beds : 100,
              beds_availiable : 68
          }];

    React.useEffect(()=>{
        // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
        Geocode.setApiKey(process.env.REACT_APP_API_KEY);

        // set response language. Defaults to english.
        Geocode.setLanguage("en");
        // set response region. Its optional.
        // A Geocoding request with region=es (Spain) will return the Spanish city.
        Geocode.setRegion("es");
        Geocode.setLocationType("ROOFTOP");
        // Enable or disable logs. Its optional.
        Geocode.enableDebug();

        navigator.geolocation.getCurrentPosition(
            function( position ){ // success cb
                console.log( position );
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                Geocode.fromLatLng(lat,lng).then(
                    (response) => {
                      const address = response.results[0].formatted_address;
                      setAddress(address);
                    },
                    (error) => {
                      console.error(error);
                    }
                  );
            },
            function(){ // fail cb
            }
        );

        let data = [];
        let probs = [];

        tileData.forEach((obj)=>{
           data.push({
               "name" : obj.name.split(' ')[0],
               "beds" : obj.beds_availiable
           })
           probs.push({
              name : obj.name,
              prob : (obj.beds_availiable/obj.total_beds)*100
           });
        });

        probs.sort(( a, b)=> {
          if ( a.prob < b.prob){
              return 1;
          }
          if ( a.prob > b.prob){
              return -1;
          }
          return 0; // sort according to decreasing frequencies
      });

      setGraphData(data);
      setHospital(probs[0])
      
        
    },[] )// eslint-disable-line react-hooks/exhaustive-deps
    

    return (
        <div>
         <Grid container >
         <Grid item xs={6} style={{position: 'relative', height: '50vh',marginBottom:30}}>
                <iframe
                width="100%"
                title="map"
                height="400"
                style={{border : 0}}
                loading="lazy"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_API_KEY}&q=Space+Needle,Pune+MH`}>
                </iframe>
             </Grid>
             <Grid item xs={6}>
                 <Paper elevation={3} style={{marginLeft:10,padding:10}}>
                    <Typography variant='h5'>{address}</Typography>
                    <Divider/>
                    <div className={classes.text}>
                      <Typography variant='h6' color='primary'>
                        {`Most chances are in ${maxBedHospital.name} (${maxBedHospital.prob}%)`}
                      </Typography>
                    </div>
                    <Divider/>
                    <BarChart width={650} height={250} data={graphData} barSize={20} style={{marginTop:10}}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="beds" fill="#ffc107" width={10} />
                    </BarChart>
                 </Paper>
             </Grid>
             </Grid>
             <Paper elevation={3}>
                <GridList xs = {12} className={classes.gridList} cols={4}>
                    {tileData.map((tile) => (
                    <GridListTile key={tile.id} style={{margin:10}}>
                        <img src={tile.img} alt={tile.name} />
                        <GridListTileBar
                            title={tile.name}  
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                            actionIcon={
                                <IconButton aria-label={`star ${tile.name}`} 
                                      color='primary' 
                                      onClick={()=>{
                                        history.push({
                                          pathname : `/hospital/${tile.name}`,
                                          state : {
                                            hospital : tile
                                          }
                                        })
                                      }}>
                                    <MenuBookSharpIcon className={classes.title} />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                    ))}
                </GridList>
             </Paper>
         </div>
    )
}


export default Hospitals;