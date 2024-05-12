import React, {useEffect, useState, useRef} from "react";
import {TransformWrapper, TransformComponent, useControls} from "react-zoom-pan-pinch";
import "styles/views/Board.scss";
import { useWebsocket } from "./Websockets";
import {Player} from "types";

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
    colors?: [string, string]
}> = ({ x, y, size, alt, pathToPicture, className, rotation="", clickFunction= () => (console.log("clicked Thing")), colors=["", ""]}) => {

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
            filter: colors[0],
        }}
        onClick={clickFunction}
        className={className}
        onMouseEnter={e => e.currentTarget.style.filter = colors[1]}
        onMouseLeave={e => e.currentTarget.style.filter = colors[0]}
        onKeyPress={console.log("")}
        alt={alt}
    />
    );
}

const PlayerStatus: React.FC<{
    playerMoney: string;
    playerColour: string;
    items: string;
    userName: string;
    bold: boolean
}> = ({ playerMoney, playerColour, items , userName, bold}) => {
  
    return (
        <div className="player-status-box">
            <b><font color={playerColour}>{bold ? userName : ""}</font></b>
            <font color={playerColour}>{bold ? "" : userName}</font><br/>
            Money: {playerMoney}<br/>
            Items: {items}
        </div>
    );
};
//#endregion

//are to be loaded from burger.json/be sent from the backend
const coordinates = {"1":[0.17012893982808, 0.440532417346501], "2":[0.641833810888252, 0.670244740231859], "3":[0.327722063037249, 0.504508372692143], "4":[0.600286532951289, 0.477458136539287], "5":[0.900787965616046, 0.613997423787033], "6":[0.322349570200573, 0.844568484328038], "7":[0.403295128939828, 0.293258909403177], "8":[0.333810888252149, 0.127093173035638], "9":[0.827722063037249, 0.772434521253757], "10":[0.876074498567335, 0.702018033490768], "11":[0.469914040114613, 0.850579647917561], "12":[0.893624641833811, 0.522971232288536], "13":[0.846704871060172, 0.440103048518678], "14":[0.790472779369627, 0.375268355517389], "15":[0.723853868194842, 0.321597252039502], "16":[0.660458452722063, 0.180334907685702], "17":[0.599212034383954, 0.133533705452984], "18":[0.413323782234957, 0.126234435379991], "19":[0.53474212034384, 0.851438385573207], "20":[0.285100286532951, 0.187634177758695], "21":[0.212392550143266, 0.20781451266638], "22":[0.169054441260745, 0.279089738085015], "23":[0.170845272206304, 0.36152855302705], "24":[0.192335243553009, 0.797337913267497], "25":[0.170487106017192, 0.522971232288536], "26":[0.169770773638968, 0.605839416058394], "27":[0.242836676217765, 0.693430656934307], "28":[0.26432664756447, 0.62043795620438], "29":[0.398638968481375, 0.585659081150708], "30":[0.459169054441261, 0.612709317303564], "31":[0.434813753581662, 0.67582653499356], "32":[0.421919770773639, 0.782739373121511], "33":[0.709885386819484, 0.741949334478317], "34":[0.253939828080229, 0.848003434950623], "35":[0.573424068767908, 0.670244740231859], "36":[0.507879656160459, 0.677114641477029], "37":[0.744985673352435, 0.581365392872477], "38":[0.727793696275072, 0.500644053241735], "39":[0.726361031518625, 0.407471017604122], "40":[0.613538681948424, 0.285959639330185], "41":[0.549426934097421, 0.321167883211679], "42":[0.492836676217765, 0.367969085444397], "43":[0.456661891117478, 0.433233147273508], "44":[0.543696275071633, 0.507943323314727], "45":[0.38932664756447, 0.8475740661228], "46":[0.660458452722063, 0.431515671962216], "47":[0.76432664756447, 0.826534993559468], "48":[0.338825214899713, 0.418205238299699], "49":[0.352793696275072, 0.337054529841133], "50":[0.314469914040115, 0.259768140832975], "51":[0.484598853868195, 0.210390725633319], "52":[0.612464183381089, 0.84070416487763], "53":[0.0744985673352436, 0.512666380420782], "54":[0.819842406876791, 0.612279948475741], "55":[0.427292263610315, 0.728209531987978], "56":[0.443409742120344, 0.251610133104337], "57":[0.175143266475645, 0.709317303563761], "58":[0.686962750716332, 0.837269214255045], "59":[0.726570200573066, 0.673380420781451], "60":[0.691618911174785, 0.249033920137398], "61":[0.51432664756447, 0.137398024903392], "62":[0.325573065902579, 0.588235294117647], "63":[0.453080229226361, 0.519106912838128]}
const allItems=new Set<string>(["MagicMushroom", "TwoMushrooms", "TheBrotherAndCo", "PeaceImOut", "Fusion", "IceCreamChest", "WhatsThis", "SuperMagicMushroom", "Stick", "ImOut", "TreasureChest", "MeowYou", "XboxController", "BadWifi", "UltraMagicMushroom", "BestTradeDeal", "ItemsAreBelongToMe", "Confusion", "GoldenSnitch", "OnlyFansSub", "ChickyNuggie"])
const allCards=new Set<string>(["B14", "B26", "B35", "B135", "B246", "B123", "B456", "B07", "S0", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "G13", "G26", "G45", "G04", "G37", "G1256"])
const overSpaces=new Set<string>(["Junction", "Gate", "SpecialItem", "Goal"])

