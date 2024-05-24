import React, {useEffect, useState} from "react"; //NOSONAR
import {Button} from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom"; //NOSONAR
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import {api, handleError} from "helpers/api";

const Home = () => {
    const navigate = useNavigate();

    const goProfile = (): void =>{
        navigate("/users");
    }
    const createGame = (): void=>{
        navigate("/game/create");
    }

    const joinGame= (): void =>{
        navigate("/join");
    }

    const doLogout = async () => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                alert("User not properly loaded.");
                
                return;
            }
            await api.put(`/logout/${userId}`);

            ["token", "username", "userId", "gameId", "host"].forEach(key =>
            localStorage.removeItem(key)
            );

            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Failed to log out. Please try again.");
        }
    };

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