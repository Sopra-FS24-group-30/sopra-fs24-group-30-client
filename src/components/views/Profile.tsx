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

/*
    Achievements yet to be implemented
    "Ouch!", "Lost all of your coins in one round"
    "Smooth criminal", "Betrayed your teammate"
    "We're all in this together", "No winner in one game"
    "Orange cat behavior I", "Got on the cat tsunami field 3 times in a game"
    "Orange cat behavior II", "Got on the cat tsunami field 8 times in a game"
 */

const ACHIEVEMENTS ={
    "baron1": ["Baron I","Own 40 coins in one game"],
    "baron2": ["Baron II","Own 80 coins in one game"],
    "baron3": ["Baron III", "Own 200 coins in one game"],
    "endurance1": ["Marathon I", "Be in a game for 60 min"],
    "endurance2": ["Marathon II", "Be in a game for 120 min"],
    "endurance3": ["Marathon III", "Be in a game for 180 min"],
    "gamer": ["Gamer", "Win 3 games in a row"],
    "doingYourBest": ["Tried your best", "Lost 3 games in a row"],
    "noUltimate": ["Amateur", "Win one game without using your ultimate attack"],
    "noMoney": ["Pro", "Win one game with 0 coins"]




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
        navigate("/users");
    }

    const Edit = (id): void => {
        navigate(`/profile/${id}/edit`)
    }

    let content = <Spinner/>
    if (user) {
        let ownProfile;
        if(parseInt(localStorage.getItem("userId")) === user.id){
            ownProfile = true;
        }else{
            ownProfile = false;
        }
        content = (
            <div className="Your profile">
                <ul className="profile information-list">
                    <li>
                        <Information title="ID" description={user.id}/>
                        <Information title="Username" description={user.username}/>
                        <Information title="Birthday" description={user.birthday}/>
                        <Information title="Creation date" description={user.creationDate}/>
                        {ownProfile ? <Information title="Password" description={user.password}/> : null}
                        {ownProfile ?  null : <Information title="Status" description={user.status} />}
                        <Information title={"Games Won: "} description={user.achievement.totalGamesWon}></Information>
                        <div className="user-information container">
                            <div className="user-information title">Achievements</div>
                            <div className="user-information description">
                                <div className="achievements container">
                                    {Object.entries(ACHIEVEMENTS).map(([achievementName,[title,description]], index) => (
                                        <div key={index} className="achievements circle-container"> {/*NOSONAR*/}
                                            <div className={"achievements " + (user.achievement[achievementName] ? "circleTrue" : "circleFalse")}/>
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
                    {ownProfile ? <Button width="100%" onClick={() => Edit(user.id)}>Edit</Button> : null}
                </ul>
            </div>
        )
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