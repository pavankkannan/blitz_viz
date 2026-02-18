import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import Auction from './Auction.jsx'
import Draft from './Draft.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auction />
    {/* <Draft/> */}
  </StrictMode>,
)
