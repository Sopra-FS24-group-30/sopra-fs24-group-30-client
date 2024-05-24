import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useWebsocket} from "./Websockets";
import {Spinner} from "components/ui/Spinner";

const Player = ({player}: { player: User }) => {
    console.log(player)

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


const Lobby: React.FC = () =>{
    const gameId = localStorage.getItem("gameId");
    const navigate = useNavigate();
    const [players, setPlayers] = useState<User[]>(null);
    const [gameStatus, setGameStatus] = useState<String>(null);
    const {client, sendMessage, isConnected, disconnect} = useWebsocket();

    useEffect(() => {
        if(client && isConnected){
            const subscriptionPlayers = client.subscribe(`/topic/players/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                console.log(data);
                setPlayers(data);
            });
            const subscriptionStatus = client.subscribe(`/topic/game/status/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                console.log(data.status);
                setGameStatus(data.status);
            })

            sendMessage(`/app/game/${gameId}/lobby`, {});

            console.log(gameStatus);

            return () =>{
                subscriptionPlayers.unsubscribe();
                subscriptionStatus.unsubscribe();
            };
        }

    }, [client, isConnected, sendMessage, disconnect]);

    useEffect(() => {
        if(client && isConnected && gameId){
            const checkStatus = () => {
                console.log("Getting gameStatus...");
                sendMessage(`/app/game/${gameId}/status`, {});
            };
            checkStatus();

            const intervalId = setInterval(checkStatus, 5000);
            return () => clearInterval(intervalId);
        }
    }, [client, isConnected, gameStatus, gameId, navigate]);

    useEffect(() => {
        if(gameStatus==="SETUP"){
            console.log("Navigating to wincondition");
            navigate(`/game/${gameId}/wincondition`);
        }
    })

    const leave = async () => {
        try {
            if (client && isConnected) {
                const playerId = localStorage.getItem("userId");
                sendMessage("/app/game/leave", {gameId, playerId});
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

    let content = <Spinner/>

    if (players){
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
                    <h2>Game: {gameId}</h2>
                    <h3>Player overview</h3>
                    {content}
                    <Button width="100%" onClick={() => leave()}>
                        Leave Game
                    </Button>
                </div>
            </div>
        </BaseContainer>
    )
}

export default Lobby;