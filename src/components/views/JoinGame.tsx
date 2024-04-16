import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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
const JoinGame = () => {
    const navigate = useNavigate();
    const [gameID, setGameID] = useState<string>(null);

    const joinGame = async () => {
        try{
            const username = localStorage.getItem("username");
            const requestBody = JSON.stringify({username});
            localStorage.setItem("gameID", gameID)
            api.put(`/game/join/${gameID}`, requestBody);


            navigate("/loading");

        } catch (error) {
            alert(
                `Something went wrong while checking the gameID: \n${handleError(error)}`
            );
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
                        value={gameID}
                        onChange={(un:string) => setGameID(un)}
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
                                disabled={!gameID}
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