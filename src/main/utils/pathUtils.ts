import * as fs from 'fs'
import path from 'path'

// this function read all folder in files and return the total files in all folders
export function readAllFoldersAndFile(path: string, f?: string): number {
  let fullPath = path
  if (f) {
    fullPath = `${path}/${f}`
  }
  const folderList = fs.readdirSync(fullPath)
  let totalFiles = 0

  folderList.forEach((folder) => {
    const currentPath = `${fullPath}/${folder}`
    const stats = fs.statSync(currentPath)
    if (stats.isDirectory()) {
      totalFiles += readAllFoldersAndFile(fullPath, folder)
    } else {
      totalFiles++
    }
  })

  return totalFiles
}

// this function calculate the size of the directory
export function getDirectorySize(directoryPath: string): number {
  let totalSize = 0
  const files = fs.readdirSync(directoryPath)

  files.forEach((file) => {
    const filePath = `${directoryPath}/${file}`
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath) // Recursive call if it's a directory
    } else {
      totalSize += stats.size
    }
  })

  return totalSize
}

// this function gets the all folder count
export function getFolderCount(directoryPath: string): number {
  let totalFolders = 0
  const files = fs.readdirSync(directoryPath)

  files.forEach((file) => {
    const filePath = `${directoryPath}/${file}`
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      totalFolders++
      totalFolders += getFolderCount(filePath) // Recursive call if it's a directory
    }
  })

  return totalFolders
}

// this func read a all files name in a path
export function readAllFilesName(directoryPath: string): string[] {
  let filePaths: string[] = []
  const files = fs.readdirSync(directoryPath)

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      filePaths = filePaths.concat(readAllFilesName(filePath)) // Recursive call if it's a directory
    } else {
      filePaths.push(filePath)
    }
  })

  return filePaths
}

export function logFilter(data: string[]): string[] {
  // @ts-ignore - TS complains about the filter function
  const res = data.filter((item) => {
    if (item.includes('.log') || item.includes('.txt') || item.includes('.syslog')) {
      return item
    }
  })
  return res
}
