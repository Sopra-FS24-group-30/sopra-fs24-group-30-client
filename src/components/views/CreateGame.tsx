import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useWebsocket} from "./Websockets";
import {Spinner} from "../ui/Spinner";

const Player = ({player}: {player: User}) => {
    return (
        <div className="player container">
            <div className="player username">{player.id}</div>
        </div>
    );
}

Player.propTypes = {
    player: PropTypes.object,
};

const CreateGame:  React.FC = () =>{
    const {client , sendMessage, isConnected, disconnect} = useWebsocket();
    const navigate = useNavigate();
    const playerId = localStorage.getItem("userId");
    const [gameId, setGameId] = useState<String>(null);
    const [players, setPlayers] = useState<User[]>(null);
    const [gameReady, setGameReady] = useState<boolean>(false);
    localStorage.setItem("host", "true");

    console.log("playerId create: ", playerId);

    useEffect(() => {

        if (client && isConnected){
            if(localStorage.getItem("gameId")===null){
                sendMessage("/app/game/create", {playerId});
            }
            const subscription = client.subscribe("/topic/gameCreated", (message) => {
                const data = JSON.parse(message.body);
                console.log("Received data: ", data);
                localStorage.setItem("gameId", data.gameId);
            });

            const subscriptionPlayers = client.subscribe("/topic/players", (message) => {
                const data = JSON.parse(message.body);
                console.log(data);
                setPlayers(data);
            });

            const subscriptionGameReady = client.subscribe("/topic/gameReady", (message) =>{
                const data = JSON.parse(message.body);
                setGameReady(data.gameReady);
            })

            setGameId(localStorage.getItem("gameId"));
            console.log("GameId: ", gameId);
            sendMessage("/app/game/lobby", {gameId});
            sendMessage("/app/gameReady", {gameId});

            return () => {
                subscriptionPlayers.unsubscribe();
                subscription.unsubscribe();
                subscriptionGameReady.unsubscribe();
            };
        }
    }, [client, isConnected, sendMessage, disconnect, gameId, players]);

    const goBack = async () => {
        try {
            if (client && isConnected) {
                const playerId = localStorage.getItem("userId");

                localStorage.removeItem("host");
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

    const startGame = async() => {
        try{
            if (client && isConnected){
                sendMessage("/app/game/setUp", {gameId});
                navigate("/wincondition");
            }
        }catch (error){
            console.error("Error during starting Game setup: ", handleError(error));
        }
    }

    let contentId = <Spinner/>
    if (gameId) {
        contentId = (
            <div className="lobby pin-container">
                {gameId}
            </div>
        )
    }

    let content = <Spinner/>

    if (players) {
        content = (
            <div className="lobby">
                <ul className="lobby player-list">
                    {players.map((player: String) =>(
                        <li key={player}>
                            <div className="player container">
                                <div className="player id">
                                    {player}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <BaseContainer>
            <div className="lobby container">
                <div className="lobby form">
                    <h2>Share the game pin with 3 friends!</h2>
                    {contentId}
                    <div className="lobby button-container">
                        <Button
                            className="lobby button"
                            onClick={() => goBack()}
                        >
                            Go Back
                        </Button>
                        <Button
                            className="lobby button"
                            disabled={!gameReady}
                            onClick={() => startGame()}
                        >
                            Game ready
                        </Button>
                    </div>
                </div>
                <div className="lobby form">
                    <h3>Player overview</h3>
                    {content}
                </div>
            </div>
        </BaseContainer>
    )
}

export default CreateGame;