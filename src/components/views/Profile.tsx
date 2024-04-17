import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import {Spinner} from "components/ui/Spinner";
import {Button} from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Profile.scss";
import User from "models/User";
import PropTypes from "prop-types";

const Information = (props) => {
    return (
        <div className="user-information container">
            <div className="user-information title">{props.title}</div>
            <div className="user-information description">{props.description}</div>
        </div>
    )
}

Information.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
};

const ACHIEVEMENTS ={
    "Baron I": "Own 40 coins in one game",
    "Baron II": "Own 80 coins in one game",
    "Baron III": "Own 200 coins in one game",
    "Ouch!": "Lost all of your coins in one round",
    "Marathon I": "Be in a game for 60 min",
    "Marathon II": "Be in a game for 120 min",
    "Marathon III": "Be in a game for 180 min",
    "Gamer": "Win 3 games in a row",
    "Tried your best": "Lost 3 games in a row",
    "Amateur": "Win one game without using your ultimate attack",
    "Pro": "Win one game with 0 coins",
    "Smooth criminal": "Betrayed your teammate",
    "We're all in this together": "No winner in one game",
    "Orange cat behavior I": "Got on the cat tsunami field 3 times in a game",
    "Orange cat behavior II": "Got on the cat tsunami field 8 times in a game",
};

const Profile = () => {
    const navigate = useNavigate();
    const {userid} = useParams();
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        async function fetchData() {

            try {
                const response = await api.get(`/profile/${userid}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setUser(response.data);

                console.log("request to:", response.request.responseURL);
                console.log("status code:", response.status);
                console.log("status text:", response.statusText);
                console.log("requested data:", response.data);

            } catch (error) {
                console.error(`something went wrong while fetching the user:${handleError(error)}`);
            }
        }

        fetchData();
    }, [userid]);
    const goBack = (): void => {
        navigate("/game");
    }

    const Edit = (id): void => {
        navigate(`/profile/${id}/edit`)
    }

    let content = <Spinner/>

    if (user) {
        if (user.username === localStorage.getItem("username")) {
            content = (
                <div className="Your profile">
                    <ul className="profile information-list">
                        <li>
                            <Information title="ID" description={user.id}/>
                            <Information title="Username" description={user.username}/>
                            <Information title="Birthday" description={user.birthday}/>
                            <Information title="Creation date" description={user.creationDate}/>
                            <Information title="Password" description={user.password}/>
                            <div className="user-information container">
                                <div className="user-information title">Achievements</div>
                                <div className="user-information description">
                                    <div className="achievements container">
                                        {Object.entries(ACHIEVEMENTS).map(([title, description], index) => (
                                            <div key={index} className="achievements circle-container"> {/*NOSONAR*/}
                                                <div className="achievements circle"/>
                                                <span className="achievements description-container">
                                                    {title}: {description}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <ul className="profile button-container">
                        <Button width="100%" onClick={() => goBack()}>
                            Go Back
                        </Button>
                        <Button width="100%" onClick={() => Edit(user.id)}>Edit</Button>
                    </ul>
                </div>
            )
        } else {
            content = (
                <div className="profile">
                    <title>Hello</title>
                    <ul className="profile information-list">
                        <li>
                            <Information title="ID" description={user.id}/>
                            <Information title="Username" description={user.username}/>
                            <Information title="Birthday" description={user.birthday}/>
                            <Information title="Creation date" description={user.creationDate}/>
                            <Information title="Status" description={user.status}/>
                            <div className="user-information container">
                                <div className="user-information title">Achievements</div>
                                <div className="user-information description">
                                    <div className="achievements container">
                                        {Object.entries(ACHIEVEMENTS).map(([title, description], index) => (
                                            <div key={index} className="achievements circle-container"> {/*NOSONAR*/}
                                                <div className="achievements circle"/>
                                                <span className="achievements description-container">
                                                    {title}: {description}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <Button width="100%" onClick={() => goBack()}>
                        Go Back
                    </Button>
                </div>
            )
        }
    }

    return (
        <div className="profile box-image">
            <BaseContainer className="profile container">
                <h2>Profile</h2>
                {content}
            </BaseContainer>
        </div>
    )
}

export default Profile;