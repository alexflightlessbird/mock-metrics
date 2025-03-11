import React from "react";
import { Link } from "react-router-dom";

export default function BackButton({ onClickLink, handleClickFunction }) {
  if (handleClickFunction) {
    return <button onClick={handleClickFunction}>&#x2190;</button>;
  } else if (onClickLink) {
    return (
      <Link to={onClickLink}>
        <button>&#x2190;</button>
      </Link>
    );
  }
}
