import { useState } from 'react'
import Auction from './Auction.jsx'
import Draft from './Draft.jsx'
import Boss from './Boss.jsx'
import Leaderboard from './Leaderboard.jsx'
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
      case 'leaderboard':
        return <Leaderboard />
      default:
        return <Auction />
    }
  }

  return (
    <div className="app-container">
      <nav className="topnav">
        <span className="logo">Blitz Viz</span>
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
        <button
          className={mode === 'leaderboard' ? 'active' : ''}
          onClick={() => setMode('leaderboard')}
        >
          Leaderboards
        </button>
      </nav>

      <main className="content">
        {renderMode()}
      </main>
    </div>
  )
}
