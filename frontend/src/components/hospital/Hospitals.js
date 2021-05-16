/* eslint-disable */
import React from "react";
import {useHistory} from "react-router";
import {MenuBookSharp} from '@material-ui/icons';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import { Paper,Typography, Divider, Grid, GridList, GridListTile, IconButton, makeStyles, GridListTileBar } from "@material-ui/core";
import Geocode from "react-geocode";
import {getToken} from "../authentication/cookies";
import axios from "axios";
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
        overflowX: 'scroll',
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
     const [stores,setStores] = React.useState([])
     const [tileData, setTileData] = React.useState([]);
     const history = useHistory();

     const displayMarkers = () => {
      return stores.map((store, index) => {
          return <Marker key={index} id={index} position={{
              lat: store.latitude,
              lng: store.longitude
          }}
         onClick={() => console.log("You clicked me!")} />
      })
    }

    React.useEffect(()=>{
        // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
        Geocode.setApiKey(process.env.REACT_APP_API_KEY);

        navigator.geolocation.getCurrentPosition(
            function( position ){ // success cb
                //console.log( position );
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

         axios.get(`${process.env.REACT_APP_API_URL}/portal/hospitals/`,
              {
                   headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${getToken()}`,
                   }
              }
         ).then(res => {
                let probs = [];
                let markers = [];

                res.data.forEach((obj)=>{
                    probs.push({
                        name : obj.name,
                        prob : (obj.available_beds/obj.total_beds)*100
                    });
                    markers.push({
                      latitude : obj.latitude,
                      longitude : obj.longitude
                  })
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

                setHospital(probs[0])
                setStores(markers);
                setTileData(res.data);
         })
        
    },[] )// eslint-disable-line react-hooks/exhaustive-deps

    const getCenter = () => {
         let lat = 0, lng = 0;
         stores.map(store => {
             lat += store.latitude;
             lng += store.longitude
         })
         return {
             lat: lat/stores.length,
             lng: lng/stores.length
         }
    }

    return (
         <Grid container direction="row" spacing={2} item justify="center">
             <Grid item xs={12}>
                 <Paper elevation={10} style={{padding:10}}>
                    <Typography variant='h5'>{address}</Typography>
                    <Divider/>
                    <div className={classes.text}>
                      <Typography variant='h6' color='primary'>
                        {`Most chances are in ${maxBedHospital.name} (${maxBedHospital.prob}%)`}
                      </Typography>
                    </div>
                 </Paper>
             </Grid>
             <Grid item xs={12}>
                <Paper elevation={10} style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                    <GridList xs={12} className={classes.gridList} cols={3}>
                        {tileData.map((tile, i) => (
                            <GridListTile key={i} style={{margin:10}}>
                                <img src={tile.imageUrl} alt={tile.name} />
                                <GridListTileBar
                                    title={tile.name}
                                    classes={{
                                        title: classes.title,
                                    }}
                                    actionIcon={
                                        <IconButton
                                            aria-label={`star ${tile.name}`}
                                            color='primary'
                                            onClick={() => history.push(`/hospital/${tile.slug}`)}
                                        >
                                            <MenuBookSharp className={classes.title} />
                                        </IconButton>
                                    }
                                />
                            </GridListTile>
                        ))}
                    </GridList>
                </Paper>
             </Grid>
             <Grid item xs={12} style={{ padding: '2%', overflow: 'hidden', position: 'relative'}}>
                 <Map
                     google={props.google}
                     zoom={14}
                     center={getCenter()}
                     centerAroundCurrentLocation={true}
                 >
                     {displayMarkers()}
                 </Map>
             </Grid>
             <Grid item xs={12}>
                 <Typography variant='h3'>
                     {address}
                 </Typography>
             </Grid>
          </Grid>
    )
}

export default GoogleApiWrapper({
  apiKey: `${process.env.REACT_APP_API_KEY}`
})(Hospitals);