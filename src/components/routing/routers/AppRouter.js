import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {UserOverviewGuard} from "../routeProtectors/UserOverviewGuard";
import UserOverviewRouter from "./UserOverviewRouter";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import {RegisterGuard} from "../routeProtectors/RegisterGuard";
import Register from "../../views/Register";
import {ProfileGuard} from "../routeProtectors/ProfileGuard";
import Profile from "../../views/Profile";
import Edit from "../../views/Edit";
import {EditGuard} from "../routeProtectors/EditGuard"
import Board from "../../views/Board";
import Home from "../../views/Home";
import {HomeGuard} from "../routeProtectors/HomeGuard";
import {JoinGameGuard} from "../routeProtectors/JoinGameGuard";
import CreateGame from "../../views/CreateGame";
import JoinGame from "../../views/JoinGame";
import {CreateGameGuard} from "../routeProtectors/CreateGameGuard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial
 */
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/game/*" element={<UserOverviewGuard/>}>
                    <Route path="/game/*" element={<UserOverviewRouter base="/game"/>}/>
                </Route>

                <Route path="/board/*"
                    element={<Board/>}>
                </Route>

                <Route path="/login" element={<LoginGuard/>}>
                    <Route path="/login" element={<Login/>}/>
                </Route>

                <Route path="/" element={
                    <Navigate to="/home" replace/>
                }/>

                <Route path="/register" element={<RegisterGuard/>}>
                    <Route path="/register" element={<Register/>}/>
                </Route>

                <Route path="/profile/:userid" element={<ProfileGuard/>}>
                    <Route path="/profile/:userid" element={<Profile/>}/>
                </Route>

                <Route path="/profile/:userid/edit" element={<EditGuard/>}>
                    <Route path="/profile/:userid/edit" element={<Edit/>}/>
                </Route>

                <Route path="/home" element={<HomeGuard/>}>
                    <Route path="/home" element={<Home/>}/>
                </Route>

                <Route path="/createGame" element={<CreateGameGuard/>}>
                    <Route path="/createGame" element={<CreateGame/>}/>
                </Route>

                <Route path="/joinGame" element={<JoinGameGuard/>}>
                    <Route path="/joinGame" element={<JoinGame/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
