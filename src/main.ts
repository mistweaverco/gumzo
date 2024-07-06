import {
  app,
  BrowserWindow,
  BaseWindow,
  WebContentsView,
  shell,
} from 'electron'
import { windowsInstallerSetupEvents } from './installer-setup-events'

if (require('electron-squirrel-startup')) app.quit()
// if first time install on windows, do not run application, rather
// let squirrel installer do its work
if (windowsInstallerSetupEvents()) {
  process.exit()
}

type AppWindow = {
  window: BaseWindow
}
const WINDOWS: { [key: string]: AppWindow } = {}
WINDOWS['default'] = { window: null }

type ChatView = {
  view: WebContentsView
}

const CHAT_VIEWS: { [key: string]: ChatView } = {}
CHAT_VIEWS['gchat'] = { view: null }
CHAT_VIEWS['discord'] = { view: null }
CHAT_VIEWS['slack'] = { view: null }
CHAT_VIEWS['teams'] = { view: null }

const createWindow = async () => {
  WINDOWS['default'].window = new BaseWindow({
    width: 960,
    height: 600,
  })

  CHAT_VIEWS['gchat'].view = new WebContentsView()
  WINDOWS['default'].window.contentView.addChildView(CHAT_VIEWS['gchat'].view)
  CHAT_VIEWS['gchat'].view.webContents.loadURL('https://chat.google.com/')
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    CHAT_VIEWS['gchat'].view.webContents.openDevTools()
    WINDOWS['default'].window.maximize()
  }

  const onResizeCallback = () => {
    const { width, height } = WINDOWS['default'].window.getBounds()
    CHAT_VIEWS['gchat'].view.setBounds({
      x: 0,
      y: 0,
      width: width,
      height: height,
    })
  }

  WINDOWS['default'].window.on('resize', onResizeCallback)

  WINDOWS['default'].window.setMenuBarVisibility(false)

  onResizeCallback()

  // open external links in default browser
  CHAT_VIEWS['gchat'].view.webContents.setWindowOpenHandler(details => {
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
