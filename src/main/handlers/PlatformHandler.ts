import { ipcMain } from 'electron'

export default function RegisterPlatformHandler(): void {
  ipcMain.handle('platform', async (event) => {
    console.log(event)
    return process.platform
  })
}
