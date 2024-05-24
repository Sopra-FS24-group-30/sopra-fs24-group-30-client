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

This game is a board game based on the principles of the popular Nintendo game: Mario Party, except that everything can and will happen.
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

## Game Wiki

The aim of the Game is to either pass the Goal, while having fulfilled your Win Condition, or by having the highest amount of Coins by the End of 20 Turns. If one Person wins, their Teammate automatically wins aswell.

During a Players Turn there are 3 Phases.

1. (Optional) Playing an [Item](#items-phase-1) or using ones [Ultimate Attack](#ultimate-attack-phase-1).
2. Rolling the Dice or using a [Card](#cards-phase-2).
3. Movement Phase, where everything except for Junctions is done automatically for the Player.

### Win Conditions

Once you or your Teammate passes the Goal, while having fulfilled the condition, you win.<br>
If any Player has Jack Sparrow, CAPTAIN Jack Sparrow

| Win Ccndition Name | Condition |
|---|---|
| Golden is my … | Land on seven Yellow [Spaces](#spaces-phase-3). |
| 🛥️ ← this is a ship (it goes Zvvvvvvvvvvv or blubblub) | Move 15 [Spaces](#spaces-phase-3) in one turn, or move 0 [Spaces](#spaces-phase-3) twice in a row. |
| Explorer of the Seven seas | Pass every [Space](#spaces-phase-3) at least once. |
| Drunk | Land on a Catnami [Space](#spaces-phase-3) thrice. |
| Unlucky | Lose a total of 40 Coins. |
| East Indian Trading Company | As long as you have at least 60 Coins, the Win Condition is fulfilled. If you have less than 60 Coins at any point in time, your Wincondition is no longer fulfilled. |
| The Marooned | As long as you have exactly 0 Coins, 0 [Items](#items-phase-1) and 0 [Cards](#cards-phase-2) the Win Condition is fulfilled. If you gain any Coins, [Items](#items-phase-1) or [Cards](#cards-phase-2) at any point in time, your Win Condition is no longer fulfilled. |
| Jack Sparrow, CAPTAIN Jack Sparrow | You win if the other Team wins, and you lose if your Partner wins. If the game ends after 20 Turns, everyone except for your Partner loses. |
<!-- | Third time's the charm | Pass the goal twice | -->
<!-- | Ohh shiny | Use one Bronze, Silver and Gold [Item](#items-phase-1), and one Bronze, Silver and Gold [Card](#cards-phase-2). | -->

### Usables

Usables are stuff that the Players can use during their Turn, which may either benefit them, or hinder their opponents.<br>
Usables are split into 3 categorys. [Ultimate Attacks](#ultimate-attack-phase-1), [Items](#items-phase-1) and [Cards](#cards-phase-2).<br>
The [Ultimate Attack](#ultimate-attack-phase-1), or [Items](#items-phase-1) can be used exclusively in Phase 1, the [Cards](#cards-phase-2) in Phase 2.<br>
Using Usables is optional, Phase 1 can be skipped, and in Phase 2 a Dice can be rolled.<br>
Usables can be obtained by landing on special [Spaces](#spaces-phase-3), or stealing them from other Players.

#### Ultimate Attack (Phase 1)

Each Player has an [Ultimate Attack](#ultimate-attack-phase-1), which can be used once per Game, at the beginning of ones Turn, instead of using an [Item](#items-phase-1).<br>
The starting Player may not use their [Ultimate Attack](#ultimate-attack-phase-1) on their first Turn, in order to keep the game balancend.

| Ultimate Name | Effect |
|---|---|
| The Big Shuffle | The Win-Conditions of all Players get shuffled (It is possible to receive the one you originally had) |
| Pickpocket | Steal half of the Coins of all other players (including your teammate). |
| Fresh start :) | All other Players get teleported back to their starting [Space](#spaces-phase-3). |
| /tp | Move to a random [Space](#spaces-phase-3) on the board (fun). |
| Nothing (Maybe you should've taken another Card?) | Nothing happens (still prevents using an [Item](#items-phase-1)). |
<!-- | Chameleon | Use the effect of any [Item](#items-phase-1) in the game. | -->
<!-- | Stop? | The game terminates after 5 more turns. (Round Counter gets set to 15 after this turn ends) | -->

#### Items (Phase 1)

Each Player can use one [Item](#items-phase-1) per Turn.<br>
Just like [Items](#items-phase-1), [Cards](#cards-phase-2) are split into <span style="color:#ffe600">Gold</span>, <span style="color:#AAAAAA">Silver</span> and <span style="color:#d97504">Bronze</span> ones, which is an indication of its general power level, but is purely cosmetic.<br>
Some [Items](#items-phase-1) cause the Player to automatically skip the second Phase.

| Item Name | Effect | Notes |
|---|---|---|
| Magic Mushroom | This turn you roll 2 dice. If you roll doubles: +10 Coins. | Skips Phase 2. |
| The uncle of your sister's cousin, has a brother-in-law, who once worked at Facebook | Use this [Item](#items-phase-1) to enter a gate. This [Item](#items-phase-1) gets used automatically at a gate, if you choose to pass the gate. | Cannot be used during Phase 1. |
| Peace I'm out | Teleport to a random other player. | |
| Ice cream treasure chest  | Steal a random [Card](#cards-phase-2) from a player of your choosing. | |
| OwO what's this | You receive a random [Card](#cards-phase-2). | |
| Super Magic Mushroom | This turn you roll 3 dice. If you roll triplets: +30 Coins. | Skips Phase 2. |
| Treasure chest | Steal a random [Item](#items-phase-1) from a player of your choice. | |
| Meow you in particular | The goal moves to a different spot. | |
| Steering a submarine using an Xbox Controller | Every player (including yourself) loses 5 Coins. | |
| Ultra Magic Mushroom | This turn you roll 4 dice. If you roll quadruplets: +69 Coins. | Skips Phase 2. |
| Best Trade deal in the history of Trade deals maybe ever | Give another player of your choosing all of your [Cards](#cards-phase-2), and steal all of their [Items](#items-phase-1) in return. | |
| (Almost) all your Items are belong to mine | Steal 4 random [Items](#items-phase-1) from a player of your choice. | |
| Only-Fans Subscription | Steal 7 Coins from every other player (even your Teammate) | |
| Dino Chicky Nuggie | −20 Coins, your ultimate becomes usable again. | |
<!-- | Two (Regular) Mushrooms | This turn you move twice as many [Spaces](#spaces-phase-3). | -->
<!-- | Stick | If you pass a player this turn, steal 15 Coins from them. | -->
<!-- | Meow it I'm out | Switch places with a random other player. | -->
<!-- | Bad Wifi | Chose a player, they get muted for 1 turn (2 if it was your teammate) | -->
<!-- | I am confusion | This turn you move backwards instead of forwards. | -->
<!-- | Golden Snitch | A Player of your choice has to roll the Big Oops Roulette. +10 Coins if it was your teammate. | -->

#### Cards (Phase 2)

Instead of Rolling a Player may instead play a [Card](#cards-phase-2), and move a certain amount of [Spaces](#spaces-phase-3).<br>
Just like [Items](#items-phase-1), [Cards](#cards-phase-2) are split into <span style="color:#ffe600">Gold</span>, <span style="color:#AAAAAA">Silver</span> and <span style="color:#d97504">Bronze</span> ones.<br>

- <span style="color:#ffe600">Gold</span> [Cards](#cards-phase-2) allow you to choose one of several numbers and move that many [Spaces](#spaces-phase-3).  
- <span style="color:#AAAAAA">Silver</span> [Cards](#cards-phase-2) have a single number, and have you move that many [Spaces](#spaces-phase-3).
- <span style="color:#d97504">Bronze</span> [Cards](#cards-phase-2) have multiple numbers on them, and you randomly move as many [Spaces](#spaces-phase-3) as one of those numbers.  
  
The following [Cards](#cards-phase-2) exist for each category:

| Category | Cards |
|---|---|
| <span style="color:#ffe600">Gold</span> | 1/3, 2/6, 4/5, 0/4, 3/7, 1/2/5/6 |
| <span style="color:#AAAAAA">Silver</span> | 0, 1, 2, 3, 4, 5, 6, 7 |
| <span style="color:#d97504">Bronze</span> | 1/4, 2/6, 3/5, 1/3/5, 2/4/6, 1/2/3, 4/5/6, 0/7 |

### Spaces (Phase 3)

There are 8 different [Spaces](#spaces-phase-3), which trigger fun effects when landed upon.

| Space Name | Effect when landed upon |
|---|---|
| <span style="color:#10107b; background-color:#f2f2f2"> ◉ </span> Blue | Gain 4 Coins |
| <span style="color:#f70901; background-color:#f2f2f2"> ◉ </span> Small Oops | You or everyone loses 10 Coins, or you get teleported back to your starting [Space](#spaces-phase-3). |
| <span style="color:#fefffd; background-color:#0a0704"> ◉ </span> Big Oops | Communism, lose 69 Coins, or the positions of all Players get shuffled. |
| <span style="color:#529c31; background-color:#ecf6e9"> ◉ </span> Item | You receive a random [Item](#items-phase-1). |
| <span style="color:#529c31; background-color:#ffa5a4"> ◉ </span> Card | You receive a random [Card](#cards-phase-2). |
| <span style="color:#529c31; background-color:#eea805"> ◉ </span> Gambling | Randomly double or lose all of your Coins, [Items](#items-phase-1) or [Cards](#cards-phase-2). |
| <span style="color:#529c31; background-color:#0d12c1"> ◉ </span> Catnami | Gain 69 Coins or swap your Win Condition with that of another Player. |
| <span style="color:#fddc11; background-color:#59270e"> ◉ </span> Yellow | A fun effect happens, depending on which exact Yellow [Space](#spaces-phase-3) was landed upon. A detailed table is visible in [`infos.md`](Infos.md). |

There are 4 different walkover [Spaces](#spaces-phase-3), which trigger fun effects when walked over.

| Space Name | Effect when walked over. |
|---|---|
| <span style="color:#483115; background-color:#886732"> ▣ </span> Bridge | You receive a random [Item](#items-phase-1). |
| <span style="color:#b52910; background-color:#fecb67"> × </span> Goal | If your Win Condition is fulfilled, you win the game, otherwise you gain 15 Coins and the Goal moves to a different [Space](#spaces-phase-3). Covers a Blue [Space](#spaces-phase-3). |
| <span style="color:#d4750f; background-color:#7e4b0c"> ↔ </span> Junction | Chose the direction in which you want to move. |
| <span style="color:#b3adab; background-color:#7e4b0c"> ↔ </span> Gate | If you have a The uncle of your sister's cousin, has a brother-in-law, who once worked at Facebook, you may chose in which direction you want to move. If you chose the gated one, you will lose said [Item](#items-phase-1). |

### Keyboard Shortcuts

The following shortcuts are available on the Board.

| Key pressed | Effect |
|---|---|
| F1 | Shows a very helpful help message. |
| M | Mutes onself in the Voice Chat. |
| , | Zooms the board in. |
| . | Zooms the board out. |
| R | Resets the zoom level of the Board. |
| $ | Toggles the Board skin. |
| C | Changes the skins of the Players to the standard palette (<span style="color:#ff555d">Red</span>, <span style="color:#fff155">Yellow</span>, <span style="color:#82ff55">Green</span>, <span style="color:#55d9ff">Blue</span>) |
| Shift+C | Changes the skins of the Players to the alternative palette (<span style="color:#9500e5">Purple</span>, <span style="color:#ff8db2">Pink</span>, <span style="color:#ff8701">Orange</span>, <span style="color:#ffffff">White</span>) |
| X | Toggles the visibility of Status Messages (e.g. on which [Space](#spaces-phase-3) a Player landed). |
| Return | Toggles an Overlay, showing which way Players move. |
| Esc | Disables said Overlay. |

## Authors and Acknoledgement

- **[Céline Mai Anh Ziegler](https://github.com/CelineZi)**
- [Ambros Eberhard](https://github.com/ambros02)
- [Carlos Hernandez](https://github.com/KarlGrossGROSS)
- [Thi Tam Gian Nguyen](https://github.com/tamtam-27)
- [MetaKnightEX](https://github.com/MetaKnightEX)

We want to thank our teaching assistant [Marco Leder](https://github.com/marcoleder) for the support during the semester.

## License

The Code is licensed under the Apache 2.0 License.<br>
<!-- Insert Images © Client -->
