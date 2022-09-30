import React from 'react'
import './assets/css/App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import views from 'pages'
import services from 'services'

import { routes } from './routes'

function Inner() {
  const location = useLocation()
  React.useEffect(() => {
    services.linking.routeChanged()
  }, [location])
  return (
    <views.Wrapper>
      <Routes>
        {routes.map((route, i) => (
          <Route {...route} key={i} />
        ))}
      </Routes>
    </views.Wrapper>
  )
}
function App() {
  return (
    <Router>
      <Inner />
    </Router>
  )
}

export default App
