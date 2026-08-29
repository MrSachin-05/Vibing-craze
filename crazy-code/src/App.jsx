import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const titles = [
  { name: 'The Wild Robot', kind: 'Movie', year: '2024', genre: 'Animation', score: '9.1', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85' },
  { name: 'Neon Ronin', kind: 'Anime', year: '2025', genre: 'Sci-fi', score: '8.8', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85' },
  { name: 'Perfect Days', kind: 'Movie', year: '2023', genre: 'Drama', score: '8.4', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85' },
  { name: "Frieren: Beyond Journey's End", kind: 'Anime', year: '2023', genre: 'Fantasy', score: '9.3', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85' },
  { name: 'Spider-Verse', kind: 'Movie', year: '2023', genre: 'Action', score: '9.0', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=85' },
  { name: 'Blue Period', kind: 'Anime', year: '2021', genre: 'Drama', score: '8.1', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85' },
]

const releases = [
  ['06 SEP', 'The Bear', 'Series / season 04'],
  ['14 SEP', 'One Piece', 'Anime / episode 1138'],
  ['28 SEP', 'Megalopolis', 'Movie / theatrical'],
]

function Poster({ title, index, saved, onSave }) {
  return (
    <motion.article
      className="title-card"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 120, damping: 16 }}
    >
      <div className="poster" style={{ backgroundImage: `url(${title.image})` }}>
        <span className="poster-kind">{title.kind}</span>
        <button
          className={`save-button ${saved ? 'saved' : ''}`}
          onClick={onSave}
          aria-label={saved ? `Remove ${title.name} from watchlist` : `Add ${title.name} to watchlist`}
        >
          {saved ? '★' : '+'}
        </button>
        <span className="poster-index">0{index + 1}</span>
      </div>
      <div className="title-details">
        <div>
          <h3>{title.name}</h3>
          <p>{title.genre} <span>/</span> {title.year}</p>
        </div>
        <strong>{title.score}</strong>
      </div>
    </motion.article>
  )
}

/* Floating ember particles layered over the iframe */
function EmberOverlay() {
  return (
    <div className="ember-overlay" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} className="ember" style={{
          '--x': `${Math.random() * 100}%`,
          '--delay': `${Math.random() * 7}s`,
          '--dur': `${5 + Math.random() * 8}s`,
          '--size': `${2 + Math.random() * 3}px`,
        }} />
      ))}
    </div>
  )
}

