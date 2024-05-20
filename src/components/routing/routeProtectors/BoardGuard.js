import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

export const BoardGuard = () => {

    if (localStorage.getItem("token") && localStorage.getItem("gameId")){
        return <Outlet/>;
    }

    return <Navigate to="/login" replace/>;
};

BoardGuard.propTypes = {
    children: PropTypes.node
}