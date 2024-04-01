import React, {useEffect, useState} from "react";
import {TransformWrapper, TransformComponent, useControls} from "react-zoom-pan-pinch";
import {api, handleError} from "helpers/api";
import {Button} from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import "styles/views/Board.scss";


const Board = () => {
    const [imageId, setImageId]=useState("0")

    const KeyboardControls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();
    
        useEffect(() => {
            const keyDownEvent = (event) => {
                switch (event.key){
                case "r": resetTransform();
                default:
                    if (event.key in ["1", "2", "3", "4", "5", "6", "7", "8", "0"])
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

    useEffect(() => {

        document.body.classList.add("scrollbar-removal")
        
        return () => {
            document.body.classList.remove("scrollbar-removal")
        };
    }, []);


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
                        <img
                            src={ require("../../files/boards/board_".concat(imageId, ".png"))}
                            className="board-background"
                        />
                    </TransformComponent>
                </TransformWrapper>
                Right UI
            </div>
        </div>

    )
}

export default Board;