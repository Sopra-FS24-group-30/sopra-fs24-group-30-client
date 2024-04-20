import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useWebsocket} from "./Websockets";

const CreateGame:  React.FC = () =>{
    const {client , sendMessage, isConnected, disconnect} = useWebsocket();
    const navigate = useNavigate();
    const [gameId, setGameId] = useState<String>(null);
    const playerId = localStorage.getItem("userId");

    useEffect(() => {
        if (client && isConnected){
            const subscription = client.subscribe('/topic/gameCreated', (message) => {
                const data = JSON.parse(message.body);
                console.log("Received data: ", data);
                setGameId(data.gameId);
            });

            console.log("PlayerId: ", playerId);
            sendMessage('/app/game/create', {playerId});

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [client, isConnected, sendMessage]);

    const goBack = async () => {
        try {
            if (client && isConnected) {
                const playerId = localStorage.getItem("userId");
                sendMessage('/app/game/leave', {gameId, playerId});
                disconnect();
            }
        } catch (error) {
            console.error("Error during leave:", handleError(error));
        } finally {
            localStorage.removeItem("gameId");
            // Navigate away from the game page or to a confirmation page
            navigate("/home");
        }
    }

    localStorage.setItem("gameId", gameId);
    console.log(localStorage.getItem("gameId"));

    return (
        <BaseContainer>
            <div className="lobby container">
                <div className="lobby form">
                    <h2>Share the game pin with 3 friends!</h2>
                    <div className="lobby pin-container">
                        {gameId}
                    </div>
                    <div className="lobby button-container">
                        <Button
                            className="lobby button"
                            onClick={() => goBack()}
                        >
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    )
}

export default CreateGame;