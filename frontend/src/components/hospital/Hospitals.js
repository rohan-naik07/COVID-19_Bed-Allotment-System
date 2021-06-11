import React from "react";
import {useHistory} from "react-router";
import {GoogleApiWrapper, Marker, Map} from 'google-maps-react';
import {motion} from 'framer-motion';
import {
    Paper,
    Grid,
    makeStyles,
    colors,
} from "@material-ui/core";
import {getToken} from "../authentication/cookies";
import axios from "axios";
import MaterialTable from "material-table";
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import Link from '@material-ui/icons/Link';
import LinkOff from '@material-ui/icons/LinkOff';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {useSnackbar} from "notistack";
require('dotenv').config();

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
 };

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      backgroundColor: theme.palette.background.paper,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    media: {
        height: 0,
        paddingTop: '50%', // 16:9
    },
    icon: {
      color: 'rgba(0, 150, 255, 0.54)',
    },
    text : {
      padding : 5,
      borderWidth:5,
      borderRadius:10,
      borderColor : '#64b5f6'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Hospitals = (props) => {
     const classes = useStyles();
     const {enqueueSnackbar, closeSnackbar} = useSnackbar();
     const [address, setAddress] = React.useState('')
     const [data, setData] = React.useState({});
     const [maxBedHospital,setHospital] = React.useState("");
     const [stores,setStores] = React.useState([])
     const [tileData, setTileData] = React.useState([]);
     const [results, setResults] = React.useState([]);
     const [search, setSearch] = React.useState('');
     const [error, setError] = React.useState(false);
     const [render, setRender] = React.useState(false);
     const history = useHistory();

     const displayMarkers = () => {
      return stores.map((store, index) => {

          return <Marker key={index} id={index} position={{ lat: store.lat, lng: store.lng}} />
      })
    }

    React.useEffect(()=>{
        // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.

         axios.get(`${process.env.REACT_APP_API_URL}/portal/hospitals/`,
              !getToken()? {
                  headers: {
                      "Content-Type": "application/json",
                  }
              }:{
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Token ${getToken()}`
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
            <Grid item container spacing={2} direction="row" alignItems="center" justify="center">
                <Grid item xs={12} sm={6} container direction="column" alignItems="center" spacing={1}>
                    <Grid item xs={12}>
                        <Paper elevation={10} style={{ padding: '1%', width: '100%', height: '50vh%', textAlign: 'center'}}>
                            <motion.h1
                                initial={{ scale: 0}}
                                animate={{
                                    scale: 1,
                                    transition: {
                                        duration: 1,
                                        ease: [0.43, 0.13, 0.23, 0.96]
                                    }
                                }}
                                style={{ fontSize: '1.5rem', color: colors.blue[300]}}
                            >
                                The COVID-19 Bed Allotment System
                            </motion.h1>
                            <motion.ul style={{ textAlign: 'left', fontSize: '1rem'}} initial={{ opacity: 0 }}
                                       animate={{
                                           opacity: 1,
                                           transition: {
                                               duration: 1.5,
                                               ease: [0.43, 0.13, 0.23, 0.96]
                                           }
                                       }}
                            >
                                <motion.li>After logging in, you can apply for a bed in any of the hospitals</motion.li>
                                <motion.li>You can chat with the staff of any hospital</motion.li>
                                <motion.li>You will be notified once your application is accepted in any hospital via email</motion.li>
                            </motion.ul>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper elevation={10} style={{ padding: '1%'}}>
                            <motion.h2 style={{ color: colors.blue[300]}}
                                       initial={{ opacity: 0, x: '50%' }}
                                       animate={{
                                           opacity: 1,
                                           x: '0%',
                                           transition: {
                                               duration: 1.5,
                                               ease: [0.43, 0.13, 0.23, 0.96]
                                           }
                                       }}
                            >
                                {address}
                            </motion.h2>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={10} style={{ height: '50vh', width: '100%', position: 'relative', overflow: 'hidden'}}>
                        {stores &&
                        <Map
                            google={props.google}
                            initialCenter={{
                                lat: 18.5204,
                                lng: 73.8567
                            }}
                            zoom={14}
                            center={getCenter()}
                        >
                            {displayMarkers()}
                        </Map>}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <MaterialTable
                        style={{
                            margin: '1%'
                        }}
                        columns={[
                            {title: 'Name of Hospital', field: 'name', align: 'left'},
                            {title: 'Total Beds', field: 'total_beds', align: 'center'},
                            {title: 'Available Beds', field: 'available_beds', align: 'center'}
                        ]}
                        data={tileData}
                        options={{
                            exportButton: true,
                            showTitle: false,
                            searchFieldAlignment: 'left',
                            actionsColumnIndex: -1,
                            headerStyle: {
                                color: colors.blue[300],
                                fontSize: '1.5rem'
                            },
                            rowStyle: {
                                fontSize: '1rem'
                            }
                        }}
                        icons={tableIcons}
                        actions={[
                            {
                                icon: getToken()?Link:LinkOff,
                                tooltip: 'Book a Bed',
                                onClick: (event, rowData) => {
                                    if(!getToken()){
                                        enqueueSnackbar('You need to login first', {
                                            variant: 'error',
                                            key: 'login'
                                        });
                                        return closeSnackbar('login')
                                    }
                                    return history.push(`/hospital/${rowData.slug}`)
                                }
                            }
                        ]}
                        title='List of Hospitals'
                    />
                </Grid>
            </Grid>
    )
}

export default GoogleApiWrapper({
  apiKey: `${process.env.REACT_APP_API_KEY}`
})(Hospitals);