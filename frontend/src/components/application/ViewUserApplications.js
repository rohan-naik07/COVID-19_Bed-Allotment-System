import React, {forwardRef} from "react";
import {Grid, colors} from "@material-ui/core";
import {motion} from "framer-motion";
import MaterialTable from "material-table";
import axios from "axios";
import {getToken} from "../authentication/cookies";
import {useSnackbar} from "notistack";
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Edit from "@material-ui/icons/Edit";
import SaveAlt from "@material-ui/icons/SaveAlt";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import Search from "@material-ui/icons/Search";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Remove from "@material-ui/icons/Remove";
import ViewColumn from "@material-ui/icons/ViewColumn";
import {Delete, LocalHospital} from "@material-ui/icons";
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

const ViewUserApplications = (props) => {
    const [applications, setApplications] = React.useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    React.useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/portal/patients/`, {
            headers: {
                Authorization: `Token ${getToken()}`,
            }
        }).then(res => setApplications(res.data))
            .catch(err => {
                enqueueSnackbar(err.message, {key: 'application_error', variant: 'error'});
                setTimeout(() =>  closeSnackbar('application_error'), 2000)
            })
        // eslint-disable-next-line
    }, [])

    return (
        <Grid item container direction="row" spacing={2} justify="center" xs={12}>
            <Grid item xs={12} style={{ textAlign: 'center'}}>
                <motion.div
                    initial={{ opacity: 0, y: "-50%" }}
                    animate={{
                        opacity: 1,
                        y: "0%",
                        transition: {
                            duration: 1.5,
                            ease: [0.43, 0.13, 0.23, 0.96]
                        }
                    }}
                >
                    <LocalHospital style={{ fontSize: '4.5rem', color: colors.green[700]}}/>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, x: "-50%" }}
                    animate={{
                        opacity: 1,
                        x: "0%",
                        transition: {
                            duration: 1.5,
                            ease: [0.43, 0.13, 0.23, 0.96]
                        }
                    }}
                    style={{ color: colors.green[700], fontSize: '3.5rem'}}
                >
                    Your Applications
                </motion.h1>
            </Grid>
            <Grid item xs={12}>
                <MaterialTable
                    style={{
                        margin: '1%'
                    }}
                    columns={[
                        {title: 'Name of Hospital', field: 'hospital_name', align: 'left'},
                        {title: 'Date applied', field: 'applied_date', align: 'center', type: 'date'},
                    ]}
                    data={applications}
                    options={{
                        exportButton: true,
                        showTitle: false,
                        searchFieldAlignment: 'left',
                        actionsColumnIndex: -1,
                        headerStyle: {
                            color: colors.green[300],
                            fontSize: '1.5rem',
                            fontWeight: '600'
                        },
                        rowStyle: {
                            fontSize: '1rem'
                        }
                    }}
                    actions={[
                        {
                            icon: Delete,
                            tooltip: 'Delete Application',
                            onClick: (event, rowData) => {
                                axios.delete(`${process.env.REACT_APP_API_URL}/portal/patients/${rowData.id}/`, {
                                    headers: {
                                        Authorization: `Token ${getToken()}`
                                    }
                                }).then(res => {
                                    let data = applications.filter((application) => application.id !== rowData.id);
                                    setApplications(data);
                                    enqueueSnackbar('Deleted Application', {key: 'deleted', variant: 'success'});
                                    setTimeout(() =>  closeSnackbar('deleted'), 2000)
                                })
                                    .catch(err => {
                                        enqueueSnackbar(err.message, {key: 'delete_error', variant: 'error'});
                                        setTimeout(() =>  closeSnackbar('deletion_error'), 2000)
                                    })
                            }
                        },
                    ]}
                    title='Applications'
                    icons={tableIcons}
                />
            </Grid>
        </Grid>
    )
}

export default ViewUserApplications;