// @ts-ignore
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {Client, IFrame} from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface WebsocketsType{
    client: Client | null;
    sendMessage: (destination: string, body: any) => void;
    isConnected: boolean;
    disconnect: () => void;
}

const Websockets = createContext<WebsocketsType | null>(null);

interface WebsocketProviderProps{
    children: ReactNode;
    userId: string;
}

export const WebsocketProvider: React.FC<WebsocketProviderProps> = ({children, userId}) =>{
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const socket = new SockJS(`wss://sopra-fs24-group-30-server.oa.r.appspot.com/ws?userId=${localStorage.getItem("userId")}`);
        const newClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () =>{
                console.log("Connected to WS");
                setIsConnected(true);
            },
            onStompError: (frame: IFrame) =>{
                console.error("Broker reported error: " + frame.headers["message"]);
                console.error("Additional details: " + frame.body);
                setIsConnected(false);
            },
            reconnectDelay: 5000,
        });

        newClient.activate();
        setClient(newClient);

        return () => {
            newClient.deactivate();
        };
    }, [userId]);

    const sendMessage = (destination: string, body: any) => {
        if (isConnected) {
            client?.publish({destination, body: JSON.stringify(body)});
        } else {
            console.log("Attempted to send message without a connection.");
        }
    };

    const disconnect = () =>{
        client?.deactivate();
        setClient(null);
        console.log("Correctly disconnected");
    }

    return (
        <Websockets.Provider value = {{client, sendMessage, isConnected, disconnect}}>
            {children}
        </Websockets.Provider>
    );
};

export const useWebsocket = (): WebsocketsType | null =>{
    return useContext((Websockets));
};
