import React, {useState} from "react";
import {api, handleError} from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import {Button} from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
Using the same template as the login, and therefore using the same .scss file, and having the same names
 */

const FormField = (props) => {
    return (
        <div className="register field">
            <label className="register label">{props.label}</label>
            <input
                className="register input"
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

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>(null);
    const [username, setUsername] = useState<string>(null);
    const [password, setPassword] = useState<string>(null);


    const doRegister = async () => {
        try {
            const requestBody = JSON.stringify({name, username, password});
            const response = await api.post("/users", requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            localStorage.setItem("token", user.token);
            localStorage.setItem("username", user.username);
            // register successfully worked --> navigate to the route /game in the GameRouter
            navigate("/game");
        } catch (error) {
            alert(
                `Something went wrong during the sign up: \n${handleError(error)}`
            );
        }
    };

    const doLogin = (): void => {
        navigate("/login");
    }

    return (
        <BaseContainer>
            <div className="register container">
                <div className="register form">
                    <h3>Sign up</h3>
                    <FormField
                        label="Name"
                        value={name}
                        onChange={(un: string) => setName(un)}
                    />
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
                    <div className="register button-container">
                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doRegister()}
                        >
                            Sign up
                        </Button>
                    </div>
                </div>
                <div className="register login">
                    <h3>Already registered?</h3>
                    <Button
                        width="100%"
                        onClick={() => doLogin()}
                    >
                        Return to login
                    </Button>
                </div>
            </div>

        </BaseContainer>
    );
};

export default Register;