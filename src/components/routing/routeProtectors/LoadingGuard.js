import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

export const LoadingGuard = () => {
        
    if (localStorage.getItem("token")) {
        
        return <Outlet/>;
    }
    
    return <Navigate to="/login" replace />;
};

LoadingGuard.propTypes = {
    children: PropTypes.node, //NOSONAR
};