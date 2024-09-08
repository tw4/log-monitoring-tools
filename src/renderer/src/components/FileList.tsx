import { useEffect, useState } from 'react'
import { Flex, Pagination, Select, SelectProps, Table, TableColumnsType } from 'antd'
import { Input } from 'antd'
import type { Path } from '../types'

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
  const [paths, setPaths] = useState<Path[]>([])
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const [options, setOptions] = useState<SelectProps[]>([])
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([])
  const [pathOptions, setPathOptions] = useState<SelectProps[]>([])
  const [selectedPath, setSelectedPath] = useState<string>('')

  const { Search } = Input

  useEffect(() => {
    const paths = localStorage.getItem('paths')
    if (paths) {
      setPaths(JSON.parse(paths))
      setPathOptions(
        JSON.parse(paths).map((item: Path) => ({
          label: item.serverName,
          value: item.path
        }))
      )

      window.electron.ipcRenderer
        .invoke('read-all-files', JSON.parse(paths), 1, 10)
        .then((data) => {
          setData(data)
        })

      window.electron.ipcRenderer.invoke('get-file-types', JSON.parse(paths)).then((data) => {
        setOptions(
          data.map((item) => ({
            label: item,
            value: item
          }))
        )
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
        .invoke('serach-file-name', JSON.parse(path), value, selectedFileTypes, selectedPath)
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

  const handleChange = (value: string[]): void => {
    setSelectedFileTypes(value)
  }

  const handleChangedPathOption = (value: string): void => {
    setSelectedPath(value)
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
      <Flex justify="space-between" style={{ marginBottom: '10px' }}>
        <Search placeholder="input search file name" onSearch={onSearch} style={{ width: 200 }} />
        <Select
          placeholder="Please select file path"
          onChange={handleChangedPathOption}
          options={pathOptions}
        />
        <Select
          mode="multiple"
          allowClear
          style={{ width: '25%' }}
          placeholder="Please select"
          onChange={handleChange}
          options={options}
        />
      </Flex>
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
