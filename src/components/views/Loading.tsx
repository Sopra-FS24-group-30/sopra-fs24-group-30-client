import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import {useNavigate} from "react-router-dom";
import "styles/views/Loading.scss";
import BaseContainer from "components/ui/BaseContainer";
import {Spinner} from "components/ui/Spinner";
import {useWebsocket} from "./Websockets";

const Loading = () => {
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
                console.log(data);
                setStatus(data.status);
            });

            const subscriptionPlayerId = client.subscribe("/user/queue/game/PlayerId", (message) => {
                const data = JSON.parse(message.body);
                console.log("Received playerId:",data);
                localStorage.setItem("playerId", data.playerId);
            })

            console.log("send message");
            sendMessage(`/app/game/${gameId}/playerAtLP`, {username});

            return ()=> {
                subscriptionStatus.unsubscribe();
                subscriptionPlayerId.unsubscribe();
            }
        }

    }, [client, isConnected, status]);

    useEffect(() => {
        if(client && isConnected && gameId){
            const checkGameStatus = () => {
                console.log("Requesting game status...");
                sendMessage(`/app/game/${gameId}/status`, {});
            };
            checkGameStatus();

            const intervalId = setInterval(checkGameStatus, 5000);

            return () => clearInterval(intervalId);
        }
    }, [client, isConnected, sendMessage, gameId, status]);

    useEffect(() => {
        if (status === "READY" && localStorage.getItem("playerId")){
            console.log("Navigating to board");
            navigate(`/game/${gameId}/board`);
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

export default Loading;