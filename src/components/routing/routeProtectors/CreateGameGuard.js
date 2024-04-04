import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";
import CreateGame from "../../views/CreateGame";

export const CreateGameGuard = () => {
    console.log(localStorage.getItem("token"))

    if (localStorage.getItem("token")){
        return <Outlet/>;
    }
    return <Navigate to="/login" replace/>;
};

CreateGameGuard.PropTypes = {
    children: PropTypes.node
}