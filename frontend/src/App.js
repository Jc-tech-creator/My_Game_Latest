import React, { useState, useEffect } from "react";
import { Layout, message, Menu } from "antd";
import { LikeOutlined, FireOutlined } from "@ant-design/icons";
import {
  logout,
  getFavoriteItem,
  getTopGames,
  searchGameById,
  getRecommendations,
} from "./utils";
import PageHeader from "./components/PageHeader";
import CustomSearch from "./components/CustomSearch";
import Home from "./components/Home";

const { Header, Content, Sider } = Layout;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]); // the initial state is empty array
  const [topGames, setTopGames] = useState([]); // the initial state is empty array
  const [resources, setResources] = useState({
    videos: [],
    streams: [],
    clips: [],
  });

  useEffect(() => {
    // useEffect is called each time after render, return first open app.js, we already got top games
    getTopGames()
      .then((data) => {
        setTopGames(data);
        message.info('Please register and login first!');
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, []); // [] means only show the original state

  const signinOnSuccess = () => {
    setLoggedIn(true);
    getFavoriteItem().then((data) => {
      setFavoriteItems(data); //  first get data through api from utils.js, then use the data to setState of favoritesItem
    });
  };

  const signoutOnClick = () => {
    logout()
      .then(() => {
        setLoggedIn(false);
        message.success("Successfully Signed out");
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const customSearchOnSuccess = (data) => {
    setResources(data);
  };

  const onGameSelect = ({ key }) => {
    if (key === "recommendation") {
      // when the selected menu item's key === recommendation
      getRecommendations().then((data) => {
        // call the getRecommendation() api;
        setResources(data);
      });
      return;
    }

    searchGameById(key).then((data) => {
      setResources(data); // if selected other menu items, we just call the setResource()
    });
  };

  const favoriteOnChange = () => {
    // when Home.js delete or add favorite items, home.js call 'favoriteOnChange', we fetcch current favorites items again , and
    getFavoriteItem()
      .then((data) => {
        setFavoriteItems(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const mapTopGamesToProps = (topGames) => [
    {
      label: "Recommend for you!",
      key: "recommendation",
      icon: <LikeOutlined />,
    },
    {
      label: "Popular Games",
      key: "popular_games",
      icon: <FireOutlined />,
      children: topGames.map((game) => ({
        label: game.name,
        key: game.id,
        icon: (
          <img
            alt="placeholder"
            src={game.box_art_url
              .replace("{height}", "40") //{box_art_url: "https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg"
              .replace("{width}", "40")}
            style={{ borderRadius: "50%", marginRight: "20px" }}
          />
        ),
      })),
    },
  ];

  return (
    <Layout>
      <Header>
        <PageHeader
          loggedIn={loggedIn}
          signoutOnClick={signoutOnClick}
          signinOnSuccess={signinOnSuccess}
          favoriteItems={favoriteItems}
          // here the onSuccess() is the props passed from PageHeader's signinOnSuccess which is also props passed from App.js
          // This, when you submit that form in Login.js, we call onSuccess() here, it will call the signinOnSuccess function on first layer in App.js
          //and it change the app.js 's state of LoggedIn state to true, and also call the getFavorite() api and call the setFavorites function to change state of favoriteItems to the fetched data
          // those changed states in app.js would cause app.js to rerender, amonge thoese changes, the changed loggedIn state passed to PageHeader and thus the page appearance changed:
          // there would be logout section and favorite section on header, but without login and register section.
        />
      </Header>
      <Layout>
        <Sider width={300} className="site-layout-background">
          <CustomSearch onSuccess={customSearchOnSuccess} />
          <Menu
            mode="inline"
            onSelect={onGameSelect} // 选中了其中一项
            style={{ marginTop: "10px" }}
            items={mapTopGamesToProps(topGames)} // items propery of menu takes ItemType[] array
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              height: 800,
              overflow: "auto",
            }}
          >
            <Home
              resources={resources} // home will receive 4 props: 1. resources: three list <Streams><Video><Clips>
              loggedIn={loggedIn} // loggedIn state from app
              favoriteOnChange={favoriteOnChange} // a callback function of favoriteOnChange, it will reset favoriteItems state in app.js
              favoriteItems={favoriteItems} // pass favoriteItems state in app to home
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
