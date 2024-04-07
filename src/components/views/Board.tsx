import React, {useEffect, useState, useRef} from "react";
import {TransformWrapper, TransformComponent, useControls} from "react-zoom-pan-pinch";
import "styles/views/Board.scss";


const FigurineText: React.FC<{
    id: number,
    figurineSize: string,
    getCoord: (id: number, coordinate: string) => number,
    playerColour: { [key: number]: string }
}> = ({ id, figurineSize, getCoord, playerColour }) => {

    function getFigurineImage(id: number): string{
        try {
            return require(`../../assets/figurines/${playerColour[id]}.png`)
        }
        catch{
            return "";
        }
    }

    const centering = parseFloat(figurineSize) / 2;

    const image= getFigurineImage(id);
    
    return (<img
        src={image}
        style={{
            width: figurineSize,
            height: "auto", 
            position: "absolute", 
            left: `${getCoord(id, "x")}%`,
            bottom: `${getCoord(id, "y")}%`,
            //old code: transform: `translate(-${getCoord(id, "x")}%, -${getCoord(id, "y")}%)`
            transform: `translate(-50%, 50%) translate(-${centering}px, ${centering}px)`
        }}
        className="figurine-picture"
        alt={`${playerColour[id]} figurine`}
    />
    );
}

//are to be loaded from burger.json
const coordinates = {1:[0.17012893982808, 0.440532417346501], 2:[0.641833810888252, 0.670244740231859], 3:[0.327722063037249, 0.504508372692143], 4:[0.600286532951289, 0.477458136539287], 5:[0.900787965616046, 0.613997423787033], 6:[0.322349570200573, 0.844568484328038], 7:[0.403295128939828, 0.293258909403177], 8:[0.333810888252149, 0.127093173035638], 9:[0.827722063037249, 0.772434521253757], 10:[0.876074498567335, 0.702018033490768], 11:[0.469914040114613, 0.850579647917561], 12:[0.893624641833811, 0.522971232288536], 13:[0.846704871060172, 0.440103048518678], 14:[0.790472779369627, 0.375268355517389], 15:[0.723853868194842, 0.321597252039502], 16:[0.660458452722063, 0.180334907685702], 17:[0.599212034383954, 0.133533705452984], 18:[0.413323782234957, 0.126234435379991], 19:[0.53474212034384, 0.851438385573207], 20:[0.285100286532951, 0.187634177758695], 21:[0.212392550143266, 0.20781451266638], 22:[0.169054441260745, 0.279089738085015], 23:[0.170845272206304, 0.36152855302705], 24:[0.192335243553009, 0.797337913267497], 25:[0.170487106017192, 0.522971232288536], 26:[0.169770773638968, 0.605839416058394], 27:[0.242836676217765, 0.693430656934307], 28:[0.26432664756447, 0.62043795620438], 29:[0.398638968481375, 0.585659081150708], 30:[0.459169054441261, 0.612709317303564], 31:[0.434813753581662, 0.67582653499356], 32:[0.421919770773639, 0.782739373121511], 33:[0.709885386819484, 0.741949334478317], 34:[0.253939828080229, 0.848003434950623], 35:[0.573424068767908, 0.670244740231859], 36:[0.507879656160459, 0.677114641477029], 37:[0.744985673352435, 0.581365392872477], 38:[0.727793696275072, 0.500644053241735], 39:[0.726361031518625, 0.407471017604122], 40:[0.613538681948424, 0.285959639330185], 41:[0.549426934097421, 0.321167883211679], 42:[0.492836676217765, 0.367969085444397], 43:[0.456661891117478, 0.433233147273508], 44:[0.543696275071633, 0.507943323314727], 45:[0.38932664756447, 0.8475740661228], 46:[0.660458452722063, 0.431515671962216], 47:[0.76432664756447, 0.826534993559468], 48:[0.338825214899713, 0.418205238299699], 49:[0.352793696275072, 0.337054529841133], 50:[0.314469914040115, 0.259768140832975], 51:[0.484598853868195, 0.210390725633319], 52:[0.612464183381089, 0.84070416487763], 53:[0.0744985673352436, 0.512666380420782], 54:[0.819842406876791, 0.612279948475741], 55:[0.427292263610315, 0.728209531987978], 56:[0.443409742120344, 0.251610133104337], 57:[0.175143266475645, 0.709317303563761], 58:[0.686962750716332, 0.837269214255045], 59:[0.726570200573066, 0.673380420781451], 60:[0.691618911174785, 0.249033920137398], 61:[0.51432664756447, 0.137398024903392], 62:[0.325573065902579, 0.588235294117647], 63:[0.453080229226361, 0.519106912838128]}

//only used for development purposes, to be removed in production build
const numberOfCoordinates=Object.keys(coordinates).length;

