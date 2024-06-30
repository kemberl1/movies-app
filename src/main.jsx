import ReactDOM from 'react-dom/client'
import { Offline, Online } from 'react-detect-offline'
import React from 'react'

import ErrorIndicator from './components/ErrorIndicator/ErrorIndicator'
import App from './App'
import './styles/main.scss'
import ErrorMessages from './components/ErrorMessages/ErrorMessages'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Online>
      <App />
    </Online>
    <Offline>
      <ErrorIndicator message={ErrorMessages.NETWORK_ERROR} />
    </Offline>
  </React.StrictMode>
)
