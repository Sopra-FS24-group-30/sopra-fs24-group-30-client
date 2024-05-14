import React, {useEffect, useState, useRef} from "react";
import {TransformWrapper, TransformComponent, useControls} from "react-zoom-pan-pinch";
import "styles/views/Board.scss";
import { useWebsocket } from "./Websockets";
import {Player} from "types";

import usablesData from "../../assets/data/usables.json"; //NOSONAR
import winConditionData from "../../assets/data/winconditions.json"; //NOSONAR
import ultimateData from "../../assets/data/ultimates.json"; //NOSONAR
import {joinVoice, leaveVoice, toggleChannel, setMuted, adjustVolume} from "../../helpers/agoraUtils.js"

Object.keys(winConditionData).forEach(key => {
    winConditionData[key]["Category"] = "WinCondition";
    winConditionData[key]["Type"] = "Win Condition";
});

Object.keys(ultimateData).forEach(key => {
    ultimateData[key]["Category"] = "Ultimate";
    ultimateData[key]["Type"] = "Ultimate Attack";
});

const map100to3 = (number) => {
    if (number<1){return 0}
    if (number<36){return 1}
    if (number<71){return 2}

    return 3
}

const allData={...usablesData, ...winConditionData, ...ultimateData};

const {ceil, floor, min, max, round} = Math; //NOSONAR this is way more convenient than having to remove min now and re-add it once it is actualy needed
const colours={"yellow": "#fff155", "green": "#82ff55", "blue": "#55d9ff", "red": "#ff555d", "pink": "#ff8db2", "orange": "#ff8701", "white": "#ffffff", "purple": "#9500e5"}
const cardColours={"Gold": ["#ffdd00", "#000"], "Silver": ["#898989", "#fff"], "Bronze": ["#e48518", "#fff"], "Ultimate": ["#b1001d", "#fff"], "WinCondition": ["#be8f3c", "#fff"]}

function itemsDictToList(obj: { [key: string]: number }): string[] {
    const result: string[] = [];
    Object.entries(obj).forEach(([key, count]) => {
        for (let i = 0; i < count; i++) {
            result.push(key);
        }
    });

    return result.slice(0, 15);
}

//#region 
const ScalableOverlay: React.FC<{
    x: number,
    y: number,
    size: number,
    alt: string,
    pathToPicture: string,
    className: string,
    rotation?: number,
    clickFunction?: () => void,
    colours?: [string, string]
}> = ({ x, y, size, alt, pathToPicture, className, rotation="", clickFunction= () => (console.log("clicked Thing")), colours=["", ""]}) => {

    function getPath(): string{
        try {
            return require(`../../assets/${pathToPicture}`)
        }
        catch{
            return "";
        }
    }

    const centering = parseFloat(size)/2;

    const image= getPath();

    return (<img  //NOSONAR
        src={image}
        style={{
            width: size,
            height: "auto", //position: absolute defined in Board.scss
            left: `${x}%`,
            bottom: `${y}%`,
            transform: `translate(-50%, 50%) translate(-${centering}px, ${centering}px) rotate(${rotation}deg)`,
            transformOrigin: "center center",
            filter: colours[0],
        }}
        onClick={clickFunction}
        className={className}
        onMouseEnter={e => e.currentTarget.style.filter = colours[1]}
        onMouseLeave={e => e.currentTarget.style.filter = colours[0]}
        onKeyPress={console.log("")}
        alt={alt}
    />
    );
}

const PlayerStatus: React.FC<{
    playerId: string;
    playerVolumes: Object;
    handleVolumeChange;
    playerMoney: string;
    playerColour: string;
    displayables: Array<string>;
    userName: string;
    active: boolean;
    audio: boolean;
}> = ({playerId, playerVolumes, handleVolumeChange, playerMoney, playerColour, displayables , userName, active, audio}) => {

    return (
        <div className="player-status-box" style={{height: audio ? "" : "27.5vh"}}>
            <div className="player-status-username-money-box">
                <div className="player-status-username">
                    <font color={colours[playerColour]}>{userName}</font>
                </div>
                <div className="player-status-money">
                    {playerMoney}
                </div>
                <div className="player-status-logo">
                    {active ? <img className="money-logo" src={require("../../assets/icons/money.gif")} alt="Money Icon"/> : <img className="money-logo-static" src={require("../../assets/icons/money.png")} alt="Money Icon"/>}
                </div>
            </div>
            {audio ? <div className="player-status-audio-box">
                <img
                    src={require(`../../assets/icons/speaker_${map100to3(playerVolumes[playerId])}.png`)}
                    alt={`speaker logo ${map100to3(playerVolumes[playerId])}/3`}
                    className="player-status-audio-logo"
                />
                <input 
                    style={{
                        background: `linear-gradient(to right, #0060df ${playerVolumes[playerId]}%, #e9e9ed ${playerVolumes[playerId]}%)`,
                        borderColor: `linear-gradient(to right, #2374ff ${playerVolumes[playerId]}%, #8f8f9d ${playerVolumes[playerId]}%)`
                    }}
                    className="player-status-audio-slider"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    name={playerId}
                    
                    value={playerVolumes[playerId]}
                    onChange={event => {
                        handleVolumeChange(event);
                    }}
                />
            </div>: ""}
            {displayables}
        </div>
    )
};
//#endregion

