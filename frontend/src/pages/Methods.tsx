// Methods directory — matches the Figma "toroid-methods" frame: a hero banner
// plus numbered category sections each with a grid of method buttons.
import { Link } from 'react-router-dom'
import { useCatalog } from '../methods/useCatalog'
import './Methods.css'

export function Methods() {
  const { catalog } = useCatalog()
  const total = catalog.categories.reduce((n, c) => n + c.methods.length, 0)

  return (
    <div className="methods-page">
      <section className="methods-hero container">
        <h1>Methods</h1>
        <p>
          Select from {total} mathematical tools designed to analyze functions, locate roots, and
          map iteration grids. Use the unified directory below to load any algorithm directly into
          the simulation sandbox.
        </p>
      </section>

      <section className="methods-directory container">
        {catalog.categories.map((cat) => (
          <div className="method-category" key={cat.key}>
            <div className="category-header">
              <span className="category-index">{cat.index}</span>
              <h2>{cat.title}</h2>
            </div>
            <div className="category-grid">
              {cat.methods.map((m) => (
                <Link key={m.slug} to={`/methods/${cat.key}/${m.slug}`} className="method-button">
                  {m.name}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="theory-callout">
          Need a refresher on local versus global convergence limits or the bisection criteria?
          Explore the rigorous proofs inside our <Link to="/learn">Learn Hub</Link>.
        </div>
      </section>
    </div>
  )
}
