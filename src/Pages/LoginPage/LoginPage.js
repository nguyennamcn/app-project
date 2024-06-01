import React from 'react';
import { Button, Form, Input, message } from 'antd';
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
        message.error("login failed");
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
          <a style={{textDecoration: 'none'}} href="#">Service</a>
          <a style={{textDecoration: 'none'}} href="#">Policy</a>
          <a style={{textDecoration: 'none'}} href="#">Shop</a>
          <a style={{textDecoration: 'none'}} href="#">About system</a>
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
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
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
    </div>  
      );
}

      export default LoginPage;