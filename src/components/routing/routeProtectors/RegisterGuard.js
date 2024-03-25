import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";
import {LoginGuard} from "./LoginGuard";

export const RegisterGuard = () => {
    if (!localStorage.getItem("token")){
        return <Outlet />;
    }
    return <Navigate to="/game" replace />;
};

LoginGuard.propTypes = {
    children: PropTypes.node
}