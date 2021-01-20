import React, { useEffect } from "react";
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import GridList from '@material-ui/core/GridList';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuBookSharpIcon from '@material-ui/icons/MenuBookSharp';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  }));

const Hospitals = (props) => {
    const classes = useStyles();
    
    const mapStyles = {
        width: '50%',
        height: '50%',
        marginTop : 20
    };

    const [stores, setStores] = React.useState([
        {latitude: 47.359423, longitude: -122.021071},
        {latitude: 47.2052192687988, longitude: -121.988426208496},
        {latitude: 47.6307081, longitude: -122.1434325},
        {latitude: 47.3084488, longitude: -122.2140121},
        {latitude: 47.5524695, longitude: -122.0425407}]);
    
        const tileData = [{
                img: 'https://image.shutterstock.com/image-photo/modern-hospital-style-building-260nw-212251981.jpg',
                title: 'Image',
                author: 'author',
              },
              {
                img: 'https://image.shutterstock.com/image-photo/modern-hospital-style-building-260nw-212251981.jpg',
                title: 'Image',
                author: 'author',
              },
              {
                img: 'https://image.shutterstock.com/image-photo/modern-hospital-style-building-260nw-212251981.jpg',
                title: 'Image',
                author: 'author',
              },
              {
                img: 'https://image.shutterstock.com/image-photo/modern-hospital-style-building-260nw-212251981.jpg',
                title: 'Image',
                author: 'author',
              }];
   
    const displayMarkers = () => {
        return stores.map((store, index) => {
            return <Marker key={index} id={index} position={{
                lat: store.latitude,
                lng: store.longitude
            }}
           onClick={() => console.log("You clicked me!")} />
        })
    }

    return (
        <div className={classes.root}>
         <Grid container>
             <GridList xs = {12} className={classes.gridList} cols={2.5}>
                {tileData.map((tile) => (
                <GridListTile key={tile.img}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                    title={tile.title}  
                    classes={{
                        root: classes.titleBar,
                        title: classes.title,
                    }}
                    actionIcon={
                        <IconButton aria-label={`star ${tile.title}`}>
                            <MenuBookSharpIcon className={classes.title} />
                        </IconButton>
                    }
                    />
                </GridListTile>
                ))}
            </GridList>
            <Grid item xs={6}>
                <Map
                google={props.google}
                zoom={8}
                style={mapStyles}
                resetBoundsOnResize={true}
                initialCenter={{ lat: 47.444, lng: -122.176}}>
                {displayMarkers()}
                </Map>
             </Grid>
         </Grid>
         </div>
    )
}

/**
 *
 */

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDpKyIYlTBUlZ_g41ql57cabAGpVp_mJQI'
})(Hospitals);