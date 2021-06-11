import React from "react";
import {Typography} from "@material-ui/core";
import {getToken} from "../authentication/cookies";
import jwtDecode from "jwt-decode";
import Hospitals from "../hospital/Hospitals";
import StaffPanel from "../staff/StaffPanel";

const Home = () => {
    let token = getToken();
    const is_staff = getToken() ==='' ? false : jwtDecode(token).is_staff;

    if(is_staff)
        return <StaffPanel/>

    return <Hospitals/>
}

export default Home;