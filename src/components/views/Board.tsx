import React, {useEffect, useState} from "react";
import {TransformWrapper, TransformComponent, useControls} from "react-zoom-pan-pinch";
import {api, handleError} from "helpers/api";
import {Button} from "components/ui/Button";
import {useNavigate, useParams} from "react-router-dom";
import "styles/views/Board.scss";

const Board = () => {


    useEffect(() => {

        document.body.classList.add("scrollbar-removal")
        // window.addEventListener("keydown", keyPressEvent);
        
        return () => {
            document.body.classList.remove("scrollbar-removal")
            // window.removeEventListener("keydown", keyPressEvent);
        };
    }, []);

    return (
        <div>
            Top Ui
            <div className="board-container">
                Left UI
                <TransformWrapper
                    disablePadding={true}
                    doubleClick={{mode:"toggle", step:1.3}}
                >
                    <TransformComponent>
                        <img
                            src={ require("../../files/boards/board_0.png")}
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