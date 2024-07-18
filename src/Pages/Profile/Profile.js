import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { Input, Button, DatePicker, Modal, notification } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import './Profile.css';
import Spinner from '../../Components/Spinner/Spinner';

export default function EditEmployee() {
  let userInfo = useSelector((state) => state.userReducer.userInfo);

  const [profile, setProfile] = useState({});
  const [fileAvatar, setFileAvatar] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    adornicaServ.getProfile(userInfo.id)
      .then((res) => {
        console.log(res.data.metadata);
        setProfile(res.data.metadata);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Đánh dấu đã tải xong
      });
  }, [userInfo.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && (!/^\d*$/.test(value) || value.length > 10)) {
      notification.error({ message: 'Vui lòng nhập số (tối đa 10 chữ số)' });
      return;
    }
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const data = {
      id: userInfo.id,
      email: profile.email,
      phone: profile.phone,
      name: profile.name,
      gender: profile.gender,
      birthday: profile.birthday,
      avatar: profile.avatar,
      address: profile.address,
      roleUser: profile.roleUser
    };

    const updateAvatar = fileAvatar ? adornicaServ.postImg(userInfo.id, fileAvatar)
      .then((res) => {
        notification.success({ message: 'Cập nhật ảnh đại diện thành công!' });
      })
      .catch((err) => {
        console.log(err);
        notification.error({ message: 'Cập nhật thất bại ! Vui lòng thử lại' });
      }) : Promise.resolve();

    updateAvatar.finally(() => {
      adornicaServ.postUserUpdate(userInfo.id, data)
        .then((res) => {
          setProfile(data);
          notification.success({ message: 'Cập nhật hồ sơ thành công!' });
        })
        .catch((err) => {
          console.log(err);
          notification.error({ message: 'Cập nhật thất bại ! Vui lòng thử lại' });
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showAvatar = () => {
    setIsAvatarVisible(true);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) :(
        <div className="profile-container">
      <h1 className="profile-title">Hồ sơ</h1>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image" onClick={showModal}>
            <label className="profile-placeholder">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="avatar" />
              ) : (
                '+'
              )}
            </label>
          </div>
          <div className="profile-info">
            <Input className="input-field" placeholder="Họ và tên" name="name" value={profile.name} disabled />
            <Input className="input-field" placeholder="Số điện thoại" name="phone" value={profile.phone} onChange={handleChange} />
            <Input className="input-field" placeholder="Email" name="email" value={profile.email} onChange={handleChange} />
            <Input className="input-field" placeholder="Giới tính" name="gender" value={profile.gender} disabled />
            <Input className="input-field" placeholder="Địa chỉ" name="address" value={profile.address} onChange={handleChange} />
            <DatePicker
              className="input-field"
              placeholder="Ngày sinh"
              value={profile.birthday ? moment(profile.birthday) : null}
              disabled
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <hr />
        <div className="profile-details">
          <div className="work-info-row">
            <div className="work-info-item">
              <h3>Chức vụ : </h3>
              <Input className="input-field" value={profile.roleUser} disabled />
            </div>
          </div>
        </div>
        <hr />
        <div className="profile-actions">
          <Button type="primary" className="nav-button" onClick={handleSubmit} loading={loading}>
            Lưu
          </Button>
        </div>
      </div>
      <Modal
        visible={isModalVisible}
        footer={null}
        mask={false}
        closable={false}
        onCancel={() => setIsModalVisible(false)}
        className='modal__avatar'
      >
        <div className='modal__content' onClick={showAvatar} style={{ marginTop: '2px', marginBottom: '4px' }}>
          Xem ảnh đại diện
        </div>
        <div className='modal__content'>
          <label htmlFor="avatar-upload" className='change__avatar__modal'> Đổi ảnh đại diện </label>
          <input
            id="avatar-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
      </Modal>

      <Modal
        visible={isAvatarVisible}
        footer={null}
        mask={false}
        closable={false}
        onCancel={() => setIsAvatarVisible(false)}
        className='show__avatar'
      >
        <div>
          {profile.avatar ? (
            <img src={profile.avatar} alt="Avatar" className="avatar" />
          ) : (
            '+'
          )}
        </div>
      </Modal>
    </div>
      )
    }
</>
    
  );
}