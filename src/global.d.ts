declare const MAIN_WINDOW_VITE_NAME: string
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string

type NavigationView = {
  view: WebContentsView
}

type ChatView = {
  view: WebContentsView
  added: boolean
  visible: boolean
}

type ChatViewSettings = {
  url: string
}

type AppWindow = {
  window: BaseWindow
}

type MainProcessIPCHandle = {
  id: string
  cb: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Window {
  versions: {
    node: string
    chrome: string
    electron: string
  }
  electron: {
    setChatViewVisible: (name: string) => Promise<{ success: boolean }>
  }
}
