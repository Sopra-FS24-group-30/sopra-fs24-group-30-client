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
    const host = localStorage.getItem("username");

    useEffect(() => {
        async function fetchData(){
            try {
                if(client && isConnected){
                    const subscriptionPlayers = client.subscribe(`/topic/game/players/${gameId}`, (message) => {
                        const data = JSON.parse(message.body);
                        console.log(data.players);
                        setPlayers(data.players);
                    });

                    sendMessage(`/app/game/${gameId}/players`, {host});

                    return () => {
                        subscriptionPlayers.unsubscribe();
                    }
                }
            } catch (error) {
                console.error("Something went wrong while fetching the users: \n$")
            }
        }
        console.log("Here");
        fetchData();
    }, [client, isConnected, sendMessage, disconnect]);

    const setTeammate = (teammate) =>{
        console.log("setTeam");
        sendMessage(`/app/game/${gameId}/setTeammate`, {host, teammate});
        //TODO: when app router is changed, also change the url here
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
                            <Button className="player container" onClick={() => setTeammate(player)}>
                                <div className="player username">
                                    {player}
                                </div>
                            </Button>
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