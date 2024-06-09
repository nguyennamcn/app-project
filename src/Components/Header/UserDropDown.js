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
        label: <span>Edit account</span>,
        key: "2",
      },
    ],
    }}
    trigger={['click']}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space> 
        {/* {user.hoTen} */}
        nam
        {/* cái này nhập lại cái id trong của m nha */}
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);
export default UserDropdown;