import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Loading.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {Spinner} from "components/ui/Spinner";

const Loading = () => {
    const navigate = useNavigate();
    const [gameStatus, setGameStatus] = useState<boolean>(false);

    useEffect(() => {
        async  function gameSet(){
            try {
                const gameID = localStorage.getItem("gameID");
                const requestBody = JSON.stringify({gameID});
                const response = await api.get(`/game/${gameID}/status`, requestBody);
                setGameStatus(response.data);
            }catch (error){
                alert(
                    `Something went wrong while creating the game: ${handleError(error)}`
                )
                navigate("/home");
            }
        }
    }, []);
    let content = <Spinner/>

    return (
        <div className="game box-image">
            <BaseContainer className="game container">
                <h2>Loading Game</h2>
                {content}
            </BaseContainer>
        </div>
    );
};

export default Loading;