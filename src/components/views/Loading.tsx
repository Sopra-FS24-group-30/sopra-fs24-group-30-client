import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import {useNavigate} from "react-router-dom";
import "styles/views/Loading.scss";
import BaseContainer from "components/ui/BaseContainer";
import {Spinner} from "components/ui/Spinner";

const Loading = () => {
    const navigate = useNavigate();
    const [gameStatus, setGameStatus] = useState<boolean>(false); //NOSONAR

    useEffect(() => {
        async  function gameReady(){ //NOSONAR
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