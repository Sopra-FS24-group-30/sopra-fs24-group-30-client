import React, {useEffect, useState, useRef} from "react";
import {TransformWrapper, TransformComponent, useControls} from "react-zoom-pan-pinch";
import "styles/views/Board.scss";
import { useWebsocket } from "./Websockets";
import Player from "models/Player";
import TurnOverlay from "../ui/TurnOverlay";

import usablesData from "../../assets/data/usables.json"; //NOSONAR
import winConditionData from "../../assets/data/winconditions.json"; //NOSONAR
import ultimateData from "../../assets/data/ultimates.json"; //NOSONAR
import {joinVoice, leaveVoice, toggleChannel, setMuted, adjustVolume} from "../../helpers/agoraUtils.js";
import {useNavigate} from "react-router-dom";
import { mapDataToPlayers } from "../../helpers/MapDataToPlayers";

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

const {ceil, floor, min, max, round, abs} = Math; //NOSONAR this is way more convenient than having to remove min now and re-add it once it is actualy needed
const colours={"yellow": "#fff155", "green": "#82ff55", "blue": "#55d9ff", "red": "#ff555d", "pink": "#ff8db2", "orange": "#ff8701", "white": "#ffffff", "purple": "#9500e5"}
const cardColours={"Gold": ["#ffdd00", "#000"], "Silver": ["#898989", "#fff"], "Bronze": ["#e48518", "#fff"], "Ultimate": ["#b1001d", "#fff"], "WinCondition": ["#be8f3c", "#fff"]}

const landOnMsg={"blue": " a blue Space", "yellow": " a yellow Space", "item": " an Item Space", "card": " a Card Space", "black": " a big oops Space", "red": " a small oops Space", "gambling": " a gambling Space", "catnami": " a Catnami Space, something fun might've happened."}

