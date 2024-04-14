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

    useEffect(() => {
        async function fetchData(){
            try{
                const response = await api.get('/create/id');
                setGameID(response.data)
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