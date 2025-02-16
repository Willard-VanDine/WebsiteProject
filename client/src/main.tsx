import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Header from './header.tsx'
import App from './App.tsx'
import './index.css'
import Footer from './footer.tsx'
import Content from './Content.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <Content />
    <Footer />
  </StrictMode>,
)
