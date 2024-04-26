import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";
import {LoginGuard} from "./LoginGuard";

export const SelectTeamGuard = () => {
    if (localStorage.getItem("token")) {

        return <Outlet/>;
    }

    return <Navigate to="/login" replace/>;
};

SelectTeamGuard.propTypes = {
    children: PropTypes.node
}