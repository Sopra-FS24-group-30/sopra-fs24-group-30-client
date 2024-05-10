import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import {WebsocketProvider} from "./components/views/Websockets";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {

    const userId = localStorage.getItem("userId");

    return (
        <WebsocketProvider userId={userId}>
            <AppRouter/>
        </WebsocketProvider>
    );
};

export default App;
