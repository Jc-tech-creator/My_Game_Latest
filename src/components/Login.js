import { Button, Form, Input, message, Modal } from "antd";
import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { login } from "../utils";

function Login({ onSuccess }) {
  const [displayModal, setDisplayModal] = useState(false);

  const handleCancel = () => {
    setDisplayModal(false);
  };

  const signinOnClick = () => {
    setDisplayModal(true);
  };

  const onFinish = (data) => {
    // call the login() and close the modal
    login(data)
      .then(() => {
        setDisplayModal(false);
        message.success(`Welcome back`);
        onSuccess(); // here the onSuccess() is the props passed from PageHeader's signinOnSuccess which is also props passed from App.js
        // This, when you submit that form in Login.js, we call onSuccess() here, it will call the signinOnSuccess function on first layer in App.js
        //and it change the app.js 's state of LoggedIn state to true, and also call the getFavorite() api and call the setFavorites function to change state of favoriteItems to the fetched data
        // those changed states in app.js would cause app.js to rerender, amonge thoese changes, the changed loggedIn state passed to PageHeader and thus the page appearance changed:
        // there would be logout section and favorite section on header, but without login and register section.
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  return (
    <>
      <Button
        shape="round"
        onClick={signinOnClick}
        style={{ marginRight: "20px" }}
      >
        Login
      </Button>
      <Modal
        title="Log in"
        visible={displayModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Form name="normal_login" onFinish={onFinish} preserve={false}>
          {/* onFinsih: Trigger after submitting the form and verifying data successfully */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Login;
