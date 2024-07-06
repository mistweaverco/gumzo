let RETRIES_TO_HIDE = 0
const MAX_RETRIES_TO_HIDE = 20

const hideThings = () => {
  const selectors = ['[data-ogsr-up]', 'div:has(>[role="complementary"]']
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement
    if (!element) {
      if (RETRIES_TO_HIDE > MAX_RETRIES_TO_HIDE) {
        console.log('Max retries to hide reached')
        return
      }
      setTimeout(() => {
        console.log('Retrying to hide ...', selector)
        RETRIES_TO_HIDE++
        hideThings()
      }, 500)
      break
    }
    element.style.display = 'none'
  }
}

export const preloadGoogle = () => {
  window.addEventListener('DOMContentLoaded', () => {
    hideThings()
  })
}
