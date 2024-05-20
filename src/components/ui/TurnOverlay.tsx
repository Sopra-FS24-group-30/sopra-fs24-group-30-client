import React, { useEffect } from 'react';
import 'styles/ui/TurnOverlay.scss';

interface TurnOverlayProps {
    activePlayerName: string;
    isVisible: boolean;
    closeOverlay: () => void;
}

const TurnOverlay: React.FC<TurnOverlayProps> = ({ activePlayerName, isVisible, closeOverlay }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                closeOverlay();
            }, 3000); // The overlay will disappear after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible, closeOverlay]);

    return (
        <div className={`turn-overlay ${isVisible ? 'show' : ''}`}>
            {activePlayerName} is playing now!
        </div>
    );
};

export default TurnOverlay;