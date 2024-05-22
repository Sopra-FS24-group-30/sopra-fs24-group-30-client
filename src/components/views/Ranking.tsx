import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Ranking.scss";
import {useWebsocket} from "./Websockets";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const Ranking = () => {
    const navigate = useNavigate();
    const gameId = localStorage.getItem("gameId");
    const {client , sendMessage, isConnected, disconnect} = useWebsocket();
    const [winners, setWinners] = useState<String>("");
    const [reason, setReason] = useState<String>("");

    useEffect(() => {
        if(client && isConnected){
            const subscriptionRanking = client.subscribe(`/topic/game/${gameId}/ranking`, (message) => {
                const data = JSON.parse(message.body);
                setWinners(data.winners);
                setReason(data.reason);
            })

            return () => {
                subscriptionRanking.unsubscribe();
            }
        }
    }, [client, isConnected, disconnect, winners, reason]);

    const goBack = (): void => {
        try{
            if (client && isConnected) {
                const playerId = localStorage.getItem("userId");
                sendMessage("/app/game/leave", {gameId, playerId});
                disconnect();
            }
        } catch (error){
            console.error("Error during leave:", handleError(error));
        } finally {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("username");
            const userId = localStorage.getItem("userId");

            localStorage.clear();

            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            localStorage.setItem("userId", userId);
            navigate("/home");
        }
    }

    return(
        <div className="ranking container">
            <div className="ranking winner-container">
                <div className="ranking winner-title">
                    Winner:
                </div>
                <div className="ranking winner-team">
                    {winners}
                </div>
            </div>
            <div className="ranking reason-container">
                <div className="ranking reason-title">
                    Reason:
                </div>
                <div className="ranking reason-description">
                    {reason}
                </div>
                <Button onClick={() => goBack()}>Go back to home</Button>
            </div>
        </div>
    )
}

export default Ranking;