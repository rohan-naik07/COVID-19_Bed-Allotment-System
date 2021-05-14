/* eslint-disable */
import React from "react";
import GridList from '@material-ui/core/GridList';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {useHistory} from "react-router";
import MenuBookSharpIcon from '@material-ui/icons/MenuBookSharp';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import { Paper,Typography } from "@material-ui/core";
import Geocode from "react-geocode";
import {
  Divider
} from "@material-ui/core";
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

    return (
         <Grid container >
            <Grid item md={6} xs={12} style={{position: 'relative'}}>
               <Paper elevation={2} >
                <Map
                  google={props.google}
                  zoom={15}
                  center={stores[0]}
                  centerAroundCurrentLocation={true}
                  resetBoundsOnResize={true}>
                  {displayMarkers()}
                  </Map>
               </Paper>
             </Grid>
             <Grid item  md={6} xs={12}>
                 <Paper elevation={3} style={{marginLeft:10,padding:10}}>
                    <Typography variant='h5'>{address}</Typography>
                    <Divider/>
                    <div className={classes.text}>
                      <Typography variant='h6' color='primary'>
                        {`Most chances are in ${maxBedHospital.name} (${maxBedHospital.prob}%)`}
                      </Typography>
                    </div>
                 </Paper>
             </Grid>
             <Grid item  md={12} xs={12} style={{marginTop:20}}>
                <Paper elevation={3} >
                    <GridList xs = {12} className={classes.gridList} cols={4}>
                        {tileData.map((tile, i) => (
                        <GridListTile key={i} style={{margin:10}}>
                            <img src={tile.imageUrl} alt={tile.name} />
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
                                              pathname : `/hospital/${tile.slug}`,
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
             </Grid>
          </Grid>
    )
}

export default GoogleApiWrapper({
  apiKey: `${process.env.REACT_APP_API_KEY}`
})(Hospitals);