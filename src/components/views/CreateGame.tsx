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
    const [id, setId] = useState<String>(null);

    useEffect(() => {
        if (client && isConnected){
            const subscription = client.subscribe('/topic/gameCreated', (message) => {
                const data = JSON.parse(message.body);
                console.log("Received data: ", data);
                setId(data.gameId);
            });

            const playerId = localStorage.getItem("userId");
            console.log("PlayerId: ", playerId);
            sendMessage('/app/game/create', {playerId});


            return () => {
                subscription.unsubscribe();
            };
        }
    }, [client, isConnected, sendMessage]);

    const goBack = (): void => {
        disconnect();
        navigate("/home");
    }

    localStorage.setItem("gameId", id);
    console.log(localStorage.getItem("gameId"));

    return (
        <BaseContainer>
            <div className="lobby container">
                <div className="lobby form">
                    <h2>Share the game pin with 3 friends!</h2>
                    <div className="lobby pin-container">
                        {id}
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