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
The following picture illustrates how all sites interact with each other. The user starts by either signing or loging in.
As soon as the user is on the home site he has the choice between creating or joining a game, look at all the users or logout.

![](Pictures_README/Flow.png "Flow")

<img alt="Login.png" src="Pictures_README/Login.png" width="350" height="" title="Login Site"/>

<img src="Pictures_README/Homepage.png" width="350"/>

### User oversight
To see all the users of a game the user has to click on the see all users button. After being redirected the user can see a list
of all the registered users. To search for a specific person, he can use the searchbar and enter the name of the desired user.

<img src="Pictures_README/Useroverview.png" width="350"/>

By clicking on a user box, the profile of him pops up and shows various information about him.
An important note is that by hovering over the achievement circles, the user is able to see, which achievements there are. 
If an achievement is red it means, that the user hasn't unlocked the achievement yet. As soon as one is unlocked the inner circle changes to yellow.

<img src="Pictures_README/Profile.png" width="350" title="Profile"/>

Additionally, when the user clicks on his own profile, he is able to edit his profile to a certain extend, like changing the username and adding the birthday.

<img src="Pictures_README/OwnProfile.png" width="250"/>

<img src="Pictures_README/Edit.png" width="250"/>

### Game
To play Mario After Party there are 4 users needed. One user has to create the game and then share the provided game pin with 3 other friends.
Which have to click on the join game button in home. To join the game they have to enter the game pin and click on join.
If the game pin is correct, they will be immediately redirected to the lobby site, where they can see all the players in the game.

<img src="Pictures_README/CreateGame.png" width="" height="250"/>
<img height="250" src="Pictures_README/JoinGame.png"/>
<img height="250" src="Pictures_README/Lobby.png"/>

As soon as all four players have successfully joined the game, the host can click on the "Start Game" button to start the game.
The players can choose a wincondition by clicking on one of the three cards after being slid in. The same procedure also applies for the ultimate attack selection.

<img height="200" src="Pictures_README/Wincondition_Back.png"/>
<img height="200" src="Pictures_README/Wincondition_Flipping.png"/>
<img height="200" src="Pictures_README/Wincondition_Front.png"/>

Afterward every player is being redirected to the loading site, and as soon as all players arrive, the host will be redirected to select his desired teammate. And as soon as 
he has clicked on one player, everyone is being redirected to the board site, where the game starts.

<img height="280" src="Pictures_README/Loading.png"/>
<img height="280" src="Pictures_README/TeamSelection.png"/>

This game is a typical board game, except that everything can and will happen.
Each player can play once in a turn and use different objects to win the game.
A player is able to either use an item, a card or the ultimate attack, which can be used exactly once in the whole game. In each turn the player can roll the dice to move its figure on the board. 
If a player used a card however he may not use the dice as the card replaces it. 
To win the game a player can either fulfill their win condition and pass the goal field to end the game prematurely, or have the maximum amount of money as a team combined when the turn limit is being met.
Each player can see how far they are away from achieving their win condition, by the circle next to the wincondition information box.

<img height="500" src="Pictures_README/Board.png"/>

<img height="180" src="Pictures_README/PopUp_Ultimate.png"/>
<img height="180" src="Pictures_README/Popup_Wincondition.png"/>


To see the information about an item, wincondition or ultimate attack the player can hover over the according box.

<img height="180" src="Pictures_README/Message_RollDice.png"/>

After every action, a message pops up to inform the player what is happening.

Finally, when the game ends, all the players are being redirected to the ranking page.
<img height="300" src="Pictures_README/Ranking.png"/>

## Roadmap
(Ambros)
## Items, Cards, Spaces, Effects, etc.
(Marius)
## Authors and acknoledgement
- [Ambros Eberhard](https://github.com/ambros02)
- [Carlos Hernandez](https://github.com/KarlGrossGROSS)
- [Céline Mai Anh Ziegler](https://github.com/CelineZi)
- [Thi Tam Gian Nguyen](https://github.com/tamtam-27)
- [Marius Decurtins](https://github.com/MetaKnightEX)

We want to thank our teaching assistant [Marco Leder](https://github.com/marcoleder) for the support during the semester.

## Keybinds
(Marius)
## License
(Marius)
## Layout/Design
(Marius)