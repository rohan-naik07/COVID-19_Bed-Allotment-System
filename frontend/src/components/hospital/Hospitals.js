/* eslint-disable */
import React from "react";
import {useHistory} from "react-router";
import {MenuBookSharp} from '@material-ui/icons';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import { Paper,Typography, Divider, Grid, GridList, GridListTile, IconButton, makeStyles, GridListTileBar, TextField } from "@material-ui/core";
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
        transform: 'translateZ(0)',
    },
    icon: {
      color: 'rgba(0, 150, 255, 0.54)',
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
     const [results, setResults] = React.useState([]);
     const [search, setSearch] = React.useState('');
     const [error, setError] = React.useState(false);
     const history = useHistory();

     const displayMarkers = () => {
      return stores.map((store, index) => {

          return <Marker key={index} id={index} position={{ lat: store.lat, lng: store.lng}} />
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
                        slug: obj.slug,
                        lat : obj.latitude,
                        lng: obj.longitude
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
             lat += store.lat;
             lng += store.lng
         })
         return {
             lat: lat/stores.length,
             lng: lng/stores.length
         }
    }

    const handleSearch = (event) => {
         setSearch(event.target.value);
         axios.get(`${process.env.REACT_APP_API_URL}/portal/hospitals/search/?name=${event.target.value}`, {
             headers: {
                 "Content-Type": "application/json",
                 Authorization: `Token ${getToken()}`,
             }
         })
             .then(res => setTileData(res.data))
             .catch(err => setError(true))
    }

    return (
            <Grid container direction="row" spacing={2} item justify="center">
                <Grid item xs={12}>
                    <Paper elevation={10} style={{padding:10}}>
                    <Typography variant='h5'>{address}</Typography>
                    <Divider/>
                        <Typography variant='h6' color='primary' className={classes.text}>
                            {`Most chances are in ${maxBedHospital.name} (${maxBedHospital.prob}%)`}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} container direction="column" alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id='search'
                            label='Search Hospital'
                            placeholder='Enter the name of hospital'
                            name='search'
                            margin='normal'
                            error={error}
                            variant='outlined'
                            autoFocus
                            onChange={handleSearch}
                            color='primary'
                            value={search}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <GridList cellHeight={180} className={classes.gridList}>
                            {tileData.map((tile, i) => (
                                <GridListTile key={i}>
                                    <img src={tile.imageUrl} alt={tile.name} />
                                    <GridListTileBar
                                        title={tile.name}
                                        actionIcon={
                                            <IconButton
                                                aria-label={`info about ${tile.title}`}
                                                className={classes.icon}
                                                onClick={() => history.push(`/hospital/${tile.slug}`)}
                                            >
                                                <MenuBookSharp />
                                            </IconButton>
                                        }
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </Grid>
                </Grid>
            </Grid>
    )
}

export default GoogleApiWrapper({
  apiKey: `${process.env.REACT_APP_API_KEY}`
})(Hospitals);