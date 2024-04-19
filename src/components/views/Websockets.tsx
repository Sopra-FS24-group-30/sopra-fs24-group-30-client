// @ts-ignore
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {Client} from '@stomp/stompjs';

interface WebsocketsType{
    client: Client | null;
    sendMessage: (destination: string, body: any) => void;
    isConnected: boolean;
    disconnect: () => void;
}

const Websockets = createContext<WebsocketsType | null>(null);

interface WebsocketProviderProps{
    children: ReactNode;
}

export const WebsocketProvider: React.FC<WebsocketProviderProps> = ({children}) =>{
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const newClient = new Client({
            brokerURL: "ws://localhost:8080/ws",
            onConnect: () =>{
                console.log("Connected to WS");
                setIsConnected(true);
            },
            onStompError: (frame) =>{
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                setIsConnected(false);
            },
            reconnectDelay: 5000,
        });

        newClient.activate();
        setClient(newClient);

        return () => {
            newClient.deactivate()
        }
    }, []);

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
