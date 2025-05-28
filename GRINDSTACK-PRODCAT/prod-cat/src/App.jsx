import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import ManageProd from './pages/manageprod'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manageprod" element={<ManageProd />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
