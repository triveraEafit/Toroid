// Dark site footer matching the Figma design.
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import './Footer.css'
import { useLanguage } from '../i18n'

export function Footer() {
  const { language } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Logo size={28} />
          <p>
            {language === 'es'
              ? 'Un espacio educativo y una suite visual para análisis numérico. Formula, aproxima y analiza criterios de convergencia con rigor matemático.'
              : 'An educational playground and visual suite for numerical analysis. Formulate, approximate, and analyze convergence criteria with mathematical rigor.'}
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h4>{language === 'es' ? 'Plataforma' : 'Platform'}</h4>
            <Link to="/methods">{language === 'es' ? 'Métodos' : 'Methods'}</Link>
            <Link to="/methods/graphing/function-plotter">{language === 'es' ? 'Visualizador' : 'Visualizer'}</Link>
          </div>
          <div>
            <h4>{language === 'es' ? 'Recursos' : 'Resources'}</h4>
            <Link to="/learn">{language === 'es' ? 'Centro de aprendizaje' : 'Learn Hub'}</Link>
            <Link to="/help">{language === 'es' ? 'Documentación de ayuda' : 'Help Docs'}</Link>
            <Link to="/learn">{language === 'es' ? 'Teoría' : 'Theory'}</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Toroid Numerical.</span>
        <div className="footer-policies">
          <a href="#">{language === 'es' ? 'Política de privacidad' : 'Privacy Policy'}</a>
          <a href="#">{language === 'es' ? 'Términos del servicio' : 'Terms of Service'}</a>
        </div>
      </div>
    </footer>
  )
}
