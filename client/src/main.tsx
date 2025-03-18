import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Header from './Header.tsx'
import './index.css'
import Footer from './Footer.tsx'
import Content from './Content.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Content />
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)
