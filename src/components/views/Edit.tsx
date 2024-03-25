import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import {Spinner} from "components/ui/Spinner";
import {Button} from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Edit.scss";
import User from "models/User";


const Information = (props) => {
    return (
        <div className="user-information container">
            <div className="user-information title">{props.title}</div>
            <div className="user-information description-container">{props.description}</div>
        </div>
    )
}

Information.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
};

const Editable = (props) => {
    return (
        <div className="edit container">
            <div className="edit title">{props.editTitle}</div>
            <input
                className="edit input-description"
                placeholder={props.placeholder}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    )
}

Editable.propTypes = {
    editTitle: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
};

const Edit = () => {
    const navigate = useNavigate();
    const {userid} = useParams();
    const [user, setUser] = useState<User>(null);
    const [name, setName] = useState<String>(null);
    const [username, setUsername] = useState<String>(null);
    const [password, setPassword] = useState<String>(null);
    const [birthday, setBirthday] = useState("")

    const handleDate = (event) => {
        setBirthday(event.target.value);
    };

    useEffect(() => {
        async function fetchData() {

            try {
                const response = await api.get(`/profile/${userid}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setUser(response.data);


            } catch (error) {
                console.error(`something went wrong while fetching the user:${handleError(error)}`);
            }
        }

        fetchData();
    }, [userid]);

    const doUpdate = async () => {
        try {
            const requestBody = JSON.stringify({name, username, birthday, password});

            return api.put(`/profile/${userid}/edit`, requestBody);
        } catch (error) {
            console.error(`Something went wrong while updating the user:${handleError(error)}`);
        }
    }

    const Done = async (id): Promise<void> => {
        try {
            await doUpdate()
            navigate(`/profile/${id}`);

        } catch (error) {
            alert(`Something went wrong while updating the user:\n${handleError(error)}`)
        }
    }

    let content = <Spinner/>

    if (user) {
        content = (
            <div className="profile">
                <title>Hello</title>
                <ul className="profile information-list">
                    <li>
                        <Information title="ID" description={user.id}/>
                        <Editable editTitle="Name"
                            placeholder={user.name}
                            onChange={(un: string) => setName(un)}
                        />
                        <Editable editTitle="Username"
                            placeholder={user.username}
                            onChange={(un: string) => setUsername(un)}
                        />
                        <div className="birthday container">
                            <div className="birthday title">Birthday</div>
                            <input className="birthday input" type="date" onChange={handleDate}/>
                        </div>
                        <Information title="Creation date" description={user.creationDate}/>
                        <Information title="Status" description={user.status}/>
                        <Editable editTitle="Password"
                            placeholder={user.password}
                            onChange={(un: string) => setPassword(un)}
                        />
                    </li>
                </ul>
                <Button
                    width="100%"
                    onClick={() => Done(user.id)}>
                    Done
                </Button>
            </div>
        )
    }

    return (
        <BaseContainer className="profile container">
            <h2>Edit your profile</h2>
            {content}
        </BaseContainer>
    )
}

export default Edit;