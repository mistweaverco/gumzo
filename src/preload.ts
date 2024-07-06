import { contextBridge, ipcRenderer } from 'electron'
import { preloadGoogle } from './preload/google'
import { preloadDiscord } from './preload/discord'
import { preloadSlack } from './preload/slack'
import { preloadTeams } from './preload/teams'

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('electron', {
  setChatViewVisible: (name: string) => {
    ipcRenderer.invoke('set-chat-view-visible', name)
  },
})

switch (window.location.hostname) {
  case 'mail.google.com':
    preloadGoogle()
    break
  case 'discord.com':
    preloadDiscord()
    break
  case 'app.slack.com':
    preloadSlack()
    break
  case 'teams.microsoft.com':
    preloadTeams()
    break
  default:
    console.log('No preload script for this site')
}
