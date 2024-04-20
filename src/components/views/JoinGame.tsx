import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useWebsocket} from "./Websockets";

const PinField = (props) => {
    return (
        <input
            className="lobby input"
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
        />
    );
};

PinField.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const JoinGame: React.FC = () => {
    const navigate = useNavigate();
    const [gameId, setgameId] = useState<string>(null);
    const {client, sendMessage, isConnected, disconnect} = useWebsocket();
    const playerId = localStorage.getItem("userId");
    const [joined, setJoined] = useState(false);

    useEffect(() =>{
        if (client && isConnected){
            const subscription = client.subscribe('/topic/gameJoined', (message) => {
                const data= JSON.parse(message.body);
                setJoined(data.joined);
            });

            return () => {
                if(subscription){
                    subscription.unsubscribe();
                }
            };
        }
    }, [client, isConnected, gameId]);

    const joinGame = async () => {
        if (client && isConnected && gameId){
            try{
                const msg = {gameId, playerId}
                sendMessage('/app/game/join', JSON.stringify(msg));
                if (joined){
                    localStorage.setItem("gameId", gameId);
                    navigate('/loading');
                }
            }catch (error){
                alert(`Something went wrong while trying to join the game: \n${handleError(error)}`);
            }
        }
    }

    const goBack = (): void => {
        navigate("/home");
    }

    return (
        <BaseContainer>
            <div className="lobby container">
                <div className="lobby form">
                    <h2>Write the shared pin game to join</h2>
                    <PinField
                        placeholder="Pin Code"
                        value={gameId}
                        onChange={(un:string) => setgameId(un)}
                    >
                    </PinField>
                    <div className="lobby button-container">
                        <Button
                            className="lobby button"
                            onClick={() => goBack()}
                        >
                            Go Back
                        </Button>
                        <Button className="lobby button"
                                disabled={!gameId}
                                onClick={() => joinGame()}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default JoinGame;