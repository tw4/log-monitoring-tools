import React, { useCallback, useEffect, useState } from 'react'
import { FileTextOutlined, RiseOutlined, SettingOutlined } from '@ant-design/icons'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import type { MenuItem } from '../types'

const { Content, Footer, Sider } = Layout

interface MainLayoutProps {
  children?: React.ReactNode
  locationKey: string
}

const goTo = (key: React.Key): void => {
  switch (key) {
    case '1':
      window.location.href = '#/'
      break
    case '2':
      window.location.href = '#/logs'
      break
    case '3':
      window.location.href = '#/settings/add-new-path'
      break
    case '4':
      window.location.href = '#/settings/connect-to-db'
      break
    default:
      break
  }
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick: () => goTo(key)
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Dasboard', '1', <RiseOutlined />),
  getItem('Logs', '2', <FileTextOutlined />),
  getItem('Settings', 'sub1', <SettingOutlined />, [
    getItem('Add New Path', '3'),
    getItem('Connect to DB', '4')
  ])
]

export default function MainLayout({ children, locationKey }: MainLayoutProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  useEffect(() => {
    initCollapsed()
  }, [])

  const onChangeCollapsed = (value: boolean): void => {
    setCollapsed(value)
    localStorage.setItem('collapsed', value.toString())
  }

  const initCollapsed = useCallback(() => {
    const col = localStorage.getItem('collapsed')
    if (col) {
      setCollapsed(col === 'true')
    }
    setIsLoading(true)
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isLoading && (
        <>
          <Sider collapsible collapsed={collapsed} onCollapse={(value) => onChangeCollapsed(value)}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" selectedKeys={[locationKey]} mode="inline" items={items} />
          </Sider>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>{location.hash}</Breadcrumb.Item>
              </Breadcrumb>
              <div
                style={{
                  padding: 24,
                  minHeight: '100%',
                  maxWidth: '100%',
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG
                }}
              >
                {children}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Created by tw4 (Mert)</Footer>
          </Layout>
        </>
      )}
    </Layout>
  )
}
