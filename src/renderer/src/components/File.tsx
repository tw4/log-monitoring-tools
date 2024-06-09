import { Flex, Tag } from 'antd'
import { FolderOutlined } from '@ant-design/icons'

interface FileProps {
  path: string
}

export default function File({ path }: FileProps): JSX.Element {
  return (
    <Flex gap={'middle'} style={{ margin: '0px' }}>
      <FolderOutlined />
      {path.includes('log') || path.includes('syslog') ? (
        <Tag color="green" style={{ cursor: 'pointer' }}>
          {path}
        </Tag>
      ) : (
        <Tag color="blue" style={{ cursor: 'pointer' }}>
          {path}
        </Tag>
      )}
    </Flex>
  )
}