const datata1 = `[{"newActivePlayer":{"currentTurn":1,"activePlayer":"4"}}, {"move":{"1":{"spaces":[53],"moves":0,"spaceColour":null},"3":{"spaces":[53],"moves":0,"spaceColour":null},"2":{"spaces":[54],"moves":0,"spaceColour":null},"4":{"spaces":[54],"moves":0,"spaceColour":null},"movementType":"teleport"}}, {"money": {"1": {"newAmountOfMoney": 10, "changeAmountOfMoney": 0},"2": {"newAmountOfMoney": 10, "changeAmountOfMoney": 0},"3": {"newAmountOfMoney": 10, "changeAmountOfMoney": 0},"4":{"newAmountOfMoney": 10, "changeAmountOfMoney": 0}}},{"sleep": 2500},{"move":{"4":{"spaces":[37,38,39,15],"moves":4,"spaceColour":"Blue"},"movementType":"walk"}},{"money": {"4":{"newAmountOfMoney": 13,"changeAmountOfMoney":"3"}}},{"newActivePlayer":{"currentTurn":1,"activePlayer":"1"}}${"]"}`
const datata2 = `[{"move":{"1":{"spaces":[25,26,57],"moves":5,"spaceColour":"Blue"},"movementType":"walk"}},{"junction":{"playerId":"1","currentSpace":57,"nextUnlockedSpaces":[24,27],"nextLockedSpaces":[]}}${"]"}`;
const datata3 = `[{"move":{"1":{"spaces":[24,34,6],"moves":5,"spaceColour":"Blue"},"movementType":"walk"}}${"]"}`

// const [result, setResult]=useState("")

//! only used for development purposes, to be removed in production build
//#region 
const numberOfCoordinates=Object.keys(coordinates).length;

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

