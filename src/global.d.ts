declare const MAIN_WINDOW_VITE_NAME: string
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string

type NavigationView = {
  view: WebContentsView
}

type ChatView = {
  view: WebContentsView
  added: boolean
}

type ChatViewSettings = {
  url: string
}

type AppWindow = {
  window: BaseWindow
}
