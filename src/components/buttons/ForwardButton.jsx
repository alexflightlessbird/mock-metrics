import React from "react";
import { Link } from "react-router-dom";

export default function ForwardButton({ onClickLink, handleClickFunction }) {
  if (handleClickFunction) {
    return <button onClick={handleClickFunction}>&#x2191;</button>;
  } else if (onClickLink) {
    return (
      <Link to={onClickLink}>
        <button>&#x2191;</button>
      </Link>
    );
  }
}
