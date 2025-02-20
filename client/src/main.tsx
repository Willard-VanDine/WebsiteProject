import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Header from './Header.tsx'
import App from './App.tsx'
import './index.css'
import Footer from './Footer.tsx'
import Content from './Content.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <Content />
    <Footer />
  </StrictMode>,
)
