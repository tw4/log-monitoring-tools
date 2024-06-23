import { ipcMain } from 'electron'
import * as fs from 'fs'
import { Path, Statistics } from '../types'
import {
  getDirectorySize,
  getFolderCount,
  readAllFoldersAndFile,
  readAllFilesName
} from '../utils/pathUtils'
import { pageNation } from '../utils/pagenation'

export default function registerPathHandler(): void {
  ipcMain.handle('get-statistics', async (event, paths: Path[]): Promise<Statistics> => {
    console.log(event)
    let totalFolders = 0
    let totalFoldersSize = 0
    let totalFileinFolders = 0
    // calculate total folders
    // calculate total folders size
    // calculate total files in folders
    // return totalStatistcs

    totalFolders = paths.reduce((acc, current) => {
      const stats = fs.statSync(current.path)
      if (stats.isDirectory()) {
        return acc + getFolderCount(current.path)
      }
      return acc
    }, 0)

    totalFoldersSize = paths.reduce((acc, current) => {
      const stats = fs.statSync(current.path)
      if (stats.isDirectory()) {
        return acc + getDirectorySize(current.path)
      }
      return acc
    }, 0)

    totalFileinFolders = paths.reduce((acc, current) => {
      const stats = fs.statSync(current.path)
      if (stats.isDirectory()) {
        return acc + readAllFoldersAndFile(current.path)
      }
      return acc + 1
    }, 0)

    // calculate total folder size in MB
    const totalFoldersSizeToMB = (totalFoldersSize / 1024 / 1024).toFixed(2) + ' MB'

    const totalStatistcs: Statistics = {
      totalFileinFolders: totalFileinFolders,
      totalFolders: totalFolders,
      totalFoldersSize: totalFoldersSizeToMB
    }

    return totalStatistcs
  })

  // read a all files
  ipcMain.handle(
    'read-all-files',
    async (event, paths: Path[], page: number, pageSize: number): Promise<string[]> => {
      console.log(event)
      const allFiles: string[] = []
      paths.forEach((current) => {
        const stats = fs.statSync(current.path)
        if (stats.isDirectory()) {
          allFiles.push(...readAllFilesName(current.path))
        } else {
          allFiles.push(current.path)
        }
      })

      return pageNation(allFiles, page, pageSize)
    }
  )

  // read a file from path
  ipcMain.handle('read-file', async (event, paths: Path[], fileName: string): Promise<string> => {
    console.log(event)
    const content = paths.map((current) => {
      const stats = fs.statSync(current.path)
      if (stats.isDirectory()) {
        const filesName = readAllFilesName(current.path)
        if (filesName.includes(fileName)) {
          return fs.readFileSync(fileName, 'utf-8')
        }
      }
      return '' // Add a return statement to handle the case where none of the conditions are met
    })

    return content.join('')
  })

  // get total page number
  ipcMain.handle(
    'get-total-page',
    async (event, paths: Path[], pageSize: number): Promise<number> => {
      console.log(event)
      const allFiles: string[] = []
      paths.forEach((current) => {
        const stats = fs.statSync(current.path)
        if (stats.isDirectory()) {
          allFiles.push(...readAllFilesName(current.path))
        } else {
          allFiles.push(current.path)
        }
      })

      return Math.ceil((allFiles.length / pageSize) * 10)
    }
  )

  ipcMain.handle(
    'serach-file-name',
    async (
      event,
      paths: Path[],
      fileName: string,
      fileTypes: string[],
      selectedPath: string
    ): Promise<string[]> => {
      console.log(event)
      const allFiles: string[] = []

      if (selectedPath !== '') {
        const stats = fs.statSync(selectedPath)
        if (stats.isDirectory()) {
          allFiles.push(...readAllFilesName(selectedPath))
        } else {
          allFiles.push(selectedPath)
        }
      } else {
        paths.forEach((current) => {
          const stats = fs.statSync(current.path)
          if (stats.isDirectory()) {
            allFiles.push(...readAllFilesName(current.path))
          } else {
            allFiles.push(current.path)
          }
        })
      }

      if (fileTypes.length > 0) {
        const res: string[] = []
        fileTypes.forEach((fileType) => {
          res.push(
            ...allFiles.filter(
              (file) =>
                file.toLowerCase().includes(fileName) && file.toLowerCase().endsWith(fileType)
            )
          )
        })
        return res
      } else {
        return allFiles.filter((file) => file.toLowerCase().includes(fileName.toLowerCase()))
      }
    }
  )

  ipcMain.handle('get-file-types', async (event, paths: Path[]): Promise<string[]> => {
    console.log(event)
    const allFiles: string[] = []
    paths.forEach((current) => {
      const stats = fs.statSync(current.path)
      if (stats.isDirectory()) {
        allFiles.push(...readAllFilesName(current.path))
      } else {
        allFiles.push(current.path)
      }
    })
    let fileTypes = allFiles.map((file) => {
      if (file.includes('.')) {
        return file.split('.').pop()
      }
      return
    })

    fileTypes = fileTypes.filter((file) => file !== undefined)
    const setList = new Set(fileTypes)
    return Array.from(setList) as string[]
  })
}
