import { useState } from 'react'
import Dashboard from './assets/Components/Dashboard'
import LandingPage from './assets/Components/Landing_page'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LandingPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  )
}

export default App
