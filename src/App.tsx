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
    return (
        <WebsocketProvider>
            <AppRouter/>
        </WebsocketProvider>
    );
};

export default App;
