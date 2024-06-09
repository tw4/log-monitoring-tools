import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import Home from './Pages/Home'
import Log from './Pages/Log'
import AddNewPath from './Pages/settings/AddNewPath'
import ConnectToDb from './Pages/settings/ConnectToDb'
import { createHashRouter } from 'react-router-dom'

const routers = createHashRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/logs',
    element: <Log />
  },
  {
    path: '/settings/add-new-path',
    element: <AddNewPath />
  },
  {
    path: '/settings/connect-to-db',
    element: <ConnectToDb />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={routers} />
  </React.StrictMode>
)
