import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { Navigate, NavLink } from 'react-router-dom';
import ServiceModal from './ServiceModal';
import PolicyModal from './PolicyModal';
import ShopModal from './ShopModal';
import SystemModal from './SystemModal';
import "./login.css";
import { adornicaServ } from '../../service/adornicaServ';

const FogotpassLogin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [serviceModalVisible, setServiceModalVisible] = useState(false);
    const [policyModalVisible, setPolicyModalVisible] = useState(false);
    const [shopModalVisible, setShopModalVisible] = useState(false);
    const [systemModalVisible, setSystemModalVisible] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [showResend, setShowResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(null);
    const [emailNv, setEmailNv] = useState();
    const [otp, setOtp] = useState('');
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const showModal = (title, message) => {
        setModalTitle(title);
        setModalMessage(message);
        setIsModalVisible(true);
        setTimeout(() => setIsModalVisible(false), 2000);
    };

    const onFinish = (email) => {
        console.log('Success:', email);
        adornicaServ.fogotPass(email)
            .then((res) => {
                message.success("Gửi thành công");
                setIsButtonDisabled(true); // Disable "Gửi" button
                setShowResend(true); // Show "Gửi lại" button
                startResendTimer(); // Start resend timer
                setIsOtpModalVisible(true); // Show OTP modal
            })
            .catch((err) => {
                const errorMetadata = err.response.data.metadata.message;
                showModal(<center><h1>Gửi thất bại</h1></center>, <center className='notice__content'><i className="error__icon fa-solid fa-circle-xmark"></i><h1 style={{ color: 'red' }}>{mapVn(errorMetadata)}</h1></center>);
                console.log(err.response.data.metadata.message);
            });
        setEmailNv(email);
    };

    const resend = () => {
        console.log('Resend:', emailNv);
        adornicaServ.fogotPass(emailNv)
            .then((res) => {
                message.success("Gửi thành công");
                setIsButtonDisabled(true); // Disable "Gửi" button
                setShowResend(true); // Show "Gửi lại" button
                startResendTimer(); // Start resend timer
            })
            .catch((err) => {
                const errorMetadata = err.response.data.metadata.message;
                showModal(<center><h1>Gửi thất bại</h1></center>, <center className='notice__content'><i className="error__icon fa-solid fa-circle-xmark"></i><h1 style={{ color: 'red' }}>{mapVn(errorMetadata)}</h1></center>);
                console.log(err.response.data.metadata.message);
            });
    };

    const handleOtpSubmit = () => {
        const data = {
            email: emailNv.email,
            otpCode: otp,
        };
        adornicaServ.confimOtp(data)
            .then((res) => {
                console.log(res);
                setOtp('');
                setIsOtpModalVisible(false);
                setIsResetPasswordModalVisible(true); // Show reset password modal
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlePasswordReset = () => {
        if (newPassword !== confirmPassword) {
            message.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }
        const data = {
            email: emailNv.email,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        };
        adornicaServ.resetPass(data)
            .then((res) => {
                message.success("Mật khẩu đã được thay đổi thành công.");
                setIsResetPasswordModalVisible(false);
            })
            .catch((err) => {
                console.log(err);
                message.error("Có lỗi xảy ra khi thay đổi mật khẩu.");
            });
    };

    const startResendTimer = () => {
        if (resendTimer) {
            clearTimeout(resendTimer);
        }
        const timer = setTimeout(() => {
            setShowResend(false);
            setIsButtonDisabled(false); // Re-enable "Gửi" button
        }, 5 * 60 * 1000); // 5 minutes in milliseconds
        setResendTimer(timer);
    };

    const mapVn = (role) => {
        switch (role) {
            case 'Can not find account with mail.':
                return 'Không tìm thấy email.';
            default:
                return role;
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <div className="header__login">
                <div className="header__login__left">
                    <div className='img__login1'></div>
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
                        <NavLink
                            style={{
                                position: 'absolute',
                                bottom: '0px',
                                right: '30px',
                                textDecoration: 'none'
                            }}
                            to={'/login'}>
                            Về trang đăng nhập
                        </NavLink>
                        <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                            <h1 className='mb-2 '>Quên mật khẩu</h1>
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
                                    label="Email nhân viên"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Hãy nhập email nhân viên của bạn!' },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item className="flex justify-center" wrapperCol={{ span: 24 }}>
                                    <Button
                                        className="bg-black text-yellow-600 hover:text-white hover:border-hidden"
                                        htmlType="submit"
                                        disabled={isButtonDisabled} // Disable "Gửi" button
                                    >
                                        Gửi
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

            <Modal
                title="Xác nhận OTP"
                visible={isOtpModalVisible}
                onCancel={() => setIsOtpModalVisible(false)}
                footer={[
                    <Button onClick={resend}>Gửi lại</Button>,
                    <Button key="submit" type="primary" onClick={handleOtpSubmit}>Xác nhận</Button>,
                    <Button key="cancel" onClick={() => setIsOtpModalVisible(false)}>Hủy</Button>,
                ]}
            >
                <Form layout="vertical" onFinish={handleOtpSubmit} autoComplete="off">
                    <input
                        style={{ padding: '10px', margin: '10px' }}
                        type="text" name='email' value={emailNv?.email} readOnly />
                    <Form.Item
                        label="Mã OTP"
                        name="otp"
                        rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
                    >
                        <Input onChange={(e) => setOtp(e.target.value)} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Đặt lại mật khẩu"
                visible={isResetPasswordModalVisible}
                onCancel={() => setIsResetPasswordModalVisible(false)}
                footer={[
                    <Button key="submit" type="primary" onClick={handlePasswordReset}>Xác nhận</Button>,
                    <Button key="cancel" onClick={() => setIsResetPasswordModalVisible(false)}>Hủy</Button>,
                ]}
            >
                <Form layout="vertical" onFinish={handlePasswordReset} autoComplete="off">
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                    >
                        <Input.Password onChange={(e) => setNewPassword(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                    >
                        <Input.Password onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Item>
                </Form>
                <h1>{emailNv?.email}</h1>
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

export default FogotpassLogin;
