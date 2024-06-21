import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useNavigate  } from 'react-router-dom';

const UserDropdown = ({ user, logoutBtn }) => {
  const navigate = useNavigate();

  const menuStyle = {
    background: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    borderRadius: '4px',
    padding: '8px',
    position: 'relative',
    zIndex: 1000,
  };

  const itemStyle = {
    padding: '0px',
    cursor: 'pointer',
    width: '100%',
    textAlign:'center',
  };

  const itemHoverStyle = {
    backgroundColor: '#ccc',
  };

  return (
    <Dropdown
      overlay={(
        <div style={menuStyle}>
          <div 
            style={itemStyle} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = itemHoverStyle.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {logoutBtn}
          </div>
          <div 
            style={itemStyle} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = itemHoverStyle.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <button onClick={() => navigate('/profile')} style={{width:'120px',height:'32px',}}>Edit Profile</button>
          </div>
        </div>
      )}
      trigger={['click']}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          {user.name}
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default UserDropdown;
