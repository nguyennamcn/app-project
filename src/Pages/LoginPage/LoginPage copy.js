import React, { useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { userService } from '../../service/userService';
import { localService } from '../../service/localService';
import { NavLink, useNavigate } from 'react-router-dom';
import { setLoginAction } from '../../redux/action/userAction';
import { useDispatch } from 'react-redux';
import ServiceModal from './ServiceModal';
import PolicyModal from './PolicyModal';
import ShopModal from './ShopModal';
import SystemModal from './SystemModal';
import "./login.css"

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [shopModalVisible, setShopModalVisible] = useState(false);
  const [systemModalVisible, setSystemModalVisible] = useState(false);

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsModalVisible(true);
    setTimeout(() => setIsModalVisible(false), 2000);
  };

  const onFinish = (values) => {
    console.log('Success:', values);
    userService.postLogin(values)
      .then((res) => {
        message.success("Login successfully");
        localService.set(res.data.metadata);
        dispatch(setLoginAction(res.data.metadata));
        if (res.data.metadata.role !== 'admin')
          navigate("/homePage");
        else
          navigate('/adminPage');
        console.log(res);
      })
      .catch((err) => {
        const errorMetadata = err.response.data.metadata;
        const errorMessage = errorMetadata?.message || "An error occurred";
        const errorCode = errorMetadata?.code || "Unknown error code";
        showModal("Login Failed", <div className='notice__content'><i className="error__icon fa-solid fa-circle-xmark" ></i><h1 style={{ color: 'red' }}>Error: {errorMessage} (Code: {errorCode})</h1></div>);
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <div className="header__login">
        <div className="header__login__left">
          <div className='img__login1'>
            {/* img */}
          </div>
        </div>
        <div className="header__login__right_login">
          <NavLink style={{ textDecoration: 'none' }} onClick={() => setServiceModalVisible(true)}>Dịch vụ</NavLink>
          <NavLink style={{ textDecoration: 'none' }} onClick={() => setPolicyModalVisible(true)}>Chính sách</NavLink>
          <NavLink style={{ textDecoration: 'none' }} onClick={() => setShopModalVisible(true)}>Cửa hàng</NavLink>
          <NavLink style={{ textDecoration: 'none' }} onClick={() => setSystemModalVisible(true)}>Hệ thống</NavLink>
        </div>
        <Button className="sidebar-toggle" onClick={() => setIsSidebarVisible(true)}>☰</Button>
      </div>
      <div className="login-form container">
        <div className="row">
          <div className="col-lg-8 ">
            <div className="login-img">
              <div className="img__login2"></div>
            </div>
          </div>
          <div className="login-input col-lg-4">
            <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              <h1 className='mb-2 '>ĐĂNG NHẬP</h1>
            </div>
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
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: 'Hãy nhập số điện thoại của bạn!' },
                    { pattern: /^[0-9]+$/, message: 'Vui lòng nhập số!' },
                    { max: 10, message: 'Nhập tối đa 10 chữ số!' }
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu !' }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item className="flex justify-center" wrapperCol={{ span: 24 }}>
                  <Button className="bg-black text-yellow-600 hover:text-white hover:border-hidden" htmlType="submit">
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
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

      <ServiceModal isOpen={serviceModalVisible} onClose={() => setServiceModalVisible(false)} />
      <PolicyModal isOpen={policyModalVisible} onClose={() => setPolicyModalVisible(false)} />
      <ShopModal isOpen={shopModalVisible} onClose={() => setShopModalVisible(false)} />
      <SystemModal isOpen={systemModalVisible} onClose={() => setSystemModalVisible(false)} />

      {isSidebarVisible && (
        <div className="sidebar">
          <button className="close-btn" onClick={() => setIsSidebarVisible(false)}>×</button>
          <NavLink style={{ textDecoration: 'none' }} onClick={() => { setIsSidebarVisible(false); setServiceModalVisible(true); }}>Dịch vụ</NavLink>
          <NavLink style={{ textDecoration: 'none' }} onClick={() => { setIsSidebarVisible(false); setPolicyModalVisible(true); }}>Chính sách</NavLink>
          <NavLink style={{ textDecoration: 'none' }} onClick={() => { setIsSidebarVisible(false); setShopModalVisible(true); }}>Cửa hàng</NavLink>
          <NavLink style={{ textDecoration: 'none' }} onClick={() => { setIsSidebarVisible(false); setSystemModalVisible(true); }}>Hệ thống</NavLink>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
