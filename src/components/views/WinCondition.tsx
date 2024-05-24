import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import Player from "models/Player";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Selection.scss";
import "styles/ui/FlipCard.scss"
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {useWebsocket} from "./Websockets";
import {Spinner} from "components/ui/Spinner"
import {Simulate} from "react-dom/test-utils";
import toggle = Simulate.toggle;

const WinConditionCards = (props) => {
    const navigate = useNavigate()
    const gameId = useParams(); 
    const [flippedStates, setFlippedStates] = useState({
        card1: false,
        card2: false,
        card3: false
    });
    const [selectedCard, setSelectedCard] = useState(null); // Track the selected card

    const toggleFlip = (cardKey) => {
        if (!selectedCard) { // Only allow flipping if no card has been selected yet
            setFlippedStates(prevState => ({
                ...prevState,
                [cardKey]: !prevState[cardKey]
            }));
            setSelectedCard(cardKey); // Set the current card as selected

            setTimeout(()=>{
                navigate(`/game/${gameId}/ultimateAttack`)
            }, 1000);
        }
    };

    return (
        <div className="Selection card-container">
            {Array.from({ length: 3 }, (_, i) => i).map((i) => {
                const cardKey = `card${i + 1}`;
                
                return (
                    <div key={cardKey}
                        className={`Card container ${flippedStates[cardKey] ? "flip" : ""} ${selectedCard && selectedCard !== cardKey ? "disabled" : ""}`}
                        onClick={() => toggleFlip(cardKey)}>
                        <div className="Card inner-container">
                            <div className="Card front">
                                <div className="Card WinCondition-front"/>
                            </div>
                            <div className="Card back">
                                <div className="Card WinCondition-back">
                                    <div className="Card text-container-left">
                                        {props.condition}
                                    </div>
                                    <div className="Card text-container-right">
                                        {props.condition}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

WinConditionCards.propTypes = {
    condition: PropTypes.string,
}

const WinCondition: React.FC = () => {
    const [wincondition, setWincondition] = useState<String>(null);
    const {client, sendMessage, isConnected, disconnect} = useWebsocket();
    const gameId = localStorage.getItem("gameId");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (client && isConnected) {
            const subscriptionSelection = client.subscribe(`/user/queue/game/${gameId}/wincondition`, (message) => {
                const data = JSON.parse(message.body);
                                localStorage.setItem("wincondition", data.Wincondition);
                setWincondition(data.Wincondition);
            });

            sendMessage(`/app/game/${gameId}/wincondition`, {userId});

            return () => {
                subscriptionSelection.unsubscribe();
            }
        }
    }, [client, isConnected, sendMessage, disconnect]);

    return (
        <div className="Selection container">
            <div className="Selection text">Select a wincondition, by clicking on a card</div>
            {wincondition ? <WinConditionCards condition={wincondition}/> : <Spinner />}
        </div>
    )
}

export default WinCondition;