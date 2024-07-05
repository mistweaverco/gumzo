import { app, BaseWindow, WebContentsView, shell } from 'electron'
import { windowsInstallerSetupEvents } from './installer-setup-events'

if (require('electron-squirrel-startup')) app.quit()
// if first time install on windows, do not run application, rather
// let squirrel installer do its work
if (windowsInstallerSetupEvents()) {
  process.exit()
}

let WINDOW: BaseWindow = null
let GCHATVIEW: WebContentsView = null

const createWindow = async () => {
  WINDOW = new BaseWindow({
    width: 960,
    height: 600,
  })

  GCHATVIEW = new WebContentsView()
  WINDOW.contentView.addChildView(GCHATVIEW)
  GCHATVIEW.webContents.loadURL('https://chat.google.com/')
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    GCHATVIEW.webContents.openDevTools()
    WINDOW.maximize()
  }

  const onResizeCallback = () => {
    const { width, height } = WINDOW.getBounds()
    GCHATVIEW.setBounds({ x: 0, y: 0, width: width, height: height })
  }

  WINDOW.on('resize', onResizeCallback)

  WINDOW.setMenuBarVisibility(false)

  onResizeCallback()


  // open external links in default browser
  GCHATVIEW.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.commandLine.appendSwitch('disable-gpu-vsync')

const onWhenReady = async () => {
  createWindow()
}

app.whenReady().then(onWhenReady)

const onWindowAllClosed = async () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

app.on('window-all-closed', onWindowAllClosed)
