import React from 'react';
import { Link } from 'react-router-dom';
import icons from "../../utils/icons.json";

export default function IconButton ({ onClickLink, handleClickFunction, text, icon }) {
    const innerText = (text || "")
    if (handleClickFunction) {
        return <button onClick={handleClickFunction}>{icon ? <span role="img" ariaLabel={icon}>{icons[icon]} </span> : ""}{innerText}</button>;
    } else if (onClickLink) {
        return (
            <Link to={onClickLink}>
                <button>{icon ? <span role="img" ariaLabel={text}>{icons[icon]} </span> : ""}{innerText}</button>
            </Link>
        )
    } else {
        return (
            <button>{icon ? <span role="img" ariaLabel={text}>{icons[icon]} </span> : ""}{innerText}</button>
        )
    }
}