const lost="<font color=#de1313>lost</font>"
const gained="<font color=#18c92a>gained</font>"

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
                filter: colours[0]
            }}
            onClick={clickFunction}
            className={className}
            onMouseEnter={e => e.currentTarget.style.filter = colours[1]}
            onMouseLeave={e => e.currentTarget.style.filter = colours[0]}
            onKeyPress={""}
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
    isTeammate: boolean;
    isCurrentplayer:boolean;
}> = ({playerId, playerVolumes, handleVolumeChange, playerMoney, playerColour, displayables , userName, active, audio, isTeammate, isCurrentplayer}) => {

    const getBackgroundColor = () => {
        if(isCurrentplayer || isTeammate) return "rgba(200, 250, 150, 0.3333)";
    }

    return (
        <div className="player-status-box" style={{height: audio ? "" : "27.5vh", backgroundColor: getBackgroundColor()}}>
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
const coordinates = {"1": [0.17012893982808, 0.440532417346501], "2": [0.641833810888252, 0.670244740231859], "3": [0.327722063037249, 0.504508372692143], "4": [0.600286532951289, 0.477458136539287], "5": [0.900787965616046, 0.613997423787033], "6": [0.322349570200573, 0.844568484328038], "7": [0.403295128939828, 0.293258909403177], "8": [0.333810888252149, 0.127093173035638], "9": [0.827722063037249, 0.772434521253757], "10": [0.876074498567335, 0.702018033490768], "11": [0.469914040114613, 0.850579647917561], "12": [0.893624641833811, 0.522971232288536], "13": [0.846704871060172, 0.440103048518678], "14": [0.790472779369627, 0.375268355517389], "15": [0.723853868194842, 0.321597252039502], "16": [0.660458452722063, 0.180334907685702], "17": [0.599212034383954, 0.133533705452984], "18": [0.413323782234957, 0.126234435379991], "19":[0.53474212034384, 0.851438385573207], "20":[0.285100286532951, 0.187634177758695], "21":[0.212392550143266, 0.20781451266638], "22":[0.169054441260745, 0.279089738085015], "23":[0.170845272206304, 0.36152855302705], "24":[0.192335243553009, 0.797337913267497], "25":[0.170487106017192, 0.522971232288536], "26":[0.169770773638968, 0.605839416058394], "27":[0.242836676217765, 0.693430656934307], "28":[0.26432664756447, 0.62043795620438], "29":[0.398638968481375, 0.585659081150708], "30":[0.459169054441261, 0.612709317303564], "31":[0.434813753581662, 0.67582653499356], "32":[0.421919770773639, 0.782739373121511], "33":[0.709885386819484, 0.741949334478317], "34":[0.253939828080229, 0.848003434950623], "35":[0.573424068767908, 0.670244740231859], "36":[0.507879656160459, 0.677114641477029], "37":[0.744985673352435, 0.581365392872477], "38":[0.727793696275072, 0.500644053241735], "39":[0.726361031518625, 0.407471017604122], "40":[0.613538681948424, 0.285959639330185], "41":[0.549426934097421, 0.321167883211679], "42":[0.492836676217765, 0.367969085444397], "43":[0.456661891117478, 0.433233147273508], "44":[0.543696275071633, 0.507943323314727], "45":[0.38932664756447, 0.8475740661228], "46":[0.660458452722063, 0.431515671962216], "47":[0.76432664756447, 0.826534993559468], "48":[0.338825214899713, 0.418205238299699], "49":[0.352793696275072, 0.337054529841133], "50":[0.314469914040115, 0.259768140832975], "51":[0.484598853868195, 0.210390725633319], "52":[0.612464183381089, 0.84070416487763], "53":[0.0744985673352436, 0.512666380420782], "54":[0.819842406876791, 0.612279948475741], "55":[0.427292263610315, 0.728209531987978], "56":[0.443409742120344, 0.251610133104337], "57":[0.175143266475645, 0.709317303563761], "58":[0.686962750716332, 0.837269214255045], "59":[0.726570200573066, 0.673380420781451], "60":[0.691618911174785, 0.249033920137398], "61":[0.51432664756447, 0.137398024903392], "62":[0.325573065902579, 0.588235294117647], "63":[0.453080229226361, 0.519106912838128]}
const allUsables=new Set<string>(["MagicMushroom", "TwoMushrooms", "TheBrotherAndCo", "PeaceImOut", "IceCreamChest", "WhatsThis", "SuperMagicMushroom", "Stick", "ImOut", "TreasureChest", "MeowYou", "XboxController", "BadWifi", "UltraMagicMushroom", "BestTradeDeal", "ItemsAreBelongToMe", "Confusion", "GoldenSnitch", "OnlyFansSub", "ChickyNuggie", "B14", "B26", "B35", "B135", "B246", "B123", "B456", "B07", "S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "G13", "G26", "G45", "G04", "G37", "G1256"])
const overSpaces=new Set<string>(["junction", "gate", "specialitem", "goal", "bluegoal"])


const Board = () => { //NOSONAR
    const {client , sendMessage, isConnected, disconnect} = useWebsocket();
    const hoverFilter="invert(54%) sepia(82%) saturate(1944%) hue-rotate(80deg) brightness(114%) contrast(126%)";
    const unlockedFilter="invert(14%) sepia(83%) saturate(7026%) hue-rotate(359deg) brightness(99%) contrast(109%)";
    const lockedFilter="invert(54%) sepia(52%) saturate(2629%) hue-rotate(268deg) brightness(94%) contrast(98%)";
    const navigate = useNavigate();
    //! Audio
    const [playerVolumes,setPlayerVolumes] = useState({"1":100,"2":100,"3":100,"4":100});
    const [inTeam, setInTeam] = useState(false);
    const [mute,setMute] = useState(false);
    const [inVoice,setInVoice] = useState(false);

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
    const [playerMoney, setPlayerMoney]=useState({"1": 15, "2": 15, "3": 15, "4": 15});
    const [turnOrder, setTurnOrder]=useState(["1", "3", "2", "4"])
    const [winConditionProgress, setWinConditionProgress]=useState([3, 4]) // represents a fraction
    const [currWinCondition, setCurrWinCondition]=useState("JackSparrow")
    const [ultimateName, setUltimateName]=useState("Nothing")
    const [ultimateState, setUltimateState]=useState(true) //NOSONAR
    const [turnNumber, setTurnNumber]=useState(0);
    const [activeMessage, setActiveMessage]=useState<[string, string]>(["", ""]); //NOSONAR
    const [choiceMessage, setChoiceMessage]=useState(["", "", "", ""]); //NOSONAR
    const [activePlayer, setActivePlayer]=useState("0");
    const [haveMessages, setHaveMessages]=useState(true);
    const [playerColour, setPlayerColour]=useState({"1":"yellow", "2":"green", "3":"blue", "4":"red"})
    const [displayPlayerIds, setDisplayPlayerIds]=useState<string>(["1", "3", "2", "4"]) //This Player, Teammate, Enemy, Enemy
    const [userNames, setUserNames]=useState({"1": "Player 1", "2": "Player 2", "3": "Player 3", "4": "Player 4"}) //NOSONAR

    const [socketReady, setSocketReady] = useState(false);

    const [arrowPositions, setArrowPositions]=useState(null) //null if there are no arrows, otherwise [[from, to, locked?]]
    const [previewImage, setPreviewImage]=useState("")
    const [usingRetro, setUsingRetro]=useState(false)

    const boardRef=useRef(null);
    const figurineGlobalOffset=[-1.3, -2.05-.1*usingRetro] //offset to center figurines on the spaces
    const arrowGlobalOffset=[1.9, 2.1] //offset to correct arrow positioning
    const multipleFigurinesDisplacement = {"1":[[0, 0]], "2":[[-1.3, 0], [1.3, 0]], "3": [[-1.8, .3], [1.8, .3], [0, -.55]], "4": [[0, 1.8], [1.8, 0], [-1.8, 0], [0, -1.8]]} //displacement in board width percentage when multiple players are on one space
    const gameId = localStorage.getItem("gameId");
    const userId = localStorage.getItem("userId");
    const [allPlayers, setAllPlayers] = useState<[]>(null);
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [rollDiceIsDisabled, setRollDiceIsDisabled] = useState(true);
    const [usablesIsDisabled, setUsablesIsDisabled] = useState(true);
    const [subscriptions, setSubscriptions] = useState([]);

    const timerMsg = async (type, content, timeout=3000) => {
        if (content!=="")
            {
                try{
                    setActiveMessage([type, content])
                    await sleep(timeout)
                    setActiveMessage(["", ""])}
                catch {
                }
            }
    }

    //~ interpretation of websocket messages

    //#region

    const move = (data) => {
        let toRead=structuredClone(data)
        if (toRead["movementType"] === undefined) {

            return Promise.resolve(); //in case BE sends an empty array
        }
        const movingType=toRead["movementType"];
        delete toRead["movementType"];

        return new Promise(async (resolve, reject) => { //NOSONAR
            try {
                switch (movingType.toLowerCase()) {
                    case "walk":
                    case "jump":
                        for (const [playerId, val] of Object.entries(toRead)) {
                            for (const space of val["spaces"]) {
                                setPlayerSpace(prevState => ({
                                    ...prevState,
                                    [playerId]: space
                                }));
                                await sleep(300);
                            }
                            try{if (!(overSpaces.has(val["spaceColor"].toLowerCase()))) await timerMsg("Landed on Space", `${userNames[playerId]} landed on ${landOnMsg[val["spaceColor"].toLowerCase()]}.`, 1250)}
                            catch{}
                        }
                        resolve(null);
                        break;
                    case "simultaneous":
                    case "tp":
                    case "teleport":
                        var message="" //NOSONAR
                        for (const [playerId, val] of Object.entries(toRead)) {
                            message+=`${userNames[playerId]} teleported.\n`
                            let space = val["spaces"][val["spaces"].length - 1];
                            setPlayerSpace(prevState => ({
                                ...prevState,
                                [playerId]: space
                            }));
                        }
                        if(message!=="") await timerMsg("Teleportation", message, 3000)
                        resolve(null)
                        break;
                    case "start":
                        for (const [playerId, val] of Object.entries(toRead)) {
                            let space = val["spaces"][val["spaces"].length - 1];
                            setPlayerSpace(prevState => ({
                                ...prevState,
                                [playerId]: space
                            }));
                        }
                        resolve(null)
                        break;
                    default:
                        throw new Error("notImplemented");
                }
            } catch (error) {
                resolve(null); // Reject the promise on errors
            }
        });
    };

    const gameEnd = (data) => {
        if (data.status === "NOT_PLAYING"){
            subscriptions.forEach(sub => sub.unsubscribe());
            navigate(`/game/${gameId}/ranking`);
        }
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
        return new Promise(async (resolve, reject) => { //NOSONAR
        let deltas={"1": 0, "2":0, "3":0, "4":0}

        const updates = Object.entries(data).reduce((acc, [playerId, details]) => {
            acc[playerId] = details["newAmountOfMoney"];
            deltas[playerId]=details["changeAmountOfMoney"]

            return acc;
        }, {});

        setPlayerMoney(prevMoney => ({
            ...prevMoney,
            ...updates
        }));

        let message=""
        for (let playerId in deltas) {
            let delta = deltas[playerId];
            if(delta===0)continue;
            message+=`${userNames[playerId]} <b>${delta>0 ? gained : lost} ${abs(delta)}</b> Coins.\n`
        }
        if (message !== "") {
            try {
                await timerMsg("Change in Money", message, 3000);
                resolve(null);
            } catch (error) {
                resolve(null);
            }
        } else {
            resolve(null);
        }})
    }

    const goal = (data) => {
        let res=data["result"]
        setImageId(res)
        timerMsg("Goal", "The Goal moved to a different Position.", 2000)
    }

    const newActivePlayer = (data) => {
        if(data.activePlayer){
            setTurnNumber(data.currentTurn);
            setActivePlayer(data.activePlayer);
            setShowOverlay(true);
            if(data.activePlayer.toString() === localStorage.getItem("playerId")){
                setRollDiceIsDisabled(false);
                setUsablesIsDisabled(false);
            } else if(data.activePlayer.toString() !== localStorage.getItem("playerId")){
                setRollDiceIsDisabled(true);
                setUsablesIsDisabled(true);
            }
            setTimeout(() => {
                setShowOverlay(false);
            }, 3000);
        }
    }

    const winCondition = (data) => {
            setCurrWinCondition(data["name"])
            setWinConditionProgress([data["progress"], data["total"]])
    }
    
    const ultimate = (data) => { //NOSONAR
        setUltimateName(data["name"])
        setUltimateState(data["active"])
    }

    const usables = (dataa) => { //NOSONAR
        return new Promise(async (resolve, reject) => { //NOSONAR
        let data=structuredClone(dataa)
        let res = playerUsables;
        let deltas = {"1": [[], []], "2": [[], []], "3": [[], []], "4": [[], []]}
        for (const player in data) {
            //Combining items and cards into usables
            data[player]["combined"] = [...(Array.isArray(data[player]["items"]) ? data[player]["items"] : []), ...(Array.isArray(data[player]["cards"]) ? data[player]["cards"] : [])];
            for (const usable in res[player]) {

                let numberOfNew=data[player]["combined"].filter((i: string) => i === usable).length
                let numberOfOld=playerUsables[player][usable]
                let change=abs(numberOfNew-numberOfOld)

                setPlayerUsables(prevUsables => ({
                    ...prevUsables,
                    [player]: {
                        ...prevUsables[player],
                        [usable]: numberOfNew
                    }
                }));

                if (change<5){
                    for (let i=0; i<change; i++){
                            deltas[player][numberOfOld>numberOfNew ? 1 : 0].push(allData[usable].DisplayName)
                    }}

            }
        }
        let message=""
        for (const player in deltas){
            message+=deltas[player][0].length===0 ? "" : `<b>${userNames[player]} ${gained}:</b> ${deltas[player][0].join(", ")}.\n`
            message+=deltas[player][1].length===0 ? "" : `<b>${userNames[player]} ${lost}:</b> ${deltas[player][1].join(", ")}.\n`
        }
        if (message!=="") {
            try {
                await timerMsg("Change in Items and Cards", message, 3000);
                resolve(null);
            } catch (error) {
                resolve(null); 
            }
        } else {
            resolve(null);
        }
    })}

    const dice = (data) => {
        return new Promise(async (resolve, reject) => { //NOSONAR
        let numberOfDice=data.results.length
        if (numberOfDice===1){
            try {
                await timerMsg("Dice Roll", `Rolled a <b>${data.results.toString()}</b>.`, 2000);
                resolve(null);
            } catch (error) {
                resolve(null);
            }
        }
        else{
            var total = 0; //NOSONAR
            for (let num of data.results) {
                total += num;
            }
            try {
                await timerMsg("Dice Roll", `Rolled ${numberOfDice} dice (${data.results.join(", ")}) for a total of <b>${total}</b>.`, 3000);
                resolve(null);
            } catch (error) {
                resolve(null);
            }
        }
    })}

    //~ Queue

    type CommandFunction = (arg: any) => Promise<unknown>|void;

    interface queueFunction { //NOSONAR
        [key: string]: CommandFunction;
    }
    
    class CommandProcessor { //NOSONAR
        private commandQueue: Array<{ name: string; data: any }> = [];
        private processing: boolean = false;
        private exampleFunctions: queueFunction;
    
        constructor(exampleFunctions: queueFunction) {
            this.exampleFunctions = exampleFunctions; //NOSONAR
        }
    
        addToQueue(commandName: string, data: any) { //NOSONAR
            this.commandQueue.push({ name: commandName, data }); //NOSONAR
            this.processQueue(); // NOSONAR
        }
    
        // Main loop to process commands from the queue
        private async processQueue() { //NOSONAR
            if (this.processing) return; //NOSONAR
            this.processing = true; //NOSONAR
    
            while (this.commandQueue.length > 0) { //NOSONAR
                const { name, data } = this.commandQueue.shift()!; // NOSONAR Take the first command
                const func = this.exampleFunctions[name]; //NOSONAR
    
                if (typeof func === "function") {
                    await func(data);
                }
            }
    
            this.processing = false; //NOSONAR
        }
    }

    const functionsForQueue: queueFunction = {
        move,
        dice,
        junction,
        goal,
        newActivePlayer,
        money,
        usables,
        ultimate,
        winCondition,
    };

    
    //^ response to Websockets

    const sendArrowChoice = (choice) => {
        setArrowPositions(null);
        sendMessage(`/app/game/${gameId}/board/junction`, {choice})
    }

    const sendDice = () => {
        setRollDiceIsDisabled(true);
        sendMessage(`/app/game/${gameId}/board/dice`, {})
    }

    const mushrooms=new Set<string>(["MagicMushroom", "UltraMagicMushroom", "SuperMagicMushroom"])

    const sendUsable = (usable) => {
        setPreviewImage("")
        setUsablesIsDisabled(true);
        let address=""

        if (allData[usable]["Type"]==="Ultimate Attack"){
            sendMessage(`/app/game/${gameId}/board/ultimate`, {"used": usable, "choice": {}})
            
            return;
        }

        switch (allData[usable]["Type"]){
            case "Card":
                setRollDiceIsDisabled(true);
                address=`/app/game/${gameId}/board/cards`
                break;
            case "Item":
                if(mushrooms.has(usable)){
                    setRollDiceIsDisabled(true);
                }
                address=`/app/game/${gameId}/board/items`
                break;
        }

        const genPlayer = (stuff) => {
            const id=userNames[displayPlayerIds[stuff]]

            return [
                id,
                () => {
                    sendMessage(address, {"used": usable, "choice": {"playerId": displayPlayerIds[stuff].toString()}});
                    setChoiceMessage(["", "", "", ""])
                }
            ]
        }
        const gen = (stuff) => {
            return [
                stuff,
                () => {
                    sendMessage(address, {"used": usable, "choice": stuff });
                    setChoiceMessage(["", "", "", ""])
                }
            ]
        }
        switch (allData[usable]["Choice"]){ //NOSONAR
            case "otherPlayerId":
                setChoiceMessage([genPlayer(1), genPlayer(2), genPlayer(3), ""])
                break;
            case "playerId":
                setChoiceMessage([genPlayer(1), genPlayer(2), genPlayer(3), genPlayer(0)])
                break;
            default:
                // if (allData[usable]["Choice"].length>=1) {
                switch (allData[usable]["Choice"].length){
                    case 0:
                    case 1:
                        setChoiceMessage(["", "", "", ""])
                        sendMessage(address, {"used": usable, "choice": {}})
                        break;
                    case 2:
                        setChoiceMessage([gen(allData[usable]["Choice"][0]), gen(allData[usable]["Choice"][1]), "", ""])
                        break;
                    case 3:
                        setChoiceMessage([gen(allData[usable]["Choice"][0]), gen(allData[usable]["Choice"][1]), gen(allData[usable]["Choice"][2]), ""])
                        break;
                    case 4:
                        setChoiceMessage([gen(allData[usable]["Choice"][0]), gen(allData[usable]["Choice"][1]), gen(allData[usable]["Choice"][2]), gen(allData[usable]["Choice"][3])])
                        break;
                    default:
                        sendMessage(address, {"used": usable, "choice": {}})


                }
                
                // if (allData[usable]["Choice"].len!==0) setChoiceMessage(allData[usable]["Choice"])
                //     else sendMessage(address, {"used": usable, "choice": {}})
        }
    }

    //#endregion

    const sendMessageWeb = () => {
        sendMessage(`/app/game/${gameId}/board/test`, {"player":localStorage.getItem("playerId"),"item":"TreasureChest"});
    }

    useEffect(() => {
        if(allPlayers){
            const currentPlayer = allPlayers.find(player => player.username === localStorage.getItem("username"));
            const teammate = allPlayers.find(player => player.playerId === currentPlayer.teammateId);
            const remaining = allPlayers.filter(player => player.username !== currentPlayer.username && player.username !== teammate.username);

            const newDisplayPlayer = {};

            // Add current player
            newDisplayPlayer[currentPlayer.playerId] = currentPlayer.username;

            // Add teammate
            newDisplayPlayer[teammate.playerId] = teammate.username;

            // Add remaining players
            remaining.forEach(player => {
                newDisplayPlayer[player.playerId] = player.username;
            });

            const newDisplayId = [
                currentPlayer.playerId,
                teammate.playerId,
                ...remaining.map(player => player.playerId)
            ]

            setUserNames(newDisplayPlayer);
            setDisplayPlayerIds(newDisplayId);
        }
    }, [allPlayers]);

    //$ websockets
    useEffect(() => {
        if (client && isConnected){
            const processor = new CommandProcessor(functionsForQueue);
            const subscriptionStart = client.subscribe(`/topic/game/${gameId}/board/start`, (message)=>{
                const data = JSON.parse(message.body);
                const mappedPlayers = mapDataToPlayers({players: data.players});
                setAllPlayers(mappedPlayers);
            });

            const subscriptionGoal = client.subscribe(`/topic/game/${gameId}/board/goal`, (message) => {
                const data = JSON.parse(message.body);
                processor.addToQueue("goal", data)
                
            });

            const subscriptionError = client.subscribe(`/user/queue/game/${gameId}/board/error`, (message) => {
                timerMsg("ERROR", JSON.parse(message.body), 3000);
            });

            const subscriptionJunction = client.subscribe(`/user/queue/game/${gameId}/board/junction`, (message) => {
                const data = JSON.parse(message.body);
                processor.addToQueue("junction", data)

            });

            const subscriptionUsables = client.subscribe(`/topic/game/${gameId}/board/usables`, (message) => {
                const data = JSON.parse(message.body);
                processor.addToQueue("usables", data)

            });

            const subscriptionMove = client.subscribe(`/topic/game/${gameId}/board/move`, (message) => {
                const data = JSON.parse(message.body);
                processor.addToQueue("move", data)

            });

            const subscriptionMoney = client.subscribe(`/topic/game/${gameId}/board/money`, (message) => {
                const data = JSON.parse(message.body);
                processor.addToQueue("money", data)

            });

            const subscriptionActivePlayer = client.subscribe(`/topic/game/${gameId}/board/newActivePlayer`, (message) => {
                const data = JSON.parse(message.body);
                processor.addToQueue("newActivePlayer", data)

            });

            const subscriptionDice = client.subscribe(`/topic/game/${gameId}/board/dice`, (message) => {
                const data = JSON.parse(message.body);
                processor.addToQueue("dice", data)
            });

            const subscriptionWinCondition = client.subscribe(`/user/queue/game/${gameId}/board/winCondition`, (message) => {
                const data = JSON.parse(message.body);
                processor.addToQueue("winCondition", data)
            });

            const subscriptionUltimate = client.subscribe(`/user/queue/game/${gameId}/board/ultimative`, (message) => {
                const data = JSON.parse(message.body);
                processor.addToQueue("ultimate", data)
            });

            const subscriptionGameEnd = client.subscribe(`/topic/game/${gameId}/board/gameEnd`, (message) => {
                const data = JSON.parse(message.body);
                gameEnd(data)
            });
            setSocketReady(true);

            setSubscriptions([
                subscriptionStart,
                subscriptionGoal,
                subscriptionError,
                subscriptionJunction,
                subscriptionUsables,
                subscriptionMove,
                subscriptionMoney,
                subscriptionActivePlayer,
                subscriptionDice,
                subscriptionWinCondition,
                subscriptionUltimate,
                subscriptionGameEnd
            ]);

            if(!localStorage.getItem("turnorder")){
                sendMessage(`/app/game/${gameId}/board/start`, {userId});
            }

            return () => {
                subscriptionStart.unsubscribe();
                subscriptionGoal.unsubscribe();
                subscriptionError.unsubscribe();
                subscriptionJunction.unsubscribe();
                subscriptionUsables.unsubscribe();
                subscriptionMove.unsubscribe();
                subscriptionMoney.unsubscribe();
                subscriptionActivePlayer.unsubscribe();
                subscriptionDice.unsubscribe();
                subscriptionWinCondition.unsubscribe();
                subscriptionUltimate.unsubscribe();
                subscriptionGameEnd.unsubscribe();
            }
        }

    }, [client, isConnected, sendMessage, disconnect])

    //! Audio  
    //#region

    useEffect(() => {
        if(socketReady){
            sendMessage(`/app/game/${gameId}/board/start`, {userId});
        }
    }, [socketReady]);

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
        setMuted(mute);
        setMute(!mute);
    }

    const handleJoin = () => {
        joinVoice("main");
        setInVoice(true);
        setMute(false);
    }

    const handleLeave = () => {
        leaveVoice();
        setInVoice(false);
        setInTeam(false);
    }

    const getTeam = () => {
        return Number(localStorage.getItem("playerId"))%2 === 0 ? "even" : "odd";
    }
    //#endregion

    //^ Helper functions
    //#region 

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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
                
                switch (event.key){ //NOSONAR
                    case "r":
                        resetTransform();
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
                        setTimeout(() => adjustFigurineSize(), 0) //NOSONAR
                        setTimeout(() => adjustFigurineSize(), 1000) //NOSONAR
                        break;
                    case "F1":
                        //TODO insert help //NOSONAR
                        timerMsg("Help", "Good Luck!", 2000); //NOSONAR
                        break;
                    case "x":
                        setHaveMessages(1-haveMessages)
                        break;
                    case "c":
                        setPlayerColour({"1":"yellow", "2":"green", "3":"blue", "4":"red"})
                        break;
                    case "C":
                        setPlayerColour({"1":"orange", "2":"purple", "3":"pink", "4":"white"})
                        break;
                    default:
                        break;
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
        window.addEventListener("load", adjustFigurineSize);
        window.addEventListener("resize", adjustFigurineSize);
        document.body.classList.add("scrollbar-removal");
        setTimeout(() => {adjustFigurineSize()},1000);
        //NOSONAR setTimeout(() => {joinVoice("main")},7000);

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            leaveVoice("main")
            window.removeEventListener("load", adjustFigurineSize);
            window.removeEventListener("resize", adjustFigurineSize);

            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.body.classList.remove("scrollbar-removal");
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
        const active = playerId===displayPlayerIds[0];
        const isTeammate = playerId === displayPlayerIds[1];

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
                isTeammate={isTeammate}
                isCurrentplayer={active}
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
                    onClick={active && !usablesIsDisabled? () => sendUsable(name) : () => console.log(`${name} doesn't belong to the active player`)}
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

    let messageHTML = (activeMessage[0] === "" ? "" :
        <div className="message-box">
            <div className="message-name-class-box">
                Message <b>{activeMessage[0]}</b>
            </div>
            <div className="message-text-box">
                {activeMessage.length < 2 || typeof activeMessage[1] !== "string" ? "" :
                    <div className="message-text" dangerouslySetInnerHTML={{ __html: activeMessage[1].replace(/\n/g, "<br />") }} />
                }
            </div>
        </div>
    );

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

    let choiceHTML = (choiceMessage[0]==="" ? "" :
    <div className="message-box">
        <div className="message-name-class-box">
            <b>Choose one of the following:</b>
        </div>

        <div className="message-text-box">
            {choiceMessage[0] && choiceMessage[0][0] !== "" && (
            <button 
                onClick={choiceMessage[0][1]}
                className={"pretty-button"}
            >
            {choiceMessage[0][0]}
            </button>
            )}
            {choiceMessage[1] && choiceMessage[1][0] !== "" && (
            <button 
                onClick={choiceMessage[1][1]}
                className={"pretty-button"}
            >
            {choiceMessage[1][0]}
            </button>
            )}
            {choiceMessage[2] && choiceMessage[2][0] !== "" && (
            <button 
                onClick={choiceMessage[2][1]}
                className={"pretty-button"}
            >
            {choiceMessage[2][0]}
            </button>
            )}
            {choiceMessage[3] && choiceMessage[3][0] !== "" && (
            <button 
                onClick={choiceMessage[3][1]}
                className={"pretty-button"}
            >
            {choiceMessage[3][0]}
            </button>
            )}
        </div>
    </div>
    )

        
    return (
        <div>
            {/* Top UI doesn't work correctly, as it shrinks the main screen */}
            <TurnOverlay
                activePlayerName={userNames[activePlayer]}  // Ensure `activePlayer` and `userNames` are defined and updated elsewhere in your component
                isVisible={showOverlay}
                closeOverlay={() => setShowOverlay(false)}
            />
            <div className="board-container">
                {choiceHTML}
                {activeMessage[0]==="" ? previewImageHTML : haveMessages ? messageHTML : ""}
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
                        <div className="win-condition-box" //NOSONAR
                             onMouseEnter={() => setPreviewImage(currWinCondition)}
                             onMouseLeave={() => setPreviewImage("")}>
                            <div className="win-condition-chart" style={{backgroundImage: `conic-gradient(#0fdf0f ${winConditionProgress[0]/winConditionProgress[1]*100}%, #004f00 ${winConditionProgress[0]/winConditionProgress[1]*100}%)`}}/>
                            <div className="win-condition-name">
                                {winConditionData[currWinCondition]["DisplayName"]}
                            </div>

                        </div>
                        <div className="ultimate-box" //NOSONAR
                            onMouseEnter={() => setPreviewImage(ultimateName)}
                            onMouseLeave={() => setPreviewImage("")}
                            disabled = {usablesIsDisabled || !ultimateState}
                            onClick={() => (ultimateState===true && activePlayer===localStorage.getItem("playerId") ? sendUsable(ultimateName) : console.log("Ultimate already used."))}
                            style={{cursor: ultimateState===true && activePlayer===localStorage.getItem("playerId")  ? "cursor" : "default"}}
                            >
                            <div className="ultimate-name"
                                style={{
                                    backgroundColor: ultimateState===true && activePlayer===localStorage.getItem("playerId") ? "#b1001d":"#5e0000",
                                    // cursor: ultimateState ? "cursor" : "default"
                                }}
                            >
                                {ultimateData[ultimateName]["DisplayName"]}
                            </div>
                        </div>
                    </div>
                    {playerElement(displayPlayerIds[0])}
                    <div className="player-status-controls">
                        <div className="player-status-controls-box">
                            <div><button
                                disabled={rollDiceIsDisabled}
                                onClick={ () => sendDice()}
                                className="pretty-button"
                            >
                                Roll Dice
                            </button></div>
                            {/* <button onClick={ () => alert("a")}>Use Item</button> */}
                            <div><button
                                onClick={() => {handleJoin()}}
                                className="pretty-button"
                            >
                                Join Voicechat
                            </button><br/></div>
                            <div><button
                                onClick={() => {handleLeave()}} disabled={!inVoice}
                                className="pretty-button"
                            >
                                Leave Voicechat
                            </button><br/></div>
                            <div><button
                                onClick={(event) => {toggleVoice(event,getTeam())}} disabled={!inVoice}
                                className="pretty-button"
                            >
                                {inTeam ? "Team chat" : "Global Chat"}
                            </button><br/></div>
                            <div><button
                                onClick={() => {handleMute()}} disabled={!inVoice}
                                className="pretty-button"
                            >
                                {mute ? "Unmute" : "Mute"}
                            </button><br/></div>
                            <div><button
                                onClick={() => {timerMsg("Leave", "You're stuck here forever", 3000)}}
                                className="pretty-button"
                            >
                                Home
                            </button><br/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Board;