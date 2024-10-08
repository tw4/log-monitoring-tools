import { Alert, Button, Flex, Input, Rate, Table, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { FolderOutlined } from '@ant-design/icons'
import type { Path } from '../../types'

export default function AddNewPath(): JSX.Element {
  const [paths, setPaths] = useState<Path[]>([])
  const [serverName, setServerName] = useState<string>('')
  const [newPath, setNewPath] = useState<string>('')
  const [alertIsVisible, setAlertIsVisible] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')

  useEffect(() => {
    const paths = localStorage.getItem('paths')
    const data: Path[] = paths ? JSON.parse(paths) : []
    setPaths(data)
  }, [newPath, serverName])

  const addPath = (): void => {
    const p2 = localStorage.getItem('paths')
    if (!serverName || !newPath) {
      setAlertMessage('Please enter a valid path and server name.')
      setAlertIsVisible(true)
      return
    }

    if (p2) {
      const p = JSON.parse(p2)
      const isPathExist = p.find((path: Path) => path.path === newPath)
      if (isPathExist) {
        setAlertMessage('Path already exists.')
        setAlertIsVisible(true)
        return
      }
    }

    if (!newPath) return
    const newPaths = [
      ...paths,
      {
        path: newPath,
        lastOpened: null,
        createdAt: new Date().toISOString(),
        serverName: serverName,
        favoritePath: false
      }
    ]
    localStorage.setItem('paths', JSON.stringify(newPaths))
    setNewPath('')
    setServerName('')
  }

  const deletePath = (index: number): void => {
    const newPaths = paths.filter((_, i) => i !== index)
    localStorage.setItem('paths', JSON.stringify(newPaths))
    setPaths(newPaths)
  }

  const favoritePath = (index: number): void => {
    const newPaths = paths.map((path, i) => {
      if (i === index) {
        return {
          ...path,
          favorite: !path.favorite
        }
      }
      return path
    })
    localStorage.setItem('paths', JSON.stringify(newPaths))
    setPaths(newPaths)
  }

  // table columns for paths table
  const columns = [
    {
      title: '',
      dataIndex: 'icon',
      key: 'icon'
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'ath'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Server Name',
      dataIndex: 'serverName',
      key: 'serverName'
    },
    {
      title: 'Favorite',
      dataIndex: 'favorite',
      key: 'favorite'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action'
    }
  ]

  return (
    <>
      {alertIsVisible && (
        <Alert
          message={alertMessage}
          type="error"
          showIcon
          closable
          onClose={() => setAlertIsVisible(false)}
        />
      )}
      <Flex gap="small" style={{ marginTop: '20px' }}>
        <Input
          placeholder="Enter a new path"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
        />
        <Input
          placeholder="Enter a server name"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
        />
        <Button type="primary" onClick={addPath}>
          {' '}
          Add{' '}
        </Button>
      </Flex>
      {/* Paths Table */}
      <Table
        style={{ marginTop: '20px' }}
        dataSource={paths.map((path, index) => ({
          icon: <FolderOutlined />,
          key: index,
          path: (
            <Tooltip title={path.path}>
              {' '}
              <Tag color="blue">{path.path.slice(0, 20)}</Tag>
            </Tooltip>
          ),
          serverName: path.serverName,
          createdAt: new Date(path.createdAt).toLocaleString(),
          favorite: (
            <Rate onChange={() => favoritePath(index)} count={1} value={path.favorite ? 1 : 0} />
          ),
          action: (
            <Button onClick={() => deletePath(index)} type="text" danger>
              Delete
            </Button>
          )
        }))}
        columns={columns}
      />
    </>
  )
}
