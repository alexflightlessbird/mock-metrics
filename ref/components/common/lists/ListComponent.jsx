import React from "react";
import { Link } from "react-router-dom";

export default function ListComponent({
  items,
  title,
  emptyMessage,
  linkPath,
  renderItem,
}) {
  let render;

  if (renderItem) {
    render = renderItem;
  }
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <li key={item.id || index}>
              {render && renderItem(item)}
              {!render && linkPath && (
                <Link to={`${linkPath}/${item.id}`}>{item.name}</Link>
              )}
              {!render && !linkPath && item.name}
            </li>
          ))
        ) : (
          <li>{emptyMessage}</li>
        )}
      </ul>
    </div>
  );
}
