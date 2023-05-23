import { Layout, Row, Col, Button } from "antd";
import Favorites from "./Favorites";
import Register from "./Register";
import Login from "./Login";
import React from "react";

const { Header } = Layout;

function PageHeader({
  // loggedIn and favoriteItems are simply parent's state, signInOnSuccess and SignoutOnClick are callback function
  loggedIn,
  signoutOnClick,
  signinOnSuccess,
  favoriteItems,
}) {
  return (
    <Header>
      <Row justify="space-between">
        {/* justify:  items are evenly distributed in the line, row col tag is to make one row with several cols */}
        <Col>{loggedIn && <Favorites favoriteItems={favoriteItems} />}</Col>
        <Col>
          {/*Those LoggedIn && is to make sure when loggedIn == true, show 'Favorites' section and Logout section*/}
          {loggedIn && (
            <Button shape="round" onClick={signoutOnClick}>
              {/*This actually call this callback function passed from app.js, call logout() and loggedIn = false and parent rerender*/}
              Logout
            </Button>
          )}
          {!loggedIn && ( //when LoggedIn is false we return Login and Register
            <>
              <Login onSuccess={signinOnSuccess} />
              <Register />
            </>
            //   here the onSuccess() is the props passed from PageHeader's signinOnSuccess which is also props passed from App.js
            // This, when you submit that form in Login.js, we call onSuccess() here, it will call the signinOnSuccess callback function on first layer in App.js
            // and it change the app.js 's state of LoggedIn state to true, and also call the getFavorite() api and call the setFavorites function to change state of favoriteItems to the fetched data
            // those changed states in app.js would cause app.js to rerender, amonge thoese changes, the changed loggedIn state passed to PageHeader and thus the page appearance changed:
            // there would be logout section and favorite section on header, but without login and register section.
          )}
        </Col>
      </Row>
    </Header>
  );
}

export default PageHeader;
