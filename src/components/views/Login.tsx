import React, {useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

/*
Added to push it
 */
const FormField = (props) => {
    return (
        <div className="login field">
            <label className="login label">{props.label}</label>
            <input
                className="login input"
                placeholder="enter here.."
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>(null);
    const [password, setPassword] = useState<string>(null);

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({username, password})
            const response = await api.post("/user/login", requestBody);
            const user = new User(response.data);
            localStorage.setItem("token", user.token);
            localStorage.setItem("username", user.username);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            navigate("/game");
            // Store the token into the local storage.

        } catch (error) {
            alert(
                `Something went wrong during the login: \n${handleError(error)}`
            );
        }
    };

    const doRegister = (): void => {
        navigate("/register");
    }

    return (
        <BaseContainer>
            <div className="login container">
                <div className="login form">
                    <h3>Login</h3>
                    <FormField
                        label="Username"
                        value={username}
                        onChange={(un: string) => setUsername(un)}
                    />
                    <FormField
                        label="Password"
                        value={password}
                        onChange={(un: string) => setPassword(un)}
                    />
                    <div className="login button-container">
                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doLogin()}
                        >
                            Login
                        </Button>
                    </div>
                </div>
                <div className="login register">
                    <h3>Not registered?</h3>
                    <Button
                        width="100%"
                        onClick={() => doRegister()}
                    >
                        Sign up
                    </Button>
                </div>
            </div>

        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
