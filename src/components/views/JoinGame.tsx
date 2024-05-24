import React, {useEffect, useState} from "react"; //NOSONAR
import {api, handleError} from "helpers/api";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useWebsocket} from "./Websockets";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;

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
    const [gameId, setgameId] = useState<string>("");
    const {client, sendMessage, isConnected, disconnect} = useWebsocket();
    const userId = localStorage.getItem("userId");
    const [joined, setJoined] = useState(false);

    console.log("playerId join: ", userId);

    useEffect(() =>{
        if (client && isConnected){
            const subscription = client.subscribe("/user/queue/gameJoined", (message) => {
                const data= JSON.parse(message.body);
                setJoined(data.joined);
                if (data.joined){
                    localStorage.setItem("gameId", gameId);
                    navigate(`/game/${gameId}/lobby`);
                }
                console.log(joined);
            });

            return () => {
                if(subscription){
                    subscription.unsubscribe();
                }
            };
        }
    }, [client, isConnected, gameId]);

    const joinGame = () => {
        if (client && isConnected && gameId){
            try{
                console.log("Attempting to join game with ID:", gameId);
                if(!joined){
                    console.log("Here");
                    sendMessage("/app/game/join", {gameId, userId});
                }
            }catch (error){
                alert(`Something went wrong while trying to join the game: \n${handleError(error)}`);
            }
        }
    }

    const goBack = (): void => {
        localStorage.removeItem("gameId");
        navigate("/home");
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
                            Your goal is to win the game by either fulfilling your wincondition or accumulating the
                            highest amount of money.
                        </div>
                    </div>
                </div>
                <div className="lobby form">
                    <h2>Write the shared pin game to join</h2>
                    <PinField
                        placeholder="Pin Code"
                        value={gameId}
                        onChange={(un: string) => setgameId(un)}
                    >
                    </PinField>
                    <div className="lobby button-container">
                        <Button
                            className="lobby button"
                            onClick={() => goBack()}
                        >
                            Go Back
                        </Button>
                        <Button
                            className="lobby button"
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