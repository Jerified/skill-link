import Home from './pages/Home'
import './index.css'
import { Route, Routes } from "react-router-dom"
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      
    </>
  )
}

export default App
