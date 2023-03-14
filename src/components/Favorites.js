import React, { useState } from "react";
import MenuItem from "./MenuItem";
import { Menu, Button, Drawer } from "antd";
import {
  EyeOutlined,
  YoutubeOutlined,
  VideoCameraOutlined,
  StarFilled,
} from "@ant-design/icons";

const { SubMenu } = Menu;

function Favorites({ favoriteItems }) {
  // this is the state passed all the way from app.js
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const { videos, streams, clips } = favoriteItems; // passed all the way from app.js

  const onDrawerClose = () => {
    // close the drawer
    setDisplayDrawer(false);
  };

  const onFavoriteClick = () => {
    //open the drawer
    setDisplayDrawer(true);
  };

  return (
    <>
      <Button
        type="primary"
        shape="round"
        onClick={onFavoriteClick} // setDisplayDrawer will be called when click
        icon={<StarFilled />}
      >
        My Favorites
      </Button>
      <Drawer
        //drawer is 从侧边出来的弹窗
        title="My Favorites"
        placement="right" // pop up from right
        width={720}
        visible={displayDrawer}
        onClose={onDrawerClose}
        //	onClose: Specify a callback that will be called when a user clicks  close button
      >
        <Menu
          mode="inline"
          defaultOpenKeys={["streams"]} //Array with the keys of default opened sub menus
          style={{ height: "100%", borderRight: 0 }}
          selectable={false}
        >
          <SubMenu key={"streams"} icon={<EyeOutlined />} title="Streams">
            <MenuItem items={streams} />
            {/*we have a sperate component for this*/}
          </SubMenu>
          <SubMenu key={"videos"} icon={<YoutubeOutlined />} title="Videos">
            <MenuItem items={videos} />
          </SubMenu>
          <SubMenu key={"clips"} icon={<VideoCameraOutlined />} title="Clips">
            <MenuItem items={clips} />
          </SubMenu>
        </Menu>
      </Drawer>
    </>
  );
}

export default Favorites;
