import { Button, Flex, Input } from 'antd'
import { useEffect, useState } from 'react'
import { DownloadOutlined } from '@ant-design/icons'

interface LogContentProps {
  fileName: string
}

const { Search } = Input

export default function LogContent({ fileName }: LogContentProps): JSX.Element {
  const [data, setData] = useState<string>('')
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    const paths = localStorage.getItem('paths')
    if (paths) {
      // read-file from path
      window.electron.ipcRenderer.invoke('read-file', JSON.parse(paths), fileName).then((data) => {
        setData(data)
      })
    }
  }, [])

  return (
    <>
      <Flex justify="space-between">
        <Search
          placeholder="input search text"
          onSearch={(value) => setSearchValue(value)}
          enterButton
          style={{ width: 200 }}
        />
        <Button type="primary" icon={<DownloadOutlined />} style={{ marginLeft: 10 }} />
      </Flex>
      {data.split('\n').map((line, index) => {
        if (searchValue && line.includes(searchValue)) {
          const start = line.indexOf(searchValue)
          const end = start + searchValue.length
          return (
            <Flex key={index} style={{ padding: '5px 0' }}>
              <span>{line.slice(0, start)}</span>
              <span style={{ background: 'yellow' }}>{line.slice(start, end)}</span>
              <span>{line.slice(end)}</span>
            </Flex>
          )
        }
        return (
          <Flex key={index} style={{ padding: '5px 0' }}>
            {line}
          </Flex>
        )
      })}
    </>
  )
}
