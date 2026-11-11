// Dark site footer matching the Figma design.
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo size={28} />
          <p>
            An educational playground and visual suite for numerical analysis. Formulate,
            approximate, and analyze convergence criteria with mathematical rigor.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <Link to="/methods">Methods</Link>
            <Link to="/methods/graphing/function-plotter">Visualizer</Link>
          </div>
          <div>
            <h4>Resources</h4>
            <Link to="/learn">Learn Hub</Link>
            <Link to="/help">Help Docs</Link>
            <Link to="/learn">Theory</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Toroid Numerical.</span>
        <div className="footer-policies">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
