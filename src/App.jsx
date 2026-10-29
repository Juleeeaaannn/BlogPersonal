import { useState } from 'react'
import AdminArea from './components/AdminArea.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        <AdminArea></AdminArea>
    </div>
  )
}

export default App
