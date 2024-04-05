import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

export const HomeGuard = () => {
    console.log(localStorage.getItem("token"))

    if (localStorage.getItem("token")){
        return <Outlet/>;
    }
    
    return <Navigate to="/login" replace/>;
};

HomeGuard.PropTypes = {
    children: PropTypes.node
}