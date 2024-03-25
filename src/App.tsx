import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import Header from "./components/views/Header";
/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {
  return (
    <div>
      <Header/>
      <AppRouter />
    </div>
  );
};

export default App;
