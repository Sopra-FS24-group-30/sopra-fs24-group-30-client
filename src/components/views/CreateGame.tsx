import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useWebsocket} from "./Websockets";
import {Spinner} from "../ui/Spinner";

const Player = ({player}: { player: User }) => {
    
    return (
        <div className="player container">
            <div className="player username">{player.username}</div>
            <div className="player id">id: {player.id}</div>
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
    const [gameId, setGameId] = useState(localStorage.getItem("gameId") || null);
    const [players, setPlayers] = useState<User[]>([]);
    const [gameReady, setGameReady] = useState<Boolean>(false);

    localStorage.setItem("host", "true");
    
    useEffect(() => {
        if (client && isConnected){
            if(!localStorage.getItem("gameId")){
                sendMessage("/app/game/create", {playerId});
            }
            const subscription = client.subscribe("/user/queue/gameCreated", (message) => {
                const data = JSON.parse(message.body);
                                localStorage.setItem("gameId", data.gameId);
                setGameId(data.gameId);
                navigate(`/game/${gameId}`, {replace: true});
            });

            const subscriptionPlayers = client.subscribe(`/topic/players/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                setPlayers(data);
                            });

            const subscriptionGameReady = client.subscribe(`/topic/gameReady/${gameId}`, (message) =>{
                const data = JSON.parse(message.body);
                setGameReady(data.gameReady);
                                            })

                        sendMessage(`/app/game/${gameId}/lobby`, {});
            sendMessage(`/app/game/${gameId}/gameReady`, {});

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
                sendMessage("/app/game/leave", {gameId, playerId});
                disconnect();
            }
        } catch (error) {
            console.error("Error during leave:", handleError(error));
        } finally {
            localStorage.removeItem("host");
            localStorage.removeItem("gameId");
            // Navigate away from the game page or to a confirmation page
            navigate("/home");
        }
    }

    const startGame = async() => {
        try{
            if (client && isConnected){
                sendMessage(`/app/game/${gameId}/setUp`, {});
                navigate(`/game/${gameId}/wincondition`);
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
                    {players.map((player: User) =>(
                        <li key={player}>
                            <div className="player container">
                                <div className="player name">
                                    {player.username}
                                </div>
                                <div className="player id">
                                    {player.id}
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
                    <div className="Game container">
                        <h2>Game description</h2>
                        <div className="Game text">
                            This is a 2 vs 2 board game, where you can use items, cards and a one time only ultimate
                            attack.
                            Your goal is to win the game by either fulfilling your wincondition and passing the goal, or accumulating the
                            highest amount of money, by the end of the game.
                        </div>
                    </div>
                </div>
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
                            Start Game
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