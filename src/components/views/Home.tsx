import React, {useEffect, useState} from "react"; //NOSONAR
import {Button} from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom"; //NOSONAR
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";

const Home = () => {
    const navigate = useNavigate();

    const goProfile = (): void =>{
        navigate("/users");
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
        localStorage.removeItem("userId");
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