import React from "react";
import PropTypes from "prop-types";
import "../../styles/views/Game.scss";

export const PlayerButton = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className = {`player ${props.className}`}>
        {props.children}
    </button>
)

PlayerButton.propTypes = {
    width: PropTypes.number,
    style:PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
};