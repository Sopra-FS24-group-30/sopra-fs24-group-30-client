import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import {useNavigate} from "react-router-dom";
import "styles/views/Loading.scss";
import BaseContainer from "components/ui/BaseContainer";
import {Spinner} from "components/ui/Spinner";
import {useWebsocket} from "./Websockets";

const LoadingHost = () => {
    const navigate = useNavigate();
    const gameId = localStorage.getItem("gameId");
    const [status, setStatus] = useState<String>(null); //NOSONAR
    const {client, sendMessage, isConnected, disconnect} = useWebsocket();
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if(client && isConnected){
            const subscriptionStatus = client.subscribe(`/topic/game/status/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                                setStatus(data.status);
            });

            return ()=> {
                subscriptionStatus.unsubscribe();
            }
        }

    }, [client, isConnected, status]);

    useEffect(() => {
        if(client && isConnected && gameId){
            const checkGameStatus = () => {
                                sendMessage(`/app/game/${gameId}/status`, {});
            };
            checkGameStatus();

            const intervalId = setInterval(checkGameStatus, 5000);

            return () => clearInterval(intervalId);
        }
    }, [client, isConnected, sendMessage, gameId, status]);

    useEffect(() => {
        if (status === "ALMOST_READY"){
                        navigate(`/game/${gameId}/selectTeam`);
        }
    })

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

export default LoadingHost;