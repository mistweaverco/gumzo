import path from 'path'
import {
  app,
  BrowserWindow,
  BaseWindow,
  WebContentsView,
  ipcMain,
  shell,
} from 'electron'
import { windowsInstallerSetupEvents } from './installer-setup-events'

const IS_DEVELOPMENT_MODE = MAIN_WINDOW_VITE_DEV_SERVER_URL !== undefined
const IS_DEVELOPMENT_RELEASE = app.getVersion() === '0.0.0'

if (require('electron-squirrel-startup')) app.quit()
// if first time install on windows, do not run application, rather
// let squirrel installer do its work
if (windowsInstallerSetupEvents()) {
  process.exit()
}

const CHAT_VIEW_SETTINGS: { [key: string]: ChatViewSettings } = {}
CHAT_VIEW_SETTINGS['gchat'] = { url: 'https://chat.google.com/' }
CHAT_VIEW_SETTINGS['discord'] = {
  url: 'https://discord.com/channels/@me',
}
CHAT_VIEW_SETTINGS['slack'] = { url: 'https://app.slack.com/' }
CHAT_VIEW_SETTINGS['teams'] = {
  url: 'https://teams.microsoft.com/',
}

const WINDOWS: { [key: string]: AppWindow } = {}
WINDOWS['default'] = { window: null }

const NAVIGATION_VIEW: NavigationView = { view: null }

const CHAT_VIEWS: { [key: string]: ChatView } = {}
CHAT_VIEWS['gchat'] = { view: null, added: true, visible: true }
CHAT_VIEWS['teams'] = { view: null, added: true, visible: false }
CHAT_VIEWS['discord'] = { view: null, added: false, visible: false }
CHAT_VIEWS['slack'] = { view: null, added: false, visible: false }

const setupIPCHandles = async () => {
  console.log('Setting up IPC handles')
  const ipcHandles: MainProcessIPCHandle[] = [
    {
      id: 'set-chat-view-visible',
      cb: async (_: string, name: string) => {
        setChatViewVisible(name)
      },
    },
  ]
  ipcHandles.forEach(async h => {
    ipcMain.handle(h.id, h.cb)
  })
}

const setChatViewVisible = (chatViewKey: string) => {
  for (const chatView of Object.values(CHAT_VIEWS)) {
    if (chatView.view === null) {
      continue
    }
    chatView.visible = false
    chatView.view.setVisible(false)
  }
  if (CHAT_VIEWS[chatViewKey].view !== null) {
    CHAT_VIEWS[chatViewKey].visible = true
    CHAT_VIEWS[chatViewKey].view.setVisible(true)
  }
}

const createWindow = async () => {
  WINDOWS['default'].window = new BaseWindow({
    width: 960,
    height: 600,
  })

  // navigation view
  NAVIGATION_VIEW.view = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (IS_DEVELOPMENT_MODE) {
    NAVIGATION_VIEW.view.webContents.loadURL(
      MAIN_WINDOW_VITE_DEV_SERVER_URL + '/navigation.html',
    )
  } else {
    NAVIGATION_VIEW.view.webContents.loadFile(
      path.join(__dirname, `../renderer/navigation/index.html`),
    )
  }
  NAVIGATION_VIEW.view.webContents.setWindowOpenHandler(
    (details: { url: string }) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    },
  )
  if (IS_DEVELOPMENT_MODE || IS_DEVELOPMENT_RELEASE) {
    NAVIGATION_VIEW.view.webContents.openDevTools()
  }
  WINDOWS['default'].window.contentView.addChildView(NAVIGATION_VIEW.view)

  // chat views
  const chatViewKeys = Object.keys(CHAT_VIEWS)
  for (const chatViewKey of chatViewKeys) {
    const chatView = CHAT_VIEWS[chatViewKey]
    if (chatView.added === false) {
      continue
    }
    chatView.view = new WebContentsView({
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    })
    chatView.view.webContents.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    )
    chatView.view.webContents.loadURL(CHAT_VIEW_SETTINGS[chatViewKey].url)
    chatView.view.setVisible(chatView.visible)
    WINDOWS['default'].window.contentView.addChildView(chatView.view)
  }

  if (IS_DEVELOPMENT_MODE || IS_DEVELOPMENT_RELEASE) {
    for (const chatView of Object.values(CHAT_VIEWS)) {
      if (chatView.view === null) {
        continue
      }
      chatView.view.webContents.openDevTools()
    }
    WINDOWS['default'].window.maximize()
  }

  const onResizeCallback = () => {
    const { width, height } = WINDOWS['default'].window.getBounds()
    NAVIGATION_VIEW.view.setBounds({
      x: 0,
      y: 0,
      width: width,
      height: 72,
    })
    for (const chatView of Object.values(CHAT_VIEWS)) {
      if (chatView.view === null) {
        continue
      }
      chatView.view.setBounds({
        x: 0,
        y: NAVIGATION_VIEW.view.getBounds().height,
        width: width,
        height: height - NAVIGATION_VIEW.view.getBounds().height,
      })
    }
  }

  WINDOWS['default'].window.on('resize', onResizeCallback)

  WINDOWS['default'].window.setMenuBarVisibility(false)

  onResizeCallback()

  // open external links in default browser
  for (const chatView of Object.values(CHAT_VIEWS)) {
    if (chatView.view === null) {
      continue
    }
    chatView.view.webContents.setWindowOpenHandler(
      (details: { url: string }) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
      },
    )
  }
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
  await setupIPCHandles()
  createWindow()
}

app.whenReady().then(onWhenReady)

const onWindowAllClosed = async () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

app.on('window-all-closed', onWindowAllClosed)
