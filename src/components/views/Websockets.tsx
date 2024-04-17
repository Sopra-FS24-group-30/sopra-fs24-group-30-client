// @ts-ignore
import React, { useEffect, useState } from "react";

const WebSocketComponent: React.FC = () => {
    const msg = "34567890";
    const [ws, setWs] = useState<WebSocket | null>(null); //NOSONAR
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws");
        setWs(socket);

        socket.onopen = () => {
            console.log("WebSocket is connected.");
            socket.send(msg);
        };

        socket.onmessage = (event) => {
            console.log("Message from qweqwe", event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        socket.onerror = (event) => {
            console.error("WebSocket error observed:", event);
        };

        socket.onclose = () => {
            console.log("WebSocket is closed.");
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h2>Messsages from Server</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketComponent;
