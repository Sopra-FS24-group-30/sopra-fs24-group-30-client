import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Lobby.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const CreateGame = () =>{

    const navigate = useNavigate();
    const [gameID, setGameID] = useState<String>(null);
    const [gameStatus, setGameStatus] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData(){
            try{
                const username = localStorage.getItem("username");
                const requestBody =  JSON.stringify({username});
                const response = await api.post('/create/game', requestBody);
                setGameID(response.data)
                localStorage.setItem("gameID", gameID);

                const requestStatus = JSON.stringify({gameID});
                const responseStatus = await api.get('/game/${gameID}/status', requestStatus);
            } catch (error){
                console.error(`something went wrong while fetching the gameID: ${handleError(error)}`)
            }
        }

        fetchData();
    }, []);

    const goBack = (): void => {
        navigate("/home");
    }

    return (
        <BaseContainer>
            <div className="lobby container">
                <div className="lobby form">
                    <h2>Share the game pin with 3 friends!</h2>
                    <div className="lobby pin-container">
                        {gameID}
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