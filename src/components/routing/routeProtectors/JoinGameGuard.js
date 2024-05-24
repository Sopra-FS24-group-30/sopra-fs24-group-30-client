import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

export const JoinGameGuard = () => {
    
    if (localStorage.getItem("token")){
        return <Outlet/>;
    }
    
    return <Navigate to="/login" replace/>;
};

JoinGameGuard.propTypes = {
    children: PropTypes.node
}