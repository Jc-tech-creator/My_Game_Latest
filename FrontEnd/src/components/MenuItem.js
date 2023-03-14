import { Menu } from "antd";
import React from "react";

function MenuItem({ items }) {
  //items is passed from Favorites.js
  return items?.map(
    (
      item // "map" in js measn for-loop, for each
    ) => (
      <Menu.Item key={item.id}>
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {`${item.broadcaster_name} - ${item.title}`}
        </a>
      </Menu.Item>
    )
  );
}

export default MenuItem;
