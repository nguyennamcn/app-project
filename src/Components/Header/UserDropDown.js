import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const UserDropdown = ({user,logoutBtn}) => (
    
  <Dropdown
    menu={{
      items: [{
        label:logoutBtn,
        key:"1",
      },
      {
        label: <span>Cập nhật tài khoản</span>,
        key: "2",
      },
    ],
    }}
    trigger={['click']}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space> 
        {user.hoTen}
        {/* cái này nhập lại cái id trong của m nha */}
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);
export default UserDropdown;