const Board = () => {
    const [imageId, setImageId]=useState("0"); //which goal state is used
    const [overlayActive, setOverlayActive]=useState(0);
    const [figurineSize, setFigurineSize]=useState("20px"); //starting value isn't seen under normal circumstances
    const [playerSpace, setPlayerSpace]=useState({"1": 1, "2": 2, "3": 3, "4":4});
    const [playerColour, setPlayerColour]=useState({"1":"yellow", "2":"green", "3":"blue", "4":"red"})
    const boardRef=useRef(null);
    const figurineGlobalOffset=[1.21, 1.61] //offset to center figurines on the spaces
    const relativeFigurineSize=.025 //figurine width in % of boardwidth
    const multipleFigurinesDisplacement = {"1":[[0, 0]], "2":[[-1.3, 0], [1.3, 0]], "3": [[-1.8, .3], [1.8, .3], [0, -.55]], "4": [[0, 1.8], [1.8, 0], [-1.8, 0], [0, -1.8]]} //displacement in board width percentage when multiple players are on one space

    const getCoord = (id:number, coordinate:string):number => {

        const thisSpace=playerSpace[id]
        let numberOfPlayersOnSpace=0
        let playersOnSpace: number[]=[]

        Object.entries(playerSpace).forEach(([key, val]) => {
            if(Number(val)===Number(thisSpace)){numberOfPlayersOnSpace++; playersOnSpace.push(Number(key))}
        });
        playersOnSpace.sort() //maybe not needed if typescript dicts are ordererd

        let displacementPriority=playersOnSpace.findIndex(elements => elements === id);
        let displacementCoordinates = multipleFigurinesDisplacement[numberOfPlayersOnSpace][displacementPriority]

        
        switch (coordinate.toLowerCase()){
        case "0":
        case "x":
            var coord=0
            break;
        case "1":
        case "y":
            var coord=1
            break;
        default:
            throw new Error("Invalid coordinate");
        }
        
        return (coordinates[playerSpace[id]][coord]*100)+figurineGlobalOffset[coord]+displacementCoordinates[coord];
    }

    const interpolation = (startCoord: number[], endCoord: number[], steps: number): number[] => {
        let res: number[]=[]
        for (let i=0; i<steps; i++){
            let ratio=i/(steps-1);
            res.push[startCoord[0]*ratio+endCoord[0]*ratio, startCoord[1]*(1-ratio)+endCoord[1]*(1-ratio)]
        }
        return res
    }

    const KeyboardControls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();
    
        useEffect(() => {
            const keyDownEvent = (event) => {
                let r=function(){return Math.floor(Math.random()*(numberOfCoordinates-1)+1)}
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
                    // ↓ debug options, will be removed in the production build
                case "i":
                    // alert(interpolation(coordinates[playerSpace["1"]]))
                case "q":
                    setPlayerSpace({"1":(playerSpace["1"]%numberOfCoordinates)+1, "2":(playerSpace["2"]%numberOfCoordinates)+1, "3":(playerSpace["3"]%numberOfCoordinates)+1, "4":(playerSpace["4"]%numberOfCoordinates)+1})
                    break;
                case "w":
                    setPlayerSpace({...playerSpace, "4":(playerSpace["4"]%numberOfCoordinates)+1})
                    break;
                case "W":
                    setPlayerSpace({...playerSpace, "4":(playerSpace["4"]%numberOfCoordinates)-1})
                    break;
                case "s":
                    setPlayerSpace({"1":[54], "2":[53], "3":[53], "4":[54]})
                    break;
                case "e":
                    let rand=r()
                    setPlayerSpace({"1":[rand], "2":[rand], "3":[rand], "4":[rand]})
                    break;
                case "z":
                    setPlayerSpace({"1":[r()], "2":[r()], "3":[r()], "4":[r()]})
                    break;
                case "c":
                    setPlayerColour({"1": playerColour[2], "2": playerColour[3], "3": playerColour[4], "4": playerColour[1]})
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
        const boardWidth = boardRef.current.offsetWidth;
        const size = boardWidth * relativeFigurineSize;
        setFigurineSize(`${size}px`);
    };

    useEffect(() => {

        window.addEventListener("load", adjustFigurineSize);
        window.addEventListener("resize", adjustFigurineSize);
        
        return () => {
            window.removeEventListener("load", adjustFigurineSize);
            window.removeEventListener("resize", adjustFigurineSize);
        }
    }, []);
    
    useEffect(() => {
        
        document.body.classList.add("scrollbar-removal")
        
        return () => {
            document.body.classList.remove("scrollbar-removal")
        };
    }, []);


    let figurines = (
        <div className="figurine-overlay">
            {[1, 2, 3, 4].map(id => (
                <FigurineText
                    key={id}
                    id={id}
                    figurineSize={figurineSize}
                    getCoord={getCoord}
                    playerColour={playerColour}
                />
            ))}
        </div>
    );

    return (
        <div>
            {/* Top UI doesn't work correctly, as it shrinks the main screen */}
            <div className="board-container">
                Left UI
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
                        {figurines} {/* all 4 player figurines */}
                        <img
                            src={ require((`../../assets/boards/board_${imageId}.png`))}
                            className="board-background"
                            alt="Gameboard"
                        />
                    </TransformComponent>
                </TransformWrapper>
                Right UI
            </div>
        </div>

    )
}

export default Board;