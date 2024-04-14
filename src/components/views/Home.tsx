import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import {Spinner} from "components/ui/Spinner";
import {Button} from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import User from "models/User";
import PropTypes from "prop-types";

const Home = () => {
    const navigate = useNavigate();

    const goProfile = (): void =>{
        navigate("/game");
    }
    const createGame = (): void=>{
        navigate("/createGame");
    }

    const joinGame= (): void =>{
        navigate("/joinGame");
    }

    const doLogout = (): void =>{
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    }

    return (
        <BaseContainer>
            <div className = "home container">
                <h1>Mario After Party</h1>
                <div className="home button-container">
                    <Button className="home button" onClick={()=> createGame()}>Create Game</Button>
                    <div className="home divider"/>
                    <Button className="home button" onClick={() => joinGame()}>Join Game</Button>
                </div>
                <Button className="home profile-button" onClick={() => goProfile()}>See all users</Button>
                <Button className="home profile-button" onClick={() => doLogout()}>Logout</Button>
            </div>
        </BaseContainer>
    )
}

export default Home;