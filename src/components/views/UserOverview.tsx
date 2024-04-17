import React, {useEffect, useState} from "react";
import {api, handleError} from "helpers/api";
import {Spinner} from "components/ui/Spinner";
import {Button} from "components/ui/Button";
import {useNavigate, Link} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/UserOverview.scss";
import {User} from "types";

const Player = ({user}: { user: User }) => {
    console.log(user)

    return (
        <div className="player container">
            <div className="player username">{user.username}</div>
            <div className="player id">id: {user.id}</div>
        </div>
    );
}

Player.propTypes = {
    user: PropTypes.object,
};

const SearchField = (props) => {
    return (
        <input className="game search-input" placeholder = "search by username" value = {props.value} onChange={(e)=>props.onChange(e.target.value)}/>
    )
}

SearchField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
}

const UserOverview = () => {
    // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
    const navigate = useNavigate();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState
    const [users, setUsers] = useState<User[]>(null);
    const [filter, setFilter] = useState<string>(null);

    const goBack = async () => {
        navigate("/home");
    };

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://react.dev/reference/react/useEffect
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const username = localStorage.getItem("username"); //NOSONAR
                const response = await api.get("/users");

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUsers(response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(
                    `Something went wrong while fetching the users: \n${handleError(
                        error
                    )}`
                );
                console.error("Details:", error);
                alert(
                    "Something went wrong while fetching the users! See the console for details."
                );
            }
        }

        fetchData();
    }, []);

    let content = <Spinner/>;

    if (users) {
        content = (
            <div className="game">
                <SearchField
                    value={filter}
                    onChange={(un: string) => setFilter(un)}
                />
                <ul className="game user-list">
                    {users
                        .filter((user:User) =>{
                            return !filter || user.username.toLowerCase().includes(filter.toLowerCase());
                        })
                        .map((user: User) => (
                            <li key={user.id}>
                                <Link to={`/profile/${user.id}`}>
                                    <Player user={user}/>
                                </Link>
                            </li>
                        ))}
                </ul>
                <Button width="100%" onClick={() => goBack()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="game box-image">
            <BaseContainer className="game container">
                <h2>Home</h2>
                <p className="game paragraph">
                    Hello {localStorage.getItem("username")}!
                </p>
                {content}
            </BaseContainer>
        </div>
    );
};

export default UserOverview;
