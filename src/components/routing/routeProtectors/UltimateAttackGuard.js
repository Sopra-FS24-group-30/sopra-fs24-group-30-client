import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

export const UltimateAttackGuard = () => {
    console.log(localStorage.getItem("token"));

    if (!localStorage.getItem("token")) {

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

UltimateAttackGuard.propTypes = {
    children: PropTypes.node,
};