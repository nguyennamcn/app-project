import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { userService } from '../../service/userService';
import { localService } from '../../service/localService';
import { NavLink, useNavigate } from 'react-router-dom';
import { setLoginAction, setLoginActionService } from '../../redux/action/userAction';
import { useDispatch } from 'react-redux';
import { setUserLogin } from '../../toolkit/userSlice';
import "./login.css"


const LoginPage = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsModalVisible(true);
    setTimeout(() => setIsModalVisible(false), 2000);
  };

  //redux thường
  const onFinish = (values: any) => {
    console.log('Success:', values);
    userService.postLogin(values)
      .then((res) => {
        message.success("login successfully");
        // lưu thông tin user vào localStorage
        localService.set(res.data.metadata);
        dispatch(setLoginAction(
          res.data.metadata
        ));
        // chuyển hướng user tới trang chủ
        if(res.data.metadata.role != 'admin')
          navigate("/homePage");
        else
          navigate('/adminPage');
        console.log(res);
      })
      .catch((err) => {
        // Extract message and code from error response
        const errorMetadata = err.response.data.metadata;
        const errorMessage = errorMetadata?.message || "An error occurred";
        const errorCode = errorMetadata?.code || "Unknown error code";
        showModal("Login Failed",<div className='notice__content'><i class="error__icon fa-solid fa-circle-xmark" ></i><h1 style={{color:'red'}}>Error: {errorMessage} (Code: {errorCode})</h1></div>);

        console.log(err);
      })
  };
  // end redux thường

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);

  };
  return (
    <div class="">
      <div class="header__login">
        <div className="header__login__left">
          <div class='img__login1'>
            {/* img */}
          </div>
        </div>
        <div class="header__login__right">
          <NavLink style={{ textDecoration: 'none' }} >Service</NavLink>
          <NavLink style={{ textDecoration: 'none' }} >Policy</NavLink>
          <NavLink style={{ textDecoration: 'none' }} >Shop</NavLink>
          <NavLink style={{ textDecoration: 'none' }} >About system</NavLink>
        </div>
      </div>
      <div class="login-form container">
        <div className="row">
          <div className="col-lg-8 ">
            <div className="login-img">
              <div className="img__login2"></div>
            </div>
          </div>
          <div className="login-input col-lg-4">
            <div className='flex justify-between'>
              <h1 className='mb-2 '>LOGIN</h1>
            </div>
            <div class="">
              <div className="">
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 24 }}
                  style={{ width: "100%" }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Form.Item
                    label="PhoneNumber"
                    name="phone"
                    rules={[
                      { required: true, message: 'Please input your phone number!' },
                      { pattern: /^[0-9]+$/, message: 'Phone number must be digits only!' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item className="flex justify-center" wrapperCol={{ span: 24 }}>
                    <Button className="bg-black text-yellow-600 hover:text-white hover:border-hidden" htmlType="submit">
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        className="custom-modal"
      >
        <div>{modalMessage}</div>
      </Modal>
    </div>  
      );
}

      export default LoginPage;