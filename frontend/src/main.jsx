import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { QueueProvider } from './context/QueueContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <QueueProvider>
              <App />
            </QueueProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
