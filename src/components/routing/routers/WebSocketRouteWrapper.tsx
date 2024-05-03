// WebSocketRouteWrapper.tsx
import React, { ReactNode } from "react";
import { WebsocketProvider } from "../../views/Websockets";

interface WebSocketRouteWrapperProps {
    children: ReactNode;
}

const WebSocketRouteWrapper: React.FC<WebSocketRouteWrapperProps> = ({ children }) => {
    return (
        <WebsocketProvider>
            {children}
        </WebsocketProvider>
    );
};

export default WebSocketRouteWrapper;
