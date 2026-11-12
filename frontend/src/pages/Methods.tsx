// Methods directory — matches the Figma "toroid-methods" frame: a hero banner
// plus numbered category sections each with a grid of method buttons.
import { Link } from 'react-router-dom'
import { useCatalog } from '../methods/useCatalog'
import './Methods.css'
import { useLanguage } from '../i18n'

export function Methods() {
  const { catalog } = useCatalog()
  const { t } = useLanguage()
  const total = catalog.categories.reduce((n, c) => n + c.methods.length, 0)

  return (
    <div className="methods-page">
      <section className="methods-hero container">
        <h1>{t('methods.title')}</h1>
        <p>{t('methods.description', { total })}</p>
      </section>

      <section className="methods-directory container">
        {catalog.categories.map((cat) => (
          <div className="method-category" key={cat.key}>
            <div className="category-header">
              <span className="category-index">{cat.index}</span>
              <h2>{t(`catalog.${cat.key}` as Parameters<typeof t>[0])}</h2>
            </div>
            <div className="category-grid">
              {cat.methods.map((m) => (
                <Link key={m.slug} to={`/methods/${cat.key}/${m.slug}`} className="method-button">
                  {t(`catalog.${m.slug}` as Parameters<typeof t>[0])}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="theory-callout">
          {t('methods.callout')} {t('methods.learn')} <Link to="/learn">{t('nav.learn')}</Link>.
        </div>
      </section>
    </div>
  )
}
