import { Col, Flex, Row, Statistic, Table, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { FolderOutlined } from '@ant-design/icons'
import type { Path, Statistics } from '../types'
import { LoadingOutlined } from '@ant-design/icons'

// table columns for last opened paths
const columns = [
  {
    title: '',
    dataIndex: 'icon',
    key: 'icon'
  },
  {
    title: 'Path',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: 'Server Name',
    dataIndex: 'serverName',
    key: 'serverName'
  },
  {
    title: 'Last Opened',
    dataIndex: 'lastOpened',
    key: 'lastOpened'
  }
]

export default function Home(): JSX.Element {
  const [totalPathsCount, setTotalPathsCount] = useState<number>(0)
  const [Paths, setPaths] = useState<Path[]>([])
  const [statistics, setStatistics] = useState<Statistics>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const paths = localStorage.getItem('paths')
    if (paths) {
      const pathsArray = JSON.parse(paths)
      setTotalPathsCount(pathsArray.length)

      // get paths
      const data: Path[] = paths ? JSON.parse(paths) : []
      setPaths(data)

      // get statistics
      getStactistics(data)

      // set loading to false
      setLoading(false)
    }
  }, [])

  // get statistics for paths from main process
  const getStactistics = (paths: Path[]): void => {
    window.electron.ipcRenderer.invoke('get-statistics', paths).then((statistics: Statistics) => {
      setStatistics(statistics)
    })
  }

  return (
    <>
      {loading ? (
        <Flex vertical>
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        </Flex>
      ) : (
        <Row>
          <Col span={12}>
            <Statistic title="Total Paths" value={totalPathsCount} />
          </Col>
          <Col span={12}>
            <Statistic title="Total Folders" value={statistics?.totalFolders} />
          </Col>
          <Col span={12}>
            <Statistic title="Total Files" value={statistics?.totalFileinFolders} />
          </Col>
          <Col span={12}>
            <Statistic title="Total Size" value={statistics?.totalFoldersSize} />
          </Col>
        </Row>
      )}
      {/* Last Opened Paths */}
      <Table
        style={{ marginTop: '20px' }}
        dataSource={Paths.map((path, index) => ({
          icon: <FolderOutlined />,
          key: index,
          path: (
            <Tooltip title={path.path}>
              <Tag color="orange">{path.path.slice(0, 20)}</Tag>
            </Tooltip>
          ),
          serverName: path.serverName,
          lastOpened: path.lastOpened ? new Date(path.lastOpened).toLocaleString() : 'Never'
        }))}
        columns={columns}
      />{' '}
    </>
  )
}