const moneyDataExample1 = {
    "address": "/topic/board/money",
    "data": {
        "1": { //playerId
            "newAmountOfMoney": 13, //new amount of money for player 1
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
    const [imageId, setImageId]=useState("0"); //which goal state is used
    const [overlayActive, setOverlayActive]=useState(0);
    const [figurineSize, setFigurineSize]=useState("20px"); //actual size in pixels; starting value isn't seen under normal circumstances
    const [arrowSize, setArrowSize]=useState("20px"); //actual size in pixels; starting value isn't seen under normal circumstances
    type ItemsState = {[playerId: string]: {[itemName: string]: number}};
    const initialItems = Object.fromEntries(Array.from(allItems).map(item => [item, 0]));
    const [items, setItems]=useState<ItemsState>({"1": initialItems, "2": initialItems, "3": initialItems, "4": initialItems})
    const relativeFigurineSize=.025 //figurine width in % of boardwidth
    const relativeArrowSize=.035 //arrow width in % of boardwidth
    const [playerSpace, setPlayerSpace]=useState({"1": 53, "2": 54, "3": 53, "4": 54});
    const [playerMoney, setPlayerMoney]=useState({"1": 10, "2": 10, "3": 10, "4": 10});
    const [turnNumber, setTurnNumber]=useState(0);
    const [activePlayer, setActivePlayer]=useState("0");
    const [dice, setDice]=useState(0);
    const [playerColour, setPlayerColour]=useState({"1":"yellow", "2":"green", "3":"blue", "4":"red"})
    const [displayPlayerIds, setDisplayPlayerIds]=useState(["1", "2", "3", "4"]) //This Player, Teammate, Enemy, Enemy
    const [userNames, setUserNames]=useState({"1": "Player 1", "2": "Player 2", "3": "Player 3", "4": "Player 4"})
    const [arrowPositions, setArrowPositions]=useState(null) //null if there are no arrows, otherwise [[from, to, locked?]]
    const boardRef=useRef(null);
    const figurineGlobalOffset=[-1.3, -2.05] //offset to center figurines on the spaces
    const arrowGlobalOffset=[1.9, 2.1] //offset to correct arrow positioning
    const multipleFigurinesDisplacement = {"1":[[0, 0]], "2":[[-1.3, 0], [1.3, 0]], "3": [[-1.8, .3], [1.8, .3], [0, -.55]], "4": [[0, 1.8], [1.8, 0], [-1.8, 0], [0, -1.8]]} //displacement in board width percentage when multiple players are on one space
    const gameId = localStorage.get("gameId");
    const [players, setPlayers] = useState<Player[]>(null);
    //~ interpretation of websocket messages

    const move = (data) => {
        let toRead=structuredClone(data)
        if (toRead["movementType"] === undefined) {

            return Promise.resolve();; //in case BE sends an empty array
        }
        const movingType=toRead["movementType"];
        delete toRead["movementType"];

        return new Promise(async (resolve, reject) => {
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

    const forArrow = () => {
        setArrowPositions(null);
        processCommands(datata3)
        money(moneyDataExample1)
    }

    const forDice = async () => {
        alert("You rolled a 5")
        await sleep(500);
        // setResult("")
        processCommands(datata2)
    }

    async function processCommands(datata) {
        const exampleFunctions: { [key: string]: (arg: any) => void } = {
            move,
            junction,
            goal,
            newActivePlayer,
            money,
            sleep
        };
      
        const commands = JSON.parse(datata);
      
        for (const commandObject of commands) {
            // await sleep(1500);

            const commandName = Object.keys(commandObject)[0];
            const commandData = commandObject[commandName];
            const func = exampleFunctions[commandName];

            if (typeof func === "function") {
                await func(commandData); //NOSONAR
            }
        
        }
    }

    //$ websockets

    useEffect(() => {
        if (client && isConnected){
            const subscriptionStart = client.subscribe(`/topic/game/${gameId}/board/start`, (message)=>{
                const data = JSON.parse(message.body);
                setPlayers(data.players);
            })
            client.subscribe("/topic/board/goal", (message) => {
                const data = JSON.parse(message.body);
                goal(data)
            });

            client.subscribe("/topic/board/junction", (message) => {
                const data = JSON.parse(message.body);
                junction(data)
            });

            client.subscribe("/topic/board/move", (message) => {
                const data = JSON.parse(message.body);
                move(data)
            });

            client.subscribe("/topic/board/money", (message) => {
                const data = JSON.parse(message.body);
                money(data)
            });

            client.subscribe("/topic/board/newActivePlayer", (message) => {
                const data = JSON.parse(message.body);
                money(data)
            });
        }

        if(players === null){
            sendMessage(`/app/game/${gameId}/board/start`, {});
        }

    }, [client, isConnected, sendMessage, disconnect, players])

    //^ Helper functions

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const addItem = (playerId: string, itemName: string) => {
        setItems(prevItems => ({
            ...prevItems,
            [playerId]: {
                ...prevItems[playerId],
                [itemName]: prevItems[playerId][itemName] + 1
            }
        }));
    };

    const removeItem = (playerId: string, itemName: string) => {
        setItems(prevItems => ({
            ...prevItems,
            [playerId]: {
                ...prevItems[playerId],
                [itemName]: Math.max(prevItems[playerId][itemName] -1, 0)
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

    //$ UseEffects

    const KeyboardControls = () => { //NOSONAR
        const { zoomIn, zoomOut, resetTransform } = useControls();
    
        useEffect(() => { //NOSONAR
            const keyDownEvent = (event) => {
                let r=function(){return Math.floor(Math.random()*(numberOfCoordinates-1)+1)} //NOSONAR
                switch (event.key){
                case "r":
                    resetTransform();
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
                    //~ ↓ debug options, will be removed in the production build
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
                    newActivePlayer(turnDataExample["data"]);
                    break;
                case "g":
                    goal(goalDataExample["data"]);
                    break;
                case "M":
                    money(moneyDataExample2["data"]);
                    break;
                case "t":
                    (junction(junctionDataExample1["data"]));
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
                case "i":
                    addItem("1", "OnlyFansSub")
                    break;
                case "I":
                    removeItem("1", "OnlyFansSub")
                    break;
                case "q":
                    setPlayerSpace({"1":(playerSpace["1"]%numberOfCoordinates)+1, "2":(playerSpace["2"]%numberOfCoordinates)+1, "3":(playerSpace["3"]%numberOfCoordinates)+1, "4":(playerSpace["4"]%numberOfCoordinates)+1})
                    break;
                case "w":
                    setPlayerSpace({...playerSpace, "4":(playerSpace["4"]%numberOfCoordinates)+1})
                    break;
                case "W":
                    setPlayerSpace({...playerSpace, "4":Math.max((playerSpace["4"]%numberOfCoordinates)-1, 1)})
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

        window.addEventListener("load", adjustFigurineSize);
        window.addEventListener("resize", adjustFigurineSize);
        document.body.classList.add("scrollbar-removal");

        return () => {
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
                        // clickFunction= {() => sendMessage("/board/junction", JSON.stringify({"selectedSpace":id[1]}))}
                        clickFunction= {() => forArrow()}
                        colors={[id[2]===1 ? lockedFilter : unlockedFilter, hoverFilter]}
                    />))
                : ""}
        </div>
    )

    const playerElement = (playerId) => {
        return (
            <PlayerStatus   
                userName={userNames[playerId]}
                playerColour={playerColour[playerId]}
                items={items[playerId]["OnlyFansSub"]}
                playerMoney={playerMoney[playerId]}
                bold={activePlayer===playerId}
            />)
    }

    
    return (
        <div>
            {/* Top UI doesn't work correctly, as it shrinks the main screen */}
            <div className="board-container">
                <div className="player-status">
                    {playerElement(displayPlayerIds[2])}
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
                            src={ require((`../../assets/boards/board_${imageId}.png`))}
                            className="board-background"
                            alt="Gameboard"
                        />
                    </TransformComponent>
                </TransformWrapper>
                <div className="player-status">
                    <div className="player-status-turn">
                        Turn: {turnNumber}/20
                    </div>
                    <div className="player-status-win">
                        Win Condition: Jack Sparrow<br/>
                        Ultimate: Cat bell
                    </div>
                    {playerElement(displayPlayerIds[0])}
                    <div className="player-status-controls">
                        <button
                            // onClick={ () => sendMessage("/board/dice", JSON.stringify({}))} //NOSONAR
                            onClick={ () => forDice()}
                            disabled={activePlayer!==displayPlayerIds[0]}
                        >
                            Roll Dice
                        </button><br/>
                        {/* <button onClick={ () => alert("a")}>Use Item</button> */}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Board