//are to be loaded from burger.json/be sent from the backend
const coordinates = {"1":[0.17012893982808, 0.440532417346501], "2":[0.641833810888252, 0.670244740231859], "3":[0.327722063037249, 0.504508372692143], "4":[0.600286532951289, 0.477458136539287], "5":[0.900787965616046, 0.613997423787033], "6":[0.322349570200573, 0.844568484328038], "7":[0.403295128939828, 0.293258909403177], "8":[0.333810888252149, 0.127093173035638], "9":[0.827722063037249, 0.772434521253757], "10":[0.876074498567335, 0.702018033490768], "11":[0.469914040114613, 0.850579647917561], "12":[0.893624641833811, 0.522971232288536], "13":[0.846704871060172, 0.440103048518678], "14":[0.790472779369627, 0.375268355517389], "15":[0.723853868194842, 0.321597252039502], "16":[0.660458452722063, 0.180334907685702], "17":[0.599212034383954, 0.133533705452984], "18":[0.413323782234957, 0.126234435379991], "19":[0.53474212034384, 0.851438385573207], "20":[0.285100286532951, 0.187634177758695], "21":[0.212392550143266, 0.20781451266638], "22":[0.169054441260745, 0.279089738085015], "23":[0.170845272206304, 0.36152855302705], "24":[0.192335243553009, 0.797337913267497], "25":[0.170487106017192, 0.522971232288536], "26":[0.169770773638968, 0.605839416058394], "27":[0.242836676217765, 0.693430656934307], "28":[0.26432664756447, 0.62043795620438], "29":[0.398638968481375, 0.585659081150708], "30":[0.459169054441261, 0.612709317303564], "31":[0.434813753581662, 0.67582653499356], "32":[0.421919770773639, 0.782739373121511], "33":[0.709885386819484, 0.741949334478317], "34":[0.253939828080229, 0.848003434950623], "35":[0.573424068767908, 0.670244740231859], "36":[0.507879656160459, 0.677114641477029], "37":[0.744985673352435, 0.581365392872477], "38":[0.727793696275072, 0.500644053241735], "39":[0.726361031518625, 0.407471017604122], "40":[0.613538681948424, 0.285959639330185], "41":[0.549426934097421, 0.321167883211679], "42":[0.492836676217765, 0.367969085444397], "43":[0.456661891117478, 0.433233147273508], "44":[0.543696275071633, 0.507943323314727], "45":[0.38932664756447, 0.8475740661228], "46":[0.660458452722063, 0.431515671962216], "47":[0.76432664756447, 0.826534993559468], "48":[0.338825214899713, 0.418205238299699], "49":[0.352793696275072, 0.337054529841133], "50":[0.314469914040115, 0.259768140832975], "51":[0.484598853868195, 0.210390725633319], "52":[0.612464183381089, 0.84070416487763], "53":[0.0744985673352436, 0.512666380420782], "54":[0.819842406876791, 0.612279948475741], "55":[0.427292263610315, 0.728209531987978], "56":[0.443409742120344, 0.251610133104337], "57":[0.175143266475645, 0.709317303563761], "58":[0.686962750716332, 0.837269214255045], "59":[0.726570200573066, 0.673380420781451], "60":[0.691618911174785, 0.249033920137398], "61":[0.51432664756447, 0.137398024903392], "62":[0.325573065902579, 0.588235294117647], "63":[0.453080229226361, 0.519106912838128]}
const allUsables=new Set<string>(["MagicMushroom", "TwoMushrooms", "TheBrotherAndCo", "PeaceImOut", "IceCreamChest", "WhatsThis", "SuperMagicMushroom", "Stick", "ImOut", "TreasureChest", "MeowYou", "XboxController", "BadWifi", "UltraMagicMushroom", "BestTradeDeal", "ItemsAreBelongToMe", "Confusion", "GoldenSnitch", "OnlyFansSub", "ChickyNuggie", "B14", "B26", "B35", "B135", "B246", "B123", "B456", "B07", "S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "G13", "G26", "G45", "G04", "G37", "G1256"])
const overSpaces=new Set<string>(["Junction", "Gate", "SpecialItem", "Goal"])

//! only used for development purposes, to be removed in production build
//#region 
const numberOfCoordinates=Object.keys(coordinates).length;
const allItems=new Set<string>(["MagicMushroom", "TwoMushrooms", "TheBrotherAndCo", "PeaceImOut", "IceCreamChest", "WhatsThis", "SuperMagicMushroom", "Stick", "ImOut", "TreasureChest", "MeowYou", "XboxController", "BadWifi", "UltraMagicMushroom", "BestTradeDeal", "ItemsAreBelongToMe", "Confusion", "GoldenSnitch", "OnlyFansSub", "ChickyNuggie"])
const allCards=new Set<string>(["B14", "B26", "B35", "B135", "B246", "B123", "B456", "B07", "S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "G13", "G26", "G45", "G04", "G37", "G1256"])

const datata1 = `[{"newActivePlayer":{"currentTurn":1,"activePlayer":"4"}}, {"move":{"1":{"spaces":[53],"moves":0,"spaceColour":null},"3":{"spaces":[53],"moves":0,"spaceColour":null},"2":{"spaces":[54],"moves":0,"spaceColour":null},"4":{"spaces":[54],"moves":0,"spaceColour":null},"movementType":"teleport"}}, {"money": {"1": {"newAmountOfMoney": 10, "changeAmountOfMoney": 0},"2": {"newAmountOfMoney": 10, "changeAmountOfMoney": 0},"3": {"newAmountOfMoney": 10, "changeAmountOfMoney": 0},"4":{"newAmountOfMoney": 10, "changeAmountOfMoney": 0}}},{"sleep": 2500},{"move":{"4":{"spaces":[37,38,39,15],"moves":4,"spaceColour":"Blue"},"movementType":"walk"}},{"money": {"4":{"newAmountOfMoney": 13,"changeAmountOfMoney":"3"}}},{"newActivePlayer":{"currentTurn":1,"activePlayer":"1"}}${"]"}`
const datata2 = `[{"move":{"1":{"spaces":[25,26,57],"moves":5,"spaceColour":"Blue"},"movementType":"walk"}},{"junction":{"playerId":"1","currentSpace":57,"nextUnlockedSpaces":[24,27],"nextLockedSpaces":[]}}${"]"}`;
const datata3 = `[{"move":{"1":{"spaces":[24,34,6],"moves":5,"spaceColour":"Blue"},"movementType":"walk"}}${"]"}`

const usablesExampleData1 = {
    "data" :{
        "1": {
            "usables": ["MagicMushroom"]
        },
        "2": {
            "usables": ["B14", "TwoMushrooms"]
        },
        "3": {
            "usables": []
        },
        "4": {
            "usables": ["MagicMushroom", "TwoMushrooms", "TheBrotherAndCo", "PeaceImOut", "IceCreamChest", "WhatsThis", "SuperMagicMushroom", "Stick"]
        },
    }
}

const moveDataExample2 = {
    "type": "move",
    "data": {
        "1": //playerId
            {
                "spaces": [30, 31, 55], //spaces, to which the player will move
                "moves": 5, //spaces left to move
                "endsWithOver": true //if the last space in "spaces": [] is an over space or not
            },
        "movementType": "walk" //type of movement effect ["simultaneous", "move", "teleport", etc…]
    }
}

const moveDataExample1 = {
    "type": "move",
    "data": {
        "1": //playerId
            {
                "spaces": [55], //spaces, to which the player will move
                "moves": 0, //spaces left to move
                "endsWithOver": false //if the last space in "spaces": [] is an over space or not
            },
        "2": //playerId
            {
                "spaces": [30], //spaces, to which the player will move
                "moves": 0, //spaces left to move
                "endsWithOver": false //if the last space in "spaces": [] is an over space or not
            },
        "movementType": "teleport" //type of movement effect ["simultaneous", "move", "teleport", etc…]
    }
}

const junctionDataExample1 = {
    "type": "junction",
    "data": {
        "playerId": 1, //the Player that needs to make the decision (may not be needed if it isn't broadcast to everyone)
        "currentSpace": 57, //spaceId of the junction
        "nextUnlockedSpaces": [24, 27], //spaceId of next Spaces (doesnt include)
        "nextLockedSpaces": [], //Space which is behind a Gate (3 or 44 if currentSpace is 62/63)
        "hasKey": false //True if the Player has "Brothers…" False otherwwise
    }
}

const junctionDataExample2 ={
    "type": "junction",
    "data": {
        "playerId": "1", //the Player that needs to make the decision (may not be needed if it isn't broadcast to everyone)
        "currentSpace": 63, //spaceId of the junction
        "nextUnlockedSpaces": [30], //spaceId of next Spaces (doesnt include)
        "nextLockedSpaces": [44], //Space which is behind a Gate (3 or 44 if currentSpace is 62/63)
        "hasKey": false //True if the Player has "Brothers…" False otherwwise
    }
}

const junctionDataExample3 = {
    "data": {
        "nextLockedSpaces":[3], 
        "nextUnlockedSpaces":[29],
        "playerId":1,
        "currentSpace":62
    }
}

const moneyDataExample1 = {
    "address": "/topic/board/money",
    "data": {
        "1": { //playerId
            "newAmountOfMoney": 999, //new amount of money for player 1
            "changeAmountOfMoney": 3 //amount of money
        }
        
    }
}

const moneyDataExample2 = {
    "address": "/topic/board/money",
    "data": {
        "1": { //playerId
            "newAmountOfMoney": 0, //new amount of money for player 1
            "changeAmountOfMoney": -3 //amount of money
        },
        "2": { //playerId
            "newAmountOfMoney": 0, //new amount of money for player 1
            "changeAmountOfMoney": -30 //amount of money
        },
        "3": { //playerId
            "newAmountOfMoney": 0, //new amount of money for player 1
            "changeAmountOfMoney": -300 //amount of money
        },
        "4": { //playerId
            "newAmountOfMoney": 0, //new amount of money for player 1
            "changeAmountOfMoney": -4 //amount of money
        }
    }
}

const winConditionDataExample1={
    "address": "/topic/board/winCondition",
    "data": {
        "name": "Golden",
        "progress": 3,
        "total": 7
    }
}

const endDataExample1={
    "data": {
        "winners":[1],
        "reason":[3, "jacksparrow"]
    }
}

const endDataExample2={
    "data": {
        "winners":[1, 3],
        "reason":[3, "maxmoney"]
    }
}

const endDataExample3={
    "data": {
        "winners":[2, 4],
        "reason":[2, "Golden"]
    }
}

const endDataExample4={
    "data": {
        "winners":[2, 3, 4],
        "reason":[4, "Company"]
    }
}

const endDataExample5={
    "data": {
        "winners":[1, 3, 4],
        "reason":[3, "Marooned"]
    }
}

const turnDataExample={
    "address": "/topic/board/newActivePlayer",
    "data": {
        "currentTurn": 10, //current turn number
        "activePlayer": "1" //playerId
    }
}

const goalDataExample={
    "address": "/topic/board/goal",
    "data": {
        "result": 5
    }
}
//#endregion

const Board = () => { //NOSONAR
    const {client , sendMessage, isConnected, disconnect} = useWebsocket();
    const hoverFilter="invert(54%) sepia(82%) saturate(1944%) hue-rotate(80deg) brightness(114%) contrast(126%)";
    const unlockedFilter="invert(14%) sepia(83%) saturate(7026%) hue-rotate(359deg) brightness(99%) contrast(109%)";
    const lockedFilter="invert(53%) sepia(8%) saturate(15%) hue-rotate(358deg) brightness(92%) contrast(92%)";
    
    //! Audio
    const [playerVolumes,setPlayerVolumes] = useState({"1":100,"2":100,"3":100,"4":100});
    const [inTeam, setInTeam] = useState(false);
    const [mute,setMute] = useState(false);
    
    const [imageId, setImageId]=useState("0"); //which goal state is used
    const [overlayActive, setOverlayActive]=useState(0);
    const [figurineSize, setFigurineSize]=useState("20px"); //actual size in pixels; starting value isn't seen under normal circumstances
    const [arrowSize, setArrowSize]=useState("20px"); //actual size in pixels; starting value isn't seen under normal circumstances
    const relativeFigurineSize=.025 //figurine width in % of boardwidth
    const relativeArrowSize=.035 //arrow width in % of boardwidth
    
    type UsableState = {[playerId: string]: {[itemName: string]: number}};
    const initialUsables = Object.fromEntries(Array.from(allUsables).map(usable => [usable, 0]));
    const [playerUsables, setPlayerUsables]=useState<UsableState>({"1": initialUsables, "2": initialUsables, "3": initialUsables, "4": initialUsables})
    const [playerSpace, setPlayerSpace]=useState({"1": 53, "2": 54, "3": 53, "4": 54});
    const [playerMoney, setPlayerMoney]=useState({"1": 10, "2": 10, "3": 10, "4": 10});
    const [turnOrder, setTurnOrder]=useState(["1", "3", "2", "4"])
    const [winConditionProgress, setWinConditionProgress]=useState([3, 4]) // represents a fraction
    const [currWinCondition, setCurrWinCondition]=useState("JackSparrow")
    const [ultimate, setUltimate]=useState("Nothing")
    const [usedUltimate, setUsedUltimate]=useState(false) //NOSONAR
    const [turnNumber, setTurnNumber]=useState(0);
    const [activePlayer, setActivePlayer]=useState("0");
    const [dice, setDice]=useState(0); //NOSONAR
    const [playerColour, setPlayerColour]=useState({"1":"yellow", "2":"green", "3":"blue", "4":"red"})
    const [displayPlayerIds, setDisplayPlayerIds]=useState(["1", "3", "2", "4"]) //This Player, Teammate, Enemy, Enemy
    const [userNames, setUserNames]=useState({"1": "Player 1", "2": "Player 2", "3": "Player 3", "4": "Player 4"}) //NOSONAR
    
    const [arrowPositions, setArrowPositions]=useState(null) //null if there are no arrows, otherwise [[from, to, locked?]]
    const [previewImage, setPreviewImage]=useState("")
    const [usingRetro, setUsingRetro]=useState(false)
    
    const gameId = localStorage.getItem("gameId");
    const boardRef=useRef(null);
    const figurineGlobalOffset=[-1.3, -2.05-.1*usingRetro] //offset to center figurines on the spaces
    const arrowGlobalOffset=[1.9, 2.1] //offset to correct arrow positioning
    const multipleFigurinesDisplacement = {"1":[[0, 0]], "2":[[-1.3, 0], [1.3, 0]], "3": [[-1.8, .3], [1.8, .3], [0, -.55]], "4": [[0, 1.8], [1.8, 0], [-1.8, 0], [0, -1.8]]} //displacement in board width percentage when multiple players are on one space
    const [players, setPlayers] = useState<Player[]>(null);

    //~ interpretation of websocket messages
    //#region 
    const move = (data) => {
        let toRead=structuredClone(data)
        if (toRead["movementType"] === undefined) {

            return Promise.resolve();; //in case BE sends an empty array
        }
        const movingType=toRead["movementType"];
        delete toRead["movementType"];

        return new Promise(async (resolve, reject) => { //NOSONAR
            try {
                switch (movingType) {
                case "walk":
                case "jump":
                
                    for (const [playerID, val] of Object.entries(toRead)) {
                        for (const space of val["spaces"]) {
                            setPlayerSpace(prevState => ({
                                ...prevState,
                                [playerID]: space
                            }));
                            await sleep(300);
                        }
                    }
                    resolve(null); 
                    break;
                case "simultaneous":
                case "tp":
                case "teleport":
                    for (const [playerID, val] of Object.entries(toRead)) {
                        let space = val["spaces"][val["spaces"].length - 1];
                        setPlayerSpace(prevState => ({
                            ...prevState,
                            [playerID]: space
                        }));
                    }
                    resolve(null)
                    break;
                default:
                    throw new Error("notImplemented");
                }
            } catch (error) {
                reject(error); // Reject the promise on errors
            }
        });
    };

    const gameEnd = (data) => {
        const reason=data["reason"]
        const winners=data["winners"]
        let foreignJack=""
        if (winners.length === 3) {
            if (winners.includes(1) && winners.includes(3)) {
                foreignJack = winners.filter(winner => winner !== 1 && winner !== 3).toString();
            } else {
                foreignJack = winners.filter(winner => winner !== 2 && winner !== 4).toString();
            }
        }
        let jackText=`${ foreignJack!== "" ? ` and ${userNames[foreignJack]} had «${allData["JackSparrow"]["DisplayName"]}»` : ""}`
        const who=reason[0].toString() //who is responsable
        const why=reason[1].toString() //which wincondition/reason lead to winning
        let msg=""
        let players=[]
        for (const player of winners){
            players.push(userNames[player], "and")
        }
        players=players.slice(0, players.length-1)
        const playerStrings=players.join(" ")
        switch (why.toLowerCase()) {
        case "jacksparrow":
            msg=`${playerStrings} won because ${userNames[who]} had the Win Condition «${allData["JackSparrow"]["DisplayName"]}» and 20 Turns have passed.`
            break;
        case "maxmoney":
        case "maxcash":
            msg=`${playerStrings} won because ${userNames[who]} had the highest amount of Coins after 20 Turns.`
            break;
        default: 
            msg=`${playerStrings} won because ${userNames[who]} passed the goal while having fulfilled the Win Condition «${allData[why]["DisplayName"]}»${jackText}.`
        }
        alert(msg)
        //TODO set winstate with pretty popup msg

    };

    const junction = (data) => {
        const from=data["currentSpace"];
        const unlocked=data["nextUnlockedSpaces"];
        const locked=data["nextLockedSpaces"];

        let res:[string, string, number][]=[]
        unlocked.forEach(to => {
            res.push([from, to, 0]);
        });
        locked.forEach(to => {
            res.push([from, to, 1]);
        });
        setArrowPositions(res)

        return null
    }

    const money = (data) => {
        const updates = Object.entries(data).reduce((acc, [playerId, details]) => {
            acc[playerId] = details["newAmountOfMoney"];

            return acc;
        }, {});
      
        setPlayerMoney(prevMoney => ({
            ...prevMoney,
            ...updates
        }));
    }

    const goal = (data) => {
        let res=data["result"]
        setImageId(res)
    }   
    
    const newActivePlayer = (data) => {
        setTurnNumber(data["currentTurn"]);
        setActivePlayer(data["activePlayer"])
    }

    const winCondition = (data) => {
        setCurrWinCondition(data["name"])
        setWinConditionProgress([data["progress"], data["total"]])
    }

    const usables = (data) => {
        let res = playerUsables;
        for (const player in data) {
            for (const item in res[player]) {
                
                let numberOfNew=data[player]["usables"].filter((i: string) => i === item).length
                let numberOfOld=res[player][item]
                
                if (numberOfOld !== numberOfNew){
                    let dif = numberOfNew-numberOfOld
                    if (dif>=1){
                        for (let i=0; i<dif; i++){
                            addUsable(player, item)
                        }
                    }
                    else if (dif<=-1){
                        for (let i=0; i>dif; i--){
                            removeUsable(player, item)
                        }
                    }
                }
            }
        }
    }

    //^ response to Websockets

    const sendArrowChoice = (choice) => {
        setArrowPositions(null);
        sendMessage(`/board/junction/${gameId}`, JSON.stringify({"selectedSpace": choice}))
    }
    
    const sendDice = () => {
        sendMessage(`/board/dice/${gameId}`, JSON.stringify({}))
    }

    const sendUsable = (usable) => {
        let address=""
        switch (allData[usable]["Type"]){
        case "Card":
            address=`/board/cards/${gameId}`
            break;
        case "Item":
            address=`/board/items/${gameId}`
            break;
        case "Ultimate":
            address=`/board/ultimate/${gameId}`
            break;
        }
        switch (allData[usable]["choice"]){
        //TODO
        }
        sendMessage(address, JSON.stringify({"used": usable}))
    }

    async function processCommands(datata) {
        const exampleFunctions: { [key: string]: (arg: any) => void } = {
            move, //NOSONAR
            junction,
            goal,
            newActivePlayer,
            money,
            sleep //NOSONAR
        };
      
        const commands = JSON.parse(datata);
      
        for (const commandObject of commands) {

            const commandName = Object.keys(commandObject)[0];
            const commandData = commandObject[commandName];
            const func = exampleFunctions[commandName];

            if (typeof func === "function") {
                await func(commandData); //NOSONAR
            }
        
        }
    }
    //#endregion

    //$ websockets
    useEffect(() => {
        if (client && isConnected){
            const subscriptionStart = client.subscribe(`/topic/game/${gameId}/board/start`, (message)=>{
                const data = JSON.parse(message.body);
                setPlayers(data.players);
                localStorage.setItem("players", players);
                console.log(players);
            })
            const subscrpitionGoal = client.subscribe("/topic/board/goal", (message) => {
                const data = JSON.parse(message.body);
                goal(data)
            });

            const subsriptionJunction = client.subscribe(`/topic/board/junction/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                junction(data)
            });

            const subsriptionUsables = client.subscribe(`/topic/board/usables/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                usables(data)
            });

            const subscriptionMove = client.subscribe(`/topic/board/move/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                move(data)
            });

            const subscriptionMoney = client.subscribe(`/topic/board/money/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                money(data)
            });

            const subscriptionActivePlayer = client.subscribe(`/topic/board/newActivePlayer/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                money(data)
            });

            const subscriptionGameEnd = client.subscribe(`/topic/board/gameEnd/${gameId}`, (message) => {
                const data = JSON.parse(message.body);
                gameEnd(data)
            });

            return () => {
                subscriptionStart.unsubscribe();
                subscrpitionGoal.unsubscribe();
                subsriptionJunction.unsubscribe();
                subsriptionUsables.unsubscribe();
                subscriptionMove.unsubscribe();
                subscriptionMoney.unsubscribe();
                subscriptionActivePlayer.unsubscribe();
                subscriptionGameEnd.unsubscribe();
            }
        }

        if(players === null){
            console.log("here");
            sendMessage(`/app/game/${gameId}/board/start`, {});
        }

    }, [client, isConnected, sendMessage, disconnect, players])

    //! Audio  
    //#region
    
    const handleVolumeChange = (event) => {
        let {name,value} = event.target;
        setPlayerVolumes(
            {
                ...playerVolumes,
                [name]:value
            }
        )
        //TODO: add ids here
        let userUid = Number(localStorage.getItem("gameId") + name)
        adjustVolume(userUid,value);
        console.log("adjusted volume to: " + value);
        console.log("gameId" + localStorage.getItem("gameId"));
        console.log("name" + name);
        console.log("adjusted for " + userUid);
    }

    const toggleVoice = (event, teamColor) => {
        if(inTeam){
            toggleChannel(inTeam,teamColor);
            setInTeam(false)
        }else{
            toggleChannel(inTeam,teamColor);
            setInTeam(true);
        }
    }

    const handleMute = () => {
        setMute(!mute);
        setMuted(mute);
    }

    const getTeam = () => {
        return Number(localStorage.getItem("playerId"))%2 === 0 ? "even" : "odd";
    }
    //#endregion

    //^ Helper functions
    //#region 

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const addUsable = (playerId: string, name: string) => {
        setPlayerUsables(prevUsables => ({
            ...prevUsables,
            [playerId]: {
                ...prevUsables[playerId],
                [name]: prevUsables[playerId][name] + 1
            }
        }));
    };

    const removeUsable = (playerId: string, name: string) => {
        setPlayerUsables(prevUsable => ({
            ...prevUsable,
            [playerId]: {
                ...prevUsable[playerId],
                [name]: max(prevUsable[playerId][name] -1, 0)
            }
        }));
    };

    const getCoord = (id:number, coordinate:string):number => {

        const thisSpace=playerSpace[id]
        let numberOfPlayersOnSpace=0
        let playersOnSpace: number[]=[]

        Object.entries(playerSpace).forEach(([key, val]) => {
            if(Number(val)===Number(thisSpace)){
                numberOfPlayersOnSpace++;
                playersOnSpace.push(Number(key))
            }
        });
        playersOnSpace.sort() //NOSONAR maybe not needed if typescript dicts are ordererd

        const displacementPriority=playersOnSpace.findIndex(elements => elements === id);
        const displacementCoordinates = multipleFigurinesDisplacement[numberOfPlayersOnSpace][displacementPriority]
        
        switch (coordinate.toLowerCase()){
        case "0":
        case "x":
            var coord=0 //NOSONAR
            break;
        case "1":
        case "y":
            var coord=1 //NOSONAR
            break;
        default:
            throw new Error("Invalid coordinate");
        }
        
        return (coordinates[playerSpace[id]][coord]*100)+figurineGlobalOffset[coord]+displacementCoordinates[coord];
    }

    const calculateArrowPosition = (junction: number, space: number): [number, number, number] => {
        let from=coordinates[junction.toString()];
        let to=coordinates[space.toString()];

        let ratio=.61

        const x = (from[0]*(1-ratio)+to[0]*ratio)
        const y = (from[1]*(1-ratio)+to[1]*ratio)
        const deltaX = (to[0])-( from[0])
        const deltaY = (to[1])-( from[1])
        const rot = (Math.atan2(deltaX, deltaY) * (180 / Math.PI));
    
        return [x+arrowGlobalOffset[0]/100, y+arrowGlobalOffset[1]/100, rot];
    }
    //#endregion

    //$ UseEffects

    const KeyboardControls = () => { //NOSONAR
        const { zoomIn, zoomOut, resetTransform } = useControls();
    
        useEffect(() => { //NOSONAR
            const keyDownEvent = (event) => {
                let r=function(){return floor(Math.random()*(numberOfCoordinates-1)+1)} //NOSONAR
                const getRandomItemFromSet = (set: Set<string>) => { //NOSONAR
                    const arrayFromSet = Array.from(set);
                    const randomIndex = floor(Math.random()*arrayFromSet.length); //NOSONAR

                    return arrayFromSet[randomIndex];
                };
                const getRandomKey = (dict: { [key: string]: any }): string | undefined => {
                    const keys = Object.keys(dict);
                    
                    return keys[floor(Math.random()*keys.length)];
                }
                switch (event.key){ //NOSONAR
                case "r":
                    resetTransform();
                    break;
                case "x":
                    setDisplayPlayerIds([displayPlayerIds[0], displayPlayerIds[2], displayPlayerIds[1], displayPlayerIds[3]])
                    break;
                case "m":
                    handleMute();
                    break;
                case ".":
                    zoomOut();
                    break;
                case ",":
                    zoomIn();
                    break;
                case "Enter":
                    setOverlayActive(1-overlayActive);
                    break;
                case "Escape":
                    setOverlayActive(0);
                    break;
                case "$":
                    setUsingRetro(1-usingRetro);
                    break;
                    //~ ↓ debug options, will be removed in the production build
                case "y":
                    usables(usablesExampleData1["data"])
                    break;
                case "~":
                    processCommands(datata1)
                    break;
                case "n":
                    setDisplayPlayerIds([displayPlayerIds[3], displayPlayerIds[0], displayPlayerIds[1], displayPlayerIds[2]])
                    break;
                case "ö":
                    setDice(3);
                    break;
                case "m":
                    money(moneyDataExample1["data"]);
                    break;
                case "p":
                    winCondition(winConditionDataExample1["data"])
                    break;
                case "P":
                    setWinConditionProgress([min(max(winConditionProgress[0]-1, 0), 2), 3])
                    break;
                case "¶":
                    newActivePlayer(turnDataExample["data"]);
                    break;
                case "g":
                    goal(goalDataExample["data"]);
                    break;
                case "M":
                    money(moneyDataExample2["data"]);
                    break;
                case "t":
                    (junction(junctionDataExample3["data"]));
                    break;
                case "T":
                    (junction(junctionDataExample2["data"]));
                    break;
                case "k":
                    (setArrowPositions(null));
                    break;
                case "d":
                    (move(moveDataExample2["data"]));
                    break;
                case "j":
                    (move(moveDataExample1["data"]));
                    break;
                case "h":
                    (gameEnd(endDataExample1["data"]));
                    (gameEnd(endDataExample2["data"]));
                    (gameEnd(endDataExample3["data"]));
                    (gameEnd(endDataExample4["data"]));
                    (gameEnd(endDataExample5["data"]));
                    break;
                case "ü":
                    addUsable("2", getRandomItemFromSet(allCards))
                    break;
                case "9":
                    addUsable("1", getRandomItemFromSet(allCards))
                    addUsable("3", getRandomItemFromSet(allCards))
                    addUsable("4", getRandomItemFromSet(allCards))
                    break;
                case ")":
                    addUsable("1", getRandomItemFromSet(allItems))
                    addUsable("3", getRandomItemFromSet(allItems))
                    addUsable("4", getRandomItemFromSet(allItems))
                    break;
                case "è":
                    addUsable("2", getRandomItemFromSet(allItems))
                    break;
                case "[":
                    setPlayerUsables({...playerUsables, "2": initialUsables})
                    break;
                case "£":
                    setTurnOrder([turnOrder[1], turnOrder[2], turnOrder[3], turnOrder[0]])
                    break;
                case "J":
                    let choice=4
                    alert(JSON.stringify({"choice": choice}))
                case "i":
                    setCurrWinCondition(getRandomKey(winConditionData))
                    break;
                case "I":
                    setUltimate(getRandomKey(ultimateData))
                    break;
                case "q":
                    setPlayerSpace({"1":(playerSpace["1"]%numberOfCoordinates)+1, "2":(playerSpace["2"]%numberOfCoordinates)+1, "3":(playerSpace["3"]%numberOfCoordinates)+1, "4":(playerSpace["4"]%numberOfCoordinates)+1})
                    break;
                case "w":
                    setPlayerSpace({...playerSpace, "4":(playerSpace["4"]%numberOfCoordinates)+1})
                    break;
                case "W":
                    setPlayerSpace({...playerSpace, "4":max((playerSpace["4"]%numberOfCoordinates)-1, 1)})
                    break;
                case "s":
                    setPlayerSpace({"1":[54], "2":[53], "3":[53], "4":[54]})
                    break;
                case "e":
                    let rand=r() //NOSONAR
                    setPlayerSpace({"1":[rand], "2":[rand], "3":[rand], "4":[rand]})
                    break;
                case "z":
                    setPlayerSpace({"1":[r()], "2":[r()], "3":[r()], "4":[r()]})
                    break;
                case "c":
                    setPlayerColour({"1": playerColour["2"], "2": playerColour["3"], "3": playerColour["4"], "4": playerColour["1"]})
                    break;
                case "C":
                    setPlayerColour({"1":"orange", "2":"purple", "3":"pink", "4":"white"})
                    break;
                case "©":
                    setPlayerColour({"1":"yellow", "2":"green", "3":"blue", "4":"red"})
                    break;
                default:

                    if (["1", "2", "3", "4", "5", "6", "7", "8", "0"].includes(event.key))
                        setImageId(event.key);
                }
            };
    
            window.addEventListener("keydown", keyDownEvent);
    
            return () => {
                window.removeEventListener("keydown", keyDownEvent);
            };
        }, []);
    
        return null;
    };

    const adjustFigurineSize = () => {
        const boardWidth =boardRef.current.offsetWidth;
        const figurineSize = boardWidth*relativeFigurineSize;
        const arrowSize = boardWidth*relativeArrowSize;
        setFigurineSize(`${figurineSize}px`);
        setArrowSize(`${arrowSize}px`);
    };

    useEffect(() => {
        joinVoice("main");
        localStorage.setItem("gameId", "0");
        window.addEventListener("load", adjustFigurineSize);
        window.addEventListener("resize", adjustFigurineSize);
        document.body.classList.add("scrollbar-removal");

        return () => {
            leaveVoice();
            window.removeEventListener("load", adjustFigurineSize);
            window.removeEventListener("resize", adjustFigurineSize);
            document.body.classList.remove("scrollbar-removal")
        }
    }, []);

    // Scalable Objects
    let figurines = (
        <div className="scalable-overlay">
            {[1, 2, 3, 4].map(id => (
                <ScalableOverlay
                    key={id} //used to iterate
                    x={getCoord(id, "x")}
                    y={getCoord(id, "y")}
                    size={figurineSize}
                    alt={`${playerColour[id]} figurine`}
                    pathToPicture={`figurines/${playerColour[id]}.png`}
                    className="figurine-picture"
                />))}
        </div>
    );

    let arrows = (
        <div className="scalable-overlay">
            {arrowPositions!==null ?
                arrowPositions.map(id => (
                    <ScalableOverlay
                        key={id} //used to iterate
                        x={calculateArrowPosition(id[0], id[1])[0]*100}
                        y={calculateArrowPosition(id[0], id[1])[1]*100}
                        rotation={calculateArrowPosition(id[0], id[1])[2]}
                        size={arrowSize}
                        alt="arrow"
                        pathToPicture={"figurines/arrow.svg"}
                        className="arrow-picture"
                        clickFunction= {() => sendArrowChoice(id[1])}
                        colours={[id[2]===1 ? lockedFilter : unlockedFilter, hoverFilter]}
                    />))
                : ""}
        </div>
    )

    let orderBox =  (
        <div className="turn-order-box">
            {turnOrder.map((id, index) => (
                <React.Fragment key={id}>
                    <div className="turn-order-circle" style={{ backgroundColor: colours[playerColour[id]] }}></div>
                    {index<turnOrder.length-1 ? <div className="turn-order-arrow"/> : ""}
                </React.Fragment>
            ))
            // insert active player circle if needed (moving coin already indicates active player)
            }
        </div>
    )

    const playerElement = (playerId) => {
        const active = playerId===displayPlayerIds[0]

        return (
            <PlayerStatus   
                userName={userNames[playerId]}
                handleVolumeChange={handleVolumeChange}
                playerColour={playerColour[playerId]}
                displayables={enumerateUsables(itemsDictToList(playerUsables[playerId]), active)}
                playerMoney={playerMoney[playerId]}
                active={activePlayer===playerId}
                audio={!active}
                playerVolumes={playerVolumes}
                playerId={playerId}
            />)
    }

    const pixelItems=new Set<string>(["MagicMushroom", "UltraMagicMushroom", "SuperMagicMushroom", "Tp"])

    const singleUsable = (name: string, active: boolean) => { 
        if (name===""){
            return  <img src={require("../../assets/usables/placeholder.png")} alt={""}/> 
        }

        return(
            <span style={{imageRendering: pixelItems.has(name) ? "pixelated" : "inherit", cursor: active ? "pointer" : "inherit"}}> {/**breaks when having 10 or more pixelated items */}
                <img //NOSONAR
                    src={require(`../../assets/usables/${name}.png`)}
                    alt={usablesData[name]["DisplayName"]}
                    className="item-picture"
                    onMouseEnter={() => setPreviewImage(name)}
                    onMouseLeave={() => setPreviewImage("")}
                    onClick={() => sendUsable(name)}
                />
            </span>
        )
    }

    const enumerateUsables = (usables: Array<string>, active) => {
        
        if (Math.random()===-1){ //NOSONAR sonar hates fun
            //formats usables in a prettier grid
            let len=usables.length
            let magicNumber=max(ceil(len/2), 2)
            usables=[...usables.slice(0, magicNumber), ...Array(max(5-magicNumber, 0)).fill(""), ...usables.slice(magicNumber)]
        }
        
        return(
            <div className="item-container">
                {usables.map(usable => singleUsable(usable, active))}
            </div>
        )
    }

    let previewImageHTML = (previewImage!=="" ?
        <div className="preview-box" style={{color: cardColours[allData[previewImage]["Category"]][1], backgroundColor: cardColours[allData[previewImage]["Category"]][0]}}>
            <div className="preview-name-class-box">
                <div>{allData[previewImage]["Type"]}</div>
                <b><div>{allData[previewImage]["DisplayName"]}</div></b>
            </div>
            
            <div className="preview-picture-text-box">
                <img
                    className="preview-picture"
                    src={require((`../../assets/usables/${previewImage}.png`))}
                    style={{imageRendering: pixelItems.has(previewImage) ? "pixelated" : "inherit"}}
                    alt={`${allData[previewImage]["DisplayName"]}`}
                />
                <div className="preview-text" dangerouslySetInnerHTML={{ __html: allData[previewImage]["Description"].replace(/\n/g, "<br />") }} />
            </div>
        </div>
        : "")
    
    return (
        <div>
            {/* Top UI doesn't work correctly, as it shrinks the main screen */}
            <div className="board-container">
                {previewImageHTML}
                <div className="player-status">
                    {playerElement(displayPlayerIds[2])} {/** not elegant, crashes otherwise */}
                    {playerElement(displayPlayerIds[3])}
                    {playerElement(displayPlayerIds[1])}
                </div>
                <TransformWrapper
                    disablePadding={true}
                    doubleClick={{mode:"toggle", step:1.3}}
                >
                    <KeyboardControls />
                    <TransformComponent>
                        <div ref={boardRef} className="board-overlay">
                            <img
                                src={require("../../assets/boards/overlay.png")}
                                className="board-background"
                                alt="Overlay"
                                style={{opacity: overlayActive}}
                            />
                        </div>
                        {arrows}
                        {figurines} {/* all 4 player figurines */}
                        <img
                            src={ require((`../../assets/boards/${usingRetro ? "retro_" : ""}board_${imageId}.png`))}
                            style={{imageRendering: usingRetro ? "pixelated" : "inherit"}}
                            className="board-background"
                            alt="Gameboard"
                        />
                    </TransformComponent>
                </TransformWrapper>
                <div className="player-status">
                    <div className="turn-count-order-box">
                        <div className="turn-order-text">
                            <b>Turn: {turnNumber}/20</b>
                        </div>
                        {orderBox}
                    </div>
                    <div className="ultimate-win-box">
                        <div className="win-condition-box"
                            onMouseEnter={() => setPreviewImage(currWinCondition)}
                            onMouseLeave={() => setPreviewImage("")}>
                            <div className="win-condition-chart" style={{backgroundImage: `conic-gradient(#0fdf0f ${winConditionProgress[0]/winConditionProgress[1]*100}%, #004f00 ${winConditionProgress[0]/winConditionProgress[1]*100}%)`}}/>
                            <div className="win-condition-name">
                                {winConditionData[currWinCondition]["DisplayName"]}
                            </div>
                            
                        </div>
                        <div className="ultimate-box"
                            onMouseEnter={() => setPreviewImage(ultimate)}
                            onMouseLeave={() => setPreviewImage("")}>
                            <div className="ultimate-name">
                                <i>{ultimateData[ultimate]["DisplayName"]}</i>
                            </div>
                        </div>
                    </div>
                    {playerElement(displayPlayerIds[0])}
                    <div className="player-status-controls">
                        <button
                            onClick={ () => sendDice()}
                            //TODO deactivate button after clicking once
                            disabled={activePlayer!==displayPlayerIds[0]}
                        >
                            Roll Dice
                        </button><br/>
                        {/* <button onClick={ () => alert("a")}>Use Item</button> */}
                        <button onClick={() => {joinVoice("main")}}>
                            joinVoice
                        </button>
                        <button onClick={() => {leaveVoice()}}>

                            leaveVoice
                        </button>
                        <button onClick={(event) => {toggleVoice(event,getTeam())}}>
                            {inTeam ? "teamVoice" : "globalVoice"}
                        </button>
                        <button onClick={() => {handleMute()}}>
                            {mute ? "mute" : "unmute"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Board