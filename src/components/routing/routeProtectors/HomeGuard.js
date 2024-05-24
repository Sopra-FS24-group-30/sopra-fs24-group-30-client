import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

export const HomeGuard = () => {
    
    if (localStorage.getItem("token")){
        return <Outlet/>;
    }
    
    return <Navigate to="/login" replace/>;
};

HomeGuard.propTypes = {
    children: PropTypes.node
}