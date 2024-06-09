import type { MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number]

export type Path = {
  path: string
  lastOpened: Date
  createdAt: Date
  serverName: string
  favorite: boolean
}

export type Statistics = {
  totalFolders: number
  totalFoldersSize: string
  totalFileinFolders: number
}

export type File = {
  name: string
  size: number
  type: string
  path: string
}

export type Folder = {
  name: string
  path: string
  files: File[]
}

export type SelectedFileContextType = {
  selectedFile: string
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>
}
