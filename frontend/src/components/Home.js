import React from "react";
import { Button, Card, List, message, Tabs, Tooltip } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { addFavoriteItem, deleteFavoriteItem } from "../utils";

const { TabPane } = Tabs;
const tabKeys = {
  Streams: "stream",
  Videos: "videos",
  Clips: "clips",
};

const processUrl = (url) =>
  url
    .replace("%{height}", "252")
    .replace("%{width}", "480")
    .replace("{height}", "252")
    .replace("{width}", "480");

// for you to ReferenceError, this is backend itemEntity type, here is 'item'
// public record ItemEntity(
//     //the default constructor
//     @Id Long id,// this is the id generated in the db, the "id" means primary key
//     @JsonProperty("twitch_id") String twitchId,// look at the constructor, the video.id() clip.id() and stream.id() are all considered as twitch_id
//     String title,
//     String url,
//     @JsonProperty("thumbnail_url") String thumbnailUrl,
//     @JsonProperty("broadcaster_name") String broadcasterName,
//     @JsonProperty("game_id") String gameId,
//     @JsonProperty("item_type")ItemType type
//     )
const renderCardTitle = (item, loggedIn, favs = [], favOnChange) => {
  // items passed from cards, it is ItemEntity type, favs: favorite itemList of that itemEntity type
  const title = `${item.broadcaster_name} - ${item.title}`;

  const isFav = favs.find((fav) => fav.twitch_id === item.twitch_id); // isFav is a boolean type, whether this item is in the favorite list of that type

  const favOnClick = () => {
    //click on the 'favorite star'
    if (isFav) {
      // remove favorites
      deleteFavoriteItem(item)
        .then(() => {
          favOnChange(); // call the call back func, refetch the getFavoirte func
        })
        .catch((err) => {
          message.error(err.message);
        });

      return;
    }

    addFavoriteItem(item)
      .then(() => {
        // add favorites
        favOnChange(); // refetch getFavorites
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  return (
    <>
      {loggedIn && ( // the button icon only show when loggedIn
        <Tooltip
          title={isFav ? "Remove from favorite list" : "Add to favorite list"}
        >
          <Button
            shape="circle"
            icon={isFav ? <StarFilled /> : <StarOutlined />}
            onClick={favOnClick}
          />
        </Tooltip>
      )}
      <div style={{ overflow: "hidden", textOverflow: "ellipsis", width: 450 }}>
        <Tooltip title={title}>
          <span>{title}</span>
        </Tooltip>
      </div>
    </>
  );
};

const renderClipGrid = (data, loggedIn, favs, favOnChange) => {
  // data: streams/ video/ clips list of your searched or rendered list, favs: favorite stream/ video/ clips itemList
  return (
    // <List /> is a self-closing tag
    <List
      grid={{
        // 针对屏幕不同放的个数不同
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 4,
      }}
      dataSource={data} //property: DataSource array for list
      //renderItem: (property): Customize list item when using dataSource
      renderItem={(
        item // for each stream/ video/ clip in dataSource
      ) => (
        <List.Item style={{ marginRight: "20px" }}>
          {/* Card: Simple rectangular container. */}
          <Card title={renderCardTitle(item, loggedIn, favs, favOnChange)}>
            {/*再次将cardTitle部分外包出去*/}
            <a
              href={item.url}
              //   item is actually itemEntity type, please refer to backend to see all field: ...url, thumbnail_url...
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "100%", height: "100%" }}
            >
              <img
                alt="Placeholder"
                src={processUrl(item.thumbnail_url)}
                style={{ width: "100%", height: "100%" }}
              />
            </a>
          </Card>
        </List.Item>
      )}
    />
  );
};
//renderStreamGrid:
const renderStreamGrid = (data, loggedIn, favs, favOnChange) => {
  // data: streams/ video/ clips list of your searched or rendered list, favs: favorite stream/ video/ clips itemList
  return (
    // <List /> is a self-closing tag
    <List
      grid={{
        // 针对屏幕不同放的个数不同
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 4,
      }}
      dataSource={data} //property: DataSource array for list
      //renderItem: (property): Customize list item when using dataSource
      renderItem={(
        item // for each stream/ video/ clip in dataSource
      ) => (
        <List.Item style={{ marginRight: "20px" }}>
          {/* Card: Simple rectangular container. */}
          <Card title={renderCardTitle(item, loggedIn, favs, favOnChange)}>
            {/*再次将cardTitle部分外包出去*/}
            <a
              href={`https://www.twitch.tv/${item.broadcaster_name}`}
              //   item is actually itemEntity type, please refer to backend to see all field: ...url, thumbnail_url...
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "100%", height: "100%" }}
            >
              <img
                alt="Placeholder"
                src={processUrl(item.thumbnail_url)}
                style={{ width: "100%", height: "100%" }}
              />
            </a>
          </Card>
        </List.Item>
      )}
    />
  );
};
//renderVideoGrid
const renderVideoGrid = (data, loggedIn, favs, favOnChange) => {
  // data: streams/ video/ clips list of your searched or rendered list, favs: favorite stream/ video/ clips itemList
  return (
    // <List /> is a self-closing tag
    <List
      grid={{
        // 针对屏幕不同放的个数不同
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 4,
      }}
      dataSource={data} //property: DataSource array for list
      //renderItem: (property): Customize list item when using dataSource
      renderItem={(
        item // for each stream/ video/ clip in dataSource
      ) => (
        <List.Item style={{ marginRight: "20px" }}>
          {/* Card: Simple rectangular container. */}
          <Card title={renderCardTitle(item, loggedIn, favs, favOnChange)}>
            {/*再次将cardTitle部分外包出去*/}
            <a
              href={item.url}
              //   item is actually itemEntity type, please refer to backend to see all field: ...url, thumbnail_url...
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "100%", height: "100%" }}
            >
              <Button type="primary">Click to See Video</Button>
            </a>
          </Card>
        </List.Item>
      )}
    />
  );
};

const Home = ({ resources, loggedIn, favoriteItems, favoriteOnChange }) => {
  // props passed from app.js
  const { videos, streams, clips } = resources;
  const {
    // some destructing
    videos: favVideos,
    streams: favStreams,
    clips: favClips,
  } = favoriteItems; // TypeGroupedItemList type, three lists

  return (
    <Tabs defaultActiveKey={tabKeys.Streams}>
      <TabPane tab="Streams" key={tabKeys.Streams} forceRender={true}>
        {renderStreamGrid(streams, loggedIn, favStreams, favoriteOnChange)}{" "}
        {/*将TabPane的部分外包出去, 对应的resource也不一样和favoriteItem也不一样*/}
      </TabPane>
      <TabPane tab="Clips" key={tabKeys.Clips} forceRender={true}>
        {renderClipGrid(clips, loggedIn, favClips, favoriteOnChange)}
      </TabPane>
      <TabPane tab="Videos" key={tabKeys.Videos} forceRender={true}>
        {renderVideoGrid(videos, loggedIn, favVideos, favoriteOnChange)}
      </TabPane>
    </Tabs>
  );
};

export default Home;
