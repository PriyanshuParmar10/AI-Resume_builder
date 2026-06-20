import { createRoot } from 'react-dom/client'
import './index.css'
import '../src/components/Toast.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import { store } from './app/store.js'
import { ToastProvider } from './components/Toast.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
  <ToastProvider>
    <App />
  </ToastProvider>
  </Provider>
  </BrowserRouter>
)
