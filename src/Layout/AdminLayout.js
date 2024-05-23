import { PieChartOutlined, DesktopOutlined} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { localService } from '../service/localService';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem(<NavLink to="/admin-user">Users</NavLink>, '1', <PieChartOutlined />),
  getItem(<NavLink to="/admin-movie">Movies</NavLink>, '2', <DesktopOutlined />),
];
const AdminLayout = ( {Component}) => {
  const [collapsed, setCollapsed] = useState(false);
  // kiểm tra user có phải admin
  useEffect(()=>{
    // nếu null hoặc obj có key mã loại người dùng là khách hàng thì out ra login
    if(localService.get()?.maLoaiNguoiDung!=="QuanTri"){
      window.location.href ="/login";
    }
     
  },[]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {/* Bill is a cat. */}
            <Component />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;