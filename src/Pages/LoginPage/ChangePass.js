import React, { useEffect, useState } from 'react';
import './ChangePass.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Space, Input, Button, Modal } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { adornicaServ } from '../../service/adornicaServ';

export default function ChangePass() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('')

    const userInfo = useSelector((state) => state.userReducer.userInfo);

    // Hàm kiểm tra mật khẩu mới
    const validateNewPassword = (password) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return 'Mật khẩu mới phải có tối thiểu 6 ký tự và bao gồm cả chữ cái và số.';
        }
        return '';
    };

    // Hàm kiểm tra xác nhận mật khẩu mới
    const validateConfirmPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return 'Mật khẩu xác nhận không khớp.';
        }
        return '';
    };

    // Hàm xử lý thay đổi mật khẩu
    const handleNewPasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        const error = validateNewPassword(password) || validateConfirmPassword(password, confirmNewPassword);
        setError(error);
    };

    // Hàm xử lý thay đổi xác nhận mật khẩu
    const handleConfirmNewPasswordChange = (e) => {
        const confirmPassword = e.target.value;
        setConfirmNewPassword(confirmPassword);
        const error = validateNewPassword(newPassword) || validateConfirmPassword(newPassword, confirmPassword);
        setError(error);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            id: userInfo.id, // Pass the user ID or appropriate identifier
            oldPassword: currentPassword,
            newPassword,
            confirmNewPassword
        };
        if (!error) {
            adornicaServ.changePasswork(data)
            .then(response => {
                console.log(response)
                setModalContent(<div className='notice__content'>   <h1>Đổi mật khẩu thành công</h1></div>);
                window.location.reload();  // Reload the page after successful order
            })
            .catch(error => {
                const err = error.response.data.metadata.message
                console.log(err)
                console.error("There was an error sending the order:", error);
                setModalContent(<div className='notice__content'>   <h1>{mapVn(err)}</h1></div>);
            });
            setIsModalOpen(true);
        } else {
            // Hiển thị modal thông báo lỗi
            setModalContent(error);
            setIsModalOpen(true);
        }
    };

    const getCurrentDate = () => {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const mapVn = (role) =>{
        switch(role) {
            case 'Current password is invalid':
                return 'Mật khẩu hiện tại không đúng'
        }
    }

    return (
        <>
            <div className="change-pass-container">
                <h1>Chào mừng : {userInfo.name}</h1>
                <h2><strong>Đổi mật khẩu</strong></h2>
                <div className="span-text">
                    Mật khẩu của bạn phải có tối thiểu 8 ký tự và chỉ gồm chữ cái.
                </div>
                <form onSubmit={handleSubmit}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div className="form-group">
                            <label htmlFor="currentPassword"></label>
                            <Input.Password
                                style={{
                                    padding: '15px',
                                    borderRadius: '15px',
                                    fontSize: '16px'
                                }}
                                placeholder={`Mật khẩu hiện tại (${getCurrentDate()})`}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword"></label>
                            <Input.Password
                                style={{
                                    padding: '15px',
                                    borderRadius: '15px',
                                    fontSize: '16px'
                                }}
                                placeholder='Mật khẩu mới'
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword"></label>
                            <Input.Password
                                style={{
                                    padding: '15px',
                                    borderRadius: '15px',
                                    fontSize: '16px'
                                }}
                                placeholder='Nhập lại mật khẩu mới'
                                value={confirmNewPassword}
                                onChange={handleConfirmNewPasswordChange}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                required
                            />
                        </div>
                    </Space>
                    {error && <p className="error">{error}</p>}
                    <Button

                        type="primary"
                        htmlType="submit"
                        style={{ marginTop: '30px', width: '100%' }}
                        disabled={!!error}
                    >
                        Đổi mật khẩu
                    </Button>
                </form>
            </div>
            <Modal
                title={error ? 'Lỗi' : ''}
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
            >
                <p>{modalContent}</p>
            </Modal>
        </>
    );
}
