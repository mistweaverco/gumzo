import { FC } from 'react'

const selectedPanel = 'Overview'

const handleTopButtonsClick = (evt: React.MouseEvent) => {
  evt.preventDefault()
  const target = evt.target as HTMLButtonElement
  const root = target.closest('button')
  switch (root.dataset.action) {
    case 'reportABug':
      root.classList.add('is-loading')
      setTimeout(() => {
        root.classList.remove('is-loading')
      }, 3000)
      window.open('https://github.com/mistweaverco/gumzo/issues/new')
      break
    case 'seeTheCode':
      root.classList.add('is-loading')
      setTimeout(() => {
        root.classList.remove('is-loading')
      }, 3000)
      window.open('https://github.com/mistweaverco/gumzo')
      break
    default:
      break
  }
}

const Navigation: FC = () => {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-menu p-2">
          <div className="navbar-start">
            <div className="navbar-item">
              <div className="buttons">
                <button
                  className="button is-primary"
                  data-action="chatviewGchat"
                  onClick={handleTopButtonsClick}
                >
                  <span className="icon">
                    <i className="fa-brands fa-google"></i>
                  </span>
                  <strong>Google Chat</strong>
                </button>
                <button
                  className="button is-secondary hidden"
                  data-action="chatviewDiscord"
                  onClick={handleTopButtonsClick}
                >
                  <span className="icon">
                    <i className="fa-brands fa-discord"></i>
                  </span>
                  <strong>Discord</strong>
                </button>
                <button
                  className="button is-secondary hidden"
                  data-action="chatviewSlack"
                  onClick={handleTopButtonsClick}
                >
                  <span className="icon">
                    <i className="fa-brands fa-slack"></i>
                  </span>
                  <strong>Slack</strong>
                </button>
                <button
                  className="button is-secondary hidden"
                  data-action="chatviewTeams"
                  onClick={handleTopButtonsClick}
                >
                  <span className="icon">
                    <i className="fa-brands fa-microsoft"></i>
                  </span>
                  <strong>Teams</strong>
                </button>
                <button
                  className="button is-secondary"
                  data-action="addProvider"
                  onClick={handleTopButtonsClick}
                >
                  <span className="icon">
                    <i className="fa-solid fa-add"></i>
                  </span>
                  <strong>Add Provider</strong>
                </button>
              </div>
            </div>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button
                  className="button is-secondary"
                  data-action="reportABug"
                  onClick={handleTopButtonsClick}
                >
                  <span className="icon">
                    <i className="fa-solid fa-bug"></i>
                  </span>
                  <strong>Report a bug</strong>
                </button>
                <button
                  className="button is-secondary"
                  data-action="seeTheCode"
                  onClick={handleTopButtonsClick}
                >
                  <span className="icon">
                    <i className="fa-solid fa-code"></i>
                  </span>
                  <strong>See the code</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation
