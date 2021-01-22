import React, { useEffect } from "react";
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import GridList from '@material-ui/core/GridList';
import Grid from '@material-ui/core/Grid';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuBookSharpIcon from '@material-ui/icons/MenuBookSharp';
import { Paper,Typography } from "@material-ui/core";

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
        marginTop : 10,
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

    const [stores, setStores] = React.useState([]);
    
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
        let data=[]
        tileData.forEach(tile=>{
            data.push({
                latitude : tile.latitude,
                longitude : tile.longitude
            })
        })
        setStores(data);
    },[])

    return (
        <div>
         <Grid container >
         <Grid item xs={6} style={{position: 'relative', height: '50vh',marginBottom:30}}>
                <Map
                google={props.google}
                zoom={8}
                resetBoundsOnResize={true}>
                {displayMarkers()}
                </Map>
             </Grid>
             <Grid item xs={6}>
                 <Paper elevation={2}>
                 </Paper>
             </Grid>
             </Grid>
             <GridList xs = {12} className={classes.gridList} cols={2.5}>
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
                        <IconButton aria-label={`star ${tile.name}`}>
                            <MenuBookSharpIcon className={classes.title} />
                        </IconButton>
                    }
                    />
                </GridListTile>
                ))}
            </GridList>
        
         </div>
    )
}


export default GoogleApiWrapper({
    apiKey: 'AIzaSyDpKyIYlTBUlZ_g41ql57cabAGpVp_mJQI'
})(Hospitals);