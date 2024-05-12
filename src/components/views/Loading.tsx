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

    useEffect(() => {
        if(client && isConnected){
            const subscriptionStatus = client.subscribe(`/topic/game/status/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                console.log(data);
                setStatus(data.status);
                console.log(status);
            });

            sendMessage(`/app/game/${gameId}/status`, {});

            if(status === "PLAYING"){
                //TODO: When url in app router is being changed also change here
                navigate("/board");
            }

            return ()=> {
                subscriptionStatus.unsubscribe();
            }
        }

    }, [client, isConnected, status]);
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