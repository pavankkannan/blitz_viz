import { useState } from 'react'
import Auction from './Auction.jsx'
import Draft from './Draft.jsx'
import Boss from './Boss.jsx'
import './App.css'

export default function App() {
  const [mode, setMode] = useState('auction')

  const renderMode = () => {
    switch (mode) {
      case 'auction':
        return <Auction />
      case 'draft':
        return <Draft />
      case 'boss':
        return <Boss />
      default:
        return <Auction />
    }
  }

  return (
    <div className="app-container">
      <nav className="sidebar">
        <h2 className="logo">Blitz Viz</h2>
        <button
          className={mode === 'auction' ? 'active' : ''}
          onClick={() => setMode('auction')}
        >
          Auction
        </button>
        <button
          className={mode === 'draft' ? 'active' : ''}
          onClick={() => setMode('draft')}
        >
          Draft
        </button>
        <button
          className={mode === 'boss' ? 'active' : ''}
          onClick={() => setMode('boss')}
        >
          Boss
        </button>
      </nav>

      <main className="content">
        {renderMode()}
      </main>
    </div>
  )
}