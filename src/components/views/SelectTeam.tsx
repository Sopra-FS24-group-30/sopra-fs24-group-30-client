import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "components/ui/Button";
import {PlayerButton} from "../ui/PlayerButton";
import "styles/views/SelectTeam.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useWebsocket} from "./Websockets";
import {Spinner} from "../ui/Spinner";

const SelectTeam : React.FC = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState<string[]>(null);
    const {client, sendMessage, isConnected, disconnect} = useWebsocket();
    const gameId = localStorage.getItem("gameId");

    useEffect(() => {
        if(client && isConnected){
            const subscriptionPlayers = client.subscribe("/topic/players", (message) => {
                const data = JSON.parse(message.body);
                console.log(data);
                setPlayers(data);
            });

            sendMessage('/app/game/players', {gameId});

            return () => {
                subscriptionPlayers.unsubscribe();
            }
        }
    }, [client, isConnected, sendMessage, disconnect]);

    const setTeammate = (teamMate) =>{
        sendMessage('/app/game/setTeammate', {gameId, teamMate, });
        navigate("/board");
    }

    let content = <Spinner/>

    if (players && (localStorage.getItem("host")==="true")) {
        content = (
            <div className="selection form">
                <h2>Select your teammate</h2>
                <ul className="selection player-list">
                    {players.map((player: String) => (
                        <li key={player}>
                            <div className="player container">
                                <div className="player username"
                                     onClick={() => setTeammate(player)}>
                                    {player}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        )
    } else if (players) {
        content = (
            <div className="selection form">
                <h2>Wait for your teammate to choose the teammate</h2>
                <ul className="selection player-list">
                    {players.map((player: String) => (
                        <li key={player}>
                            <div className="player container">
                                <div className="player username">
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
        <div className="selection container">
            {content}
        </div>
    )

}

export default SelectTeam;