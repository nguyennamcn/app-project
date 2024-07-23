import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { adornicaServ } from '../../service/adornicaServ';
import { Button, Input, Modal, Space } from 'antd';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

export default function FogotPass() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            currentPassword,
        };
            adornicaServ.changePasswork(data)
            .then(response => {
                console.log(response)
                setModalContent(<div className='notice__content'>   <h1>Gửi thành công</h1></div>);
            })
            .catch(error => {
                const err = error.response.data.metadata.message
                console.log(err)
                console.error("There was an error sending the order:", error);
                setModalContent(<div className='notice__content'>   <h1>{mapVn(err)}</h1></div>);
            });
            setIsModalOpen(true);
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
                <h2><strong>Quên mật khẩu</strong></h2>
                <form onSubmit={handleSubmit}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div className="form-group">
                            <label htmlFor="currentPassword"></label>
                            <Input
                                style={{
                                    padding: '15px',
                                    borderRadius: '15px',
                                    fontSize: '16px'
                                }}
                                placeholder={`Nhập email nhân viên`}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                    </Space>
                    <Button

                        type="primary"
                        htmlType="submit"
                        style={{ marginTop: '30px', width: '100%' }}
                        disabled={!!error}
                    >
                        Gửi
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
