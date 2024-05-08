import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

export const WinConditionGuard = () => {
    console.log(localStorage.getItem("token"));

    if (!localStorage.getItem("token")) {

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

WinConditionGuard.propTypes = {
    children: PropTypes.node,
};