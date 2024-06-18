import MainLayout from '@renderer/layout/MainLayout'
import { useState, useRef, useCallback } from 'react'
import FileList from '@renderer/components/FileList'
import { Button, Flex, Tabs } from 'antd'
import LogContent from '@renderer/components/LogContent'
import { RedoOutlined } from '@ant-design/icons'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string

export default function Log(): JSX.Element {
  const newTabIndex = useRef(0)
  const [selectedFile, setSelectedFile] = useState<string[]>([])
  const initialItems = [
    { label: 'File List', children: <FileList setSelectedFile={setSelectedFile} />, key: '1' }
  ]
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState(initialItems)
  // initial items
  // useState side
  const onChange = (newActiveKey: string): void => {
    setActiveKey(newActiveKey)
  }

  const remove = (targetKey: TargetKey): void => {
    let newActiveKey = activeKey
    let lastIndex = -1
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1
      }

      if (items.length === 1) {
        window.location.href = '/'
      }
    })
    const newPanes = items.filter((item) => item.key !== targetKey)
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key
      } else {
        newActiveKey = newPanes[0].key
      }
    }
    setItems(newPanes)
    setActiveKey(newActiveKey)
  }

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ): void => {
    if (action === 'add') {
      selectedFile.forEach((fileName) => {
        console.log(fileName)
        add(fileName)
      })
    } else {
      remove(targetKey)
    }
  }

  const add = useCallback((fileName: string): void => {
    const newActiveKey = `newTab${newTabIndex.current++}`
    const newPane = {
      label: fileName,
      children: <LogContent fileName={fileName} />,
      key: newActiveKey
    }
    setItems((prevItems) => [...prevItems, newPane])
    setActiveKey(newActiveKey)
  }, [])

  const reFersh = (): void => {
    window.location.reload()
  }

  return (
    <MainLayout locationKey="2">
      <Flex justify="end">
        <Button type="default" icon={<RedoOutlined />} onClick={reFersh}></Button>
      </Flex>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
        style={{ marginBottom: 20 }}
      />
    </MainLayout>
  )
}
