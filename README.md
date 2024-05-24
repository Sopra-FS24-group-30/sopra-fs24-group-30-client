# Mario After Party

## Introduction

*Four people, four friends, two vs. two – who will win?*<br>
Mario After Party is an online board game, where you play in teams of two against each other. Your goal as a team? Beat the other one! But how?
The simplest way is by gaining money by walking over the goal. Whoever has the highest amount of money at the end, wins the game, but winning that way is boring...
Therefore, each player gets a unique WinCondition at the beginning. You can throw a die during your turn and move closer to the goal.
Once you or your teammate reaches the goal with the fulfilled WinCondition, the game terminates.

In addition to the WinCondition, each player gets a unique Ultimate that can be used once over the course of the game. They can modify the game state in your favor. Or not.
Anyways... you can also collect usables throughout the game and use them during your turn. Usables have a less significant effect than Ultimates.
But same as Ultimates, usables might be beneficial for you, or they might not.
Really, just be prepared for anything that can happen to your Money, your collected usables, or even You.

With that being said, find yourself three friends and enjoy the game [here](https://sopra-fs24-group-30-client.oa.r.appspot.com/register) :)<br>
Click [here](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-server) if you want to check out the Server side.

## Technologies
### Voice Chat API

### Websockets
We integrated websockets in our web game, to ensure real-time communication between the client and the server.
The, by SPRING boot provided, websockets create a state or a connection between the client and backend. 
Compared to REST APIs which needs to send a request to get a response from the backend, by using websockets it is possible to 
send responses from the backend without necessarilly being called upon. Furthermore, the user can receive userscpecific information
which is not only important to send different winconditions to different clients, but also because strengthens our system.
The websockets are being configured as soon as the server is being started. As soon as the user either creates or joins a game, he is being
connected with the websockets, and his session as well as user ID is being safed in a hashmap in the backend, to send user specific requests.

## High-level components

- ### User Views
    As a User, the [Login](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/Login.tsx), 
    [UserOverview](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/UserOverview.tsx) and 
    [Edit](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/Edit.tsx) are crucial. 
    With that, the User can log in and edit their userprofile, and see other profiles.

- ### Routing
    The [AppRouter](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/routing/routers/AppRouter.js) is the main router for the application.

- ### Game
    Before a game start, players get thrown into the [Lobby](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/Lobby.tsx) while the host is in
    [CreateGame](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/CreateGame.tsx). After everyone is ready, the get redirected to
    [wincondition](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/WinCondition.tsx) and [ultimates](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/UltimateAttack.tsx) where players can choose one each.
    The [Board](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/Board.tsx) is the main component for our game. Everything game related, like moving or handling usables happens in there.
    When the game terminates, the players get redirected to a [ranking](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/Ranking.tsx) page, where they can see the winners and the reason why they won.

- ### Websockets
    The [Websockets](https://github.com/Sopra-FS24-group-30/sopra-fs24-group-30-client/blob/main/src/components/views/Websockets.tsx) file handles the communication between client and server.

    

## Launch and Deployment
(Carlos)
## Illustrations
(Céline)
## Roadmap
(Ambros)
## Items, Cards, Spaces, Effects, etc.
(Marius)
## Authors and acknoledgement
(Marius)
## Keybinds
(Marius)
## License
(Marius)
## Layout/Design
(Marius)