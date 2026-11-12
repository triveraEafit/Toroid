// App shell matching the Figma design: dark header with top nav + dark footer.
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from './Logo'
import { Footer } from './Footer'
import './Layout.css'
import { useLanguage } from '../i18n'

export function Layout() {
  const [open, setOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const nav = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/methods', label: t('nav.methods'), end: false },
    { to: '/learn', label: t('nav.learn'), end: false },
    { to: '/help', label: t('nav.help'), end: false },
  ]

  return (
    <div className="layout">
      <header className="site-header">
        <div className="site-header-inner container">
          <Link to="/" className="brand" aria-label={t('nav.homeAria')}>
            <Logo />
          </Link>
          <button className="menu-toggle" onClick={() => setOpen((o) => !o)} aria-label={t('nav.menu')}>
            ☰
          </button>
          <nav className={`site-nav ${open ? 'open' : ''}`}>
            {nav.map((item) => (
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
            <label className="language-switcher">
              <span className="sr-only">{t('nav.language')}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as 'es' | 'en')}
                aria-label={t('nav.language')}
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
            </label>
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