function App() {
  const [activeKind, setActiveKind] = useState('All')
  const [activeGenre, setActiveGenre] = useState('All genres')
  const [watchlist, setWatchlist] = useState([])
  const [kageReady, setKageReady] = useState(false)
  const iframeRef = useRef(null)

  const visibleTitles = titles.filter((t) =>
    (activeKind === 'All' || t.kind === activeKind) &&
    (activeGenre === 'All genres' || t.genre === activeGenre)
  )
  const toggleWatchlist = (name) =>
    setWatchlist((items) =>
      items.includes(name) ? items.filter((i) => i !== name) : [...items, name]
    )

  useEffect(() => {
    const timer = setTimeout(() => setKageReady(true), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* ── Kage Three.js temple background ── */}
      <div className={`kage-frame ${kageReady ? 'kage-frame--ready' : ''}`}>
        <iframe
          ref={iframeRef}
          src="/kage.html"
          title="Kage Temple — live WebGL background"
          aria-hidden="true"
          tabIndex={-1}
          className="kage-iframe"
          onLoad={() => setKageReady(true)}
          sandbox="allow-scripts allow-same-origin"
        />
        <EmberOverlay />
        {/* vermilion vignette to blend iframe into content */}
        <div className="kage-vignette" />
      </div>

      {/* ── App overlay ── */}
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="#top">VIBING <span>CRAZY</span></a>
          <nav>
            <a href="#discover">Discover</a>
            <a href="#calendar">Calendar</a>
            <a href="#notes">Notes</a>
          </nav>
          <button className="watchlist-link" onClick={() => setActiveKind('All')}>
            Watchlist <b>{watchlist.length}</b>
          </button>
        </header>

        {/* ── hero ── */}
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="kicker"><span />&ensp;Issue 004 / 2026</p>
            <h1>Stories that<br /><i>stay loud.</i></h1>
            <p className="hero-intro">
              A hand-picked orbit of movies and anime for the beautifully obsessed.
            </p>
            <a className="text-link" href="#discover">Enter the archive <span>↘</span></a>
          </div>
          <div className="hero-badge">
            <div className="badge-ring" />
            <div className="badge-ring badge-ring--2" />
            <div className="badge-inner">
              <span className="badge-label">Tonight's</span>
              <strong>Signal</strong>
              <span className="badge-sub">VC / 04-26</span>
            </div>
          </div>
        </section>

        {/* ── discover ── */}
        <section className="discover" id="discover">
          <div className="section-head">
            <div>
              <p className="kicker">01 / The signal</p>
              <h2>Pick your<br /><i>frequency.</i></h2>
            </div>
            <p className="section-note">
              No rankings from a machine. Just things with a point of view, a pulse, and one
              scene you will think about tomorrow.
            </p>
          </div>
          <div className="controls">
            <div className="kind-tabs">
              {['All', 'Movie', 'Anime'].map((k) => (
                <button
                  key={k}
                  className={activeKind === k ? 'active' : ''}
                  onClick={() => setActiveKind(k)}
                >
                  {k}
                </button>
              ))}
            </div>
            <select
              value={activeGenre}
              onChange={(e) => setActiveGenre(e.target.value)}
              aria-label="Filter by genre"
            >
              <option>All genres</option>
              {[...new Set(titles.map((t) => t.genre))].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="title-grid">
            <AnimatePresence mode="popLayout">
              {visibleTitles.map((title, i) => (
                <Poster
                  key={title.name}
                  title={title}
                  index={i}
                  saved={watchlist.includes(title.name)}
                  onSave={() => toggleWatchlist(title.name)}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* ── manifesto ── */}
        <section className="manifesto" id="notes">
          <div className="manifesto-orbit">
            {/* topology-field: StructureFlowCollection variant="topology-field" hue=0 saturation=1 brightness=1 */}
            <iframe
              src="/topology-field.html"
              title="Topology Field — rotating 3D node graph"
              aria-hidden="true"
              tabIndex={-1}
              className="topology-iframe"
              sandbox="allow-scripts"
            />
            <div className="orbit-label">
              <span>✳</span>
              <b>WATCH<br />WIDER</b>
            </div>
          </div>
          <div>
            <p className="kicker">02 / Scene notes</p>
            <p className="manifesto-copy">
              For the nights when a plot is not enough. We are here for the <em>color</em>, the
              silence, the impossible architecture, the one frame that breaks the whole story open.
            </p>
            <a className="text-link" href="#calendar">See what is next <span>↘</span></a>
          </div>
        </section>

        {/* ── calendar ── */}
        <section className="calendar" id="calendar">
          <div className="section-head">
            <div>
              <p className="kicker">03 / Incoming</p>
              <h2>Mark the<br /><i>dates.</i></h2>
            </div>
            <p className="section-note">
              Upcoming drops, fresh episodes, and reasons to cancel plans with confidence.
            </p>
          </div>
          <div className="release-list">
            {releases.map(([date, name, detail]) => (
              <div className="release" key={name}>
                <time>{date}</time>
                <h3>{name}</h3>
                <p>{detail}</p>
                <span>↗</span>
              </div>
            ))}
          </div>
        </section>

        <footer>
          <div>
            <a className="brand" href="#top">VIBING <span>CRAZY</span></a>
            <p>For curious eyes and late-night brains.</p>
          </div>
          <p className="footer-mark">Movies / Anime / Repeat</p>
          <a className="text-link" href="#top">Back to top ↑</a>
        </footer>
      </div>
    </>
  )
}

export default App
