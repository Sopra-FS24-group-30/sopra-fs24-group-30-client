import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Profile.scss";
import User from "models/User";
import PropTypes from "prop-types";

const Information = (props) =>{
  return (
    <div className="user-information container">
      <div className="user-information title">{props.title}</div>
      <div className="user-information description">{props.description}</div>
    </div>
  )
}

Information.propTypes={
  title: PropTypes.string,
  description: PropTypes.string,
};

const Profile = () => {
  const navigate = useNavigate();
  const {userid} = useParams();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    async function fetchData(){

      try{
        const response = await api.get(`/profile/${userid}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUser(response.data);

        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

      } catch (error){
        console.error(`something went wrong while fetching the user:${handleError(error)}`);
      }
    }
    fetchData();
  }, [userid]);
  const goBack = (): void => {
    navigate("/game");
  }

  const Edit = (id): void =>{
    navigate(`/profile/${id}/edit`)
  }

  let content =<Spinner/>

  if (user) {
    if (user.username === localStorage.getItem("username")){
      content = (
        <div className="Your profile">
          <title>Hello</title>
          <ul className="profile information-list">
            <li>
              <Information title="ID" description={user.id}/>
              <Information title="Name" description={user.name}/>
              <Information title="Username" description={user.username}/>
              <Information title="Birthday" description={user.birthday}/>
              <Information title="Creation date" description={user.creationDate}/>
              <Information title="Status" description={user.status}/>
              <Information title="Password" description={user.password}/>
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
    }else {
      content = (
        <div className="profile">
          <title>Hello</title>
          <ul className="profile information-list">
            <li>
              <Information title="ID" description={user.id}/>
              <Information title="Name" description={user.name}/>
              <Information title="Username" description={user.username}/>
              <Information title="Birthday" description={user.birthday}/>
              <Information title="Creation date" description={user.creationDate}/>
              <Information title="Status" description={user.status}/>
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
    <BaseContainer className="profile container">
      <h2>Profile</h2>

      {content}
    </BaseContainer>
  )
}

export default Profile;