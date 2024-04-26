import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
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
                navigate("/ultimateAttack")
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
    const [WC, setWC] = useState<String>(null);
    const {client, sendMessage, isConnected, disconnect} = useWebsocket();
    const gameId = localStorage.getItem("gameId");

    useEffect(() => {
        if (client && isConnected) {
            const subscriptionSelection = client.subscribe(`/topic/${gameId}/selection`, (message) => {
                const data = JSON.parse(message.body);
                console.log(data);
                setWC(data.WinCondition);
            });

            sendMessage(`/app/${gameId}/selection`, {});

            return () => {
                subscriptionSelection.unsubscribe();
            }
        }
    }, [client, isConnected, sendMessage, disconnect]);

    return (
        <div className="Selection container">
            <WinConditionCards condition="Zürcher"/>
        </div>
    )
}

export default WinCondition;