// App shell matching the Figma design: dark header with top nav + dark footer.
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from './Logo'
import { Footer } from './Footer'
import './Layout.css'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/methods', label: 'Methods', end: false },
  { to: '/learn', label: 'Learn', end: false },
  { to: '/help', label: 'Help', end: false },
]

export function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="layout">
      <header className="site-header">
        <div className="site-header-inner container">
          <Link to="/" className="brand" aria-label="Toroid home">
            <Logo />
          </Link>
          <button className="menu-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            ☰
          </button>
          <nav className={`site-nav ${open ? 'open' : ''}`}>
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
