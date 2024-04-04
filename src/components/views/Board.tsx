import React, {useEffect, useState, useRef} from "react";
import {TransformWrapper, TransformComponent, useControls} from "react-zoom-pan-pinch";
import "styles/views/Board.scss";
// import min from "Math";


const Board = () => {
    const [imageId, setImageId]=useState("0");
    const [overlayActive, setOverlayActive]=useState(0);
    const [figurineSize, setFigurineSize]=useState("40px");
    const [playerCoordinate, setPlayerCoordinate]=useState({1:[0.333810888252149, 0.127093173035638], 2:[0.900787965616046, 0.613997423787033], 3:[0.17012893982808, 0.440532417346501], 4:[0.641833810888252, 0.670244740231859], 5:[0.723853868194842, 0.321597252039502]});
    const [playerColour, setPlayerColour]=useState({1:"yellow", 2:"green", 3:"blue", 4:"red"})
    const boardRef=useRef(null);
    const [xDif, yDif]=[1.2, 1.7] //to center figurines on the spaces

    const getCoord = (id:number, coordinate:string):number => {
        // alert(id)
        switch (coordinate.toLowerCase()){
        case "x": return (playerCoordinate[id][0])*100+xDif;
        case "y": return (playerCoordinate[id][1]*100)+yDif; //*(1-(32/716)) for y centering
        default: throw new Error;
        }
    }

    const KeyboardControls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();
    
        useEffect(() => {
            const keyDownEvent = (event) => {
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
                //↓ debug options, will be removed in 
                case "q":
                    setPlayerCoordinate({1:playerCoordinate[2], 2:playerCoordinate[3], 3:playerCoordinate[4], 4:playerCoordinate[5], 5:playerCoordinate[1]})
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
        const size = boardWidth * 0.025;
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

    const FigurineText: React.FC<{id: number}> = ({id}) => {

        function getFigurineImage(id: number): string{
            try {
                return require(`../../assets/figurines/${playerColour[id]}.png`)
            }
            catch{
                return "";
            }
        }

        const sizeAdjust = parseFloat(figurineSize) / 2

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
                transform: `translate(-50%, 50%) translate(-${sizeAdjust}px, ${sizeAdjust}px)`
            }}
            className="figurine-picture"
            alt={`${playerColour[id]} figurine`}
        />
        );
    }

    let figurines=(
        <div className="figurine-overlay">
            <FigurineText id={1}/>
            <FigurineText id={2}/>
            <FigurineText id={3}/>
            <FigurineText id={4}/>
        </div>
    )

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