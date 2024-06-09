import { useEffect, useState } from 'react'
import { Flex, Pagination, Table, TableColumnsType } from 'antd'
import { Input } from 'antd'

interface FileListProps {
  setSelectedFile: (fileName: string[]) => void
}

interface DataType {
  key: React.Key
  fileName: string
}

const colcolumns: TableColumnsType<DataType> = [
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName'
  }
]

export default function FileList({ setSelectedFile }: FileListProps): JSX.Element {
  const [data, setData] = useState<string[]>([])
  const [paths, setPaths] = useState<string[]>([])
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)

  const { Search } = Input

  useEffect(() => {
    const paths = localStorage.getItem('paths')
    if (paths) {
      setPaths(JSON.parse(paths))
      window.electron.ipcRenderer
        .invoke('read-all-files', JSON.parse(paths), 1, 10)
        .then((data) => {
          setData(data)
        })

      // get total page number
      window.electron.ipcRenderer.invoke('get-total-page', JSON.parse(paths), 10).then((data) => {
        setPageSize(data)
      })
    }
  }, [])

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]): void => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      setSelectedFile(selectedRows.map((item) => item.fileName))
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.key === '0' // Column configuration not to be checked
    })
  }

  const onSearch = (value: string): void => {
    console.log(value)
    const path = localStorage.getItem('paths')
    if (!path) {
      return
    }
    if (value) {
      window.electron.ipcRenderer
        .invoke('serach-file-name', JSON.parse(path), value)
        .then((data) => {
          setData(data)
          setPage(0)
        })
    } else {
      window.electron.ipcRenderer.invoke('read-all-files', JSON.parse(path), 1, 10).then((data) => {
        setData(data)
        setPage(1)
      })
    }
  }

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#fff',
        borderRadius: '5px'
      }}
    >
      <Search
        placeholder="input search file name"
        onSearch={onSearch}
        style={{ width: 200, marginBottom: '10px' }}
      />

      <Flex
        vertical
        style={{
          height: '50vh',
          overflow: 'auto'
        }}
      >
        <Table
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection
          }}
          columns={colcolumns}
          dataSource={data.map((item) => ({
            key: item,
            fileName: item
          }))}
        />
      </Flex>
      <Pagination
        showSizeChanger={false}
        current={page}
        onChange={(e) => {
          window.electron.ipcRenderer.invoke('read-all-files', paths, e, 10).then((data) => {
            setData(data)
            setPage(e)
          })
        }}
        total={pageSize}
      />
    </Flex>
  )
}
