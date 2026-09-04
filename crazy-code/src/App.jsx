import { useState, useEffect } from 'react'
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 120, damping: 16 }}
      data-cursor
    >
      <div className="poster" style={{ backgroundImage: `url(${title.image})` }}>
        <span className="poster-kind">{title.kind}</span>
        <button
          className={`save-button ${saved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onSave()
          }}
          aria-label={saved ? `Remove ${title.name} from watchlist` : `Add ${title.name} to watchlist`}
          data-cursor
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

function App() {
  const [activeKind, setActiveKind] = useState('All')
  const [activeGenre, setActiveGenre] = useState('All genres')
  const [watchlist, setWatchlist] = useState([])

  // Keep top navbar counter in sync with watchlist
  useEffect(() => {
    const el = document.getElementById('kage-wl-count')
    if (el) el.textContent = watchlist.length
  }, [watchlist.length])

  // Allow clicking navbar watchlist button to scroll to and filter watchlist
  useEffect(() => {
    const navBtn = document.getElementById('nav-wl-btn')
    if (!navBtn) return
    const handleClick = (e) => {
      e.preventDefault()
      setActiveKind('Watchlist')
      const target = document.getElementById('discover')
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }
    navBtn.addEventListener('click', handleClick)
    return () => navBtn.removeEventListener('click', handleClick)
  }, [])

  // Inform Kage scroll engine after render
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window.measureKage === 'function') {
        window.measureKage()
      }
      window.dispatchEvent(new Event('resize'))
    }, 400)
    return () => clearTimeout(timer)
  }, [activeKind, activeGenre])

  const toggleWatchlist = (name) => {
    setWatchlist((items) =>
      items.includes(name) ? items.filter((i) => i !== name) : [...items, name]
    )
  }

  const visibleTitles = titles.filter((t) => {
    if (activeKind === 'Watchlist') {
      if (!watchlist.includes(t.name)) return false
    } else if (activeKind !== 'All' && t.kind !== activeKind) {
      return false
    }
    if (activeGenre !== 'All genres' && t.genre !== activeGenre) {
      return false
    }
    return true
  })

  return (
    <div className="archive-hub" id="archive-hub">
      {/* ── Section Header / Transition ── */}
      <div className="archive-head">
        <div className="sec-head" style={{ marginBottom: '24px' }}>
          <span className="k"><b>05</b> — The Archive</span>
          <span className="rule" />
          <span className="k jp">目録</span>
        </div>
        <div className="archive-head-grid">
          <div>
            <h2 className="display h-sec">
              Stories that<br /><i>stay loud.</i>
            </h2>
          </div>
          <div className="archive-head-copy">
            <p className="lead">
              For curious eyes and late-night brains. A hand-picked orbit of cinema, anime, and sacred visuals for the beautifully obsessed.
            </p>
            <p className="body" style={{ marginTop: '12px' }}>
              No algorithms. No ranking machines. Just stories with a point of view, a pulse, and one scene you will remember tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* ── Discover & Filter Section ── */}
      <section className="discover" id="discover">
        <div className="controls">
          <div className="kind-tabs">
            {['All', 'Movie', 'Anime'].map((k) => (
              <button
                key={k}
                className={activeKind === k ? 'active' : ''}
                onClick={() => setActiveKind(k)}
                data-cursor
              >
                {k}
              </button>
            ))}
            <button
              className={`wl-tab ${activeKind === 'Watchlist' ? 'active' : ''}`}
              onClick={() => setActiveKind('Watchlist')}
              data-cursor
            >
              ★ Watchlist <b>{watchlist.length}</b>
            </button>
          </div>

          <div className="filter-right">
            <select
              value={activeGenre}
              onChange={(e) => setActiveGenre(e.target.value)}
              aria-label="Filter by genre"
              className="genre-select"
              data-cursor
            >
              <option>All genres</option>
              {[...new Set(titles.map((t) => t.genre))].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="title-grid">
          <AnimatePresence mode="popLayout">
            {visibleTitles.length > 0 ? (
              visibleTitles.map((title, i) => (
                <Poster
                  key={title.name}
                  title={title}
                  index={i}
                  saved={watchlist.includes(title.name)}
                  onSave={() => toggleWatchlist(title.name)}
                />
              ))
            ) : (
              <motion.div
                className="empty-watchlist"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>No saved titles in your watchlist yet.</p>
                <button
                  className="reset-filter-btn"
                  onClick={() => {
                    setActiveKind('All')
                    setActiveGenre('All genres')
                  }}
                  data-cursor
                >
                  Browse all titles
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Manifesto Section ── */}
      <section className="manifesto" id="notes">
        <div className="manifesto-orbit">
          <iframe
            src="/topology-field.html"
            title="Topology Field — rotating 3D node graph"
            tabIndex={-1}
            className="topology-iframe"
            sandbox="allow-scripts"
          />
          <div className="orbit-label">
            <span>✳</span>
            <b>WATCH<br />WIDER</b>
          </div>
        </div>
        <div className="manifesto-copy-wrap">
          <p className="eyebrow" style={{ letterSpacing: '0.2em' }}>06 / Scene Notes</p>
          <h3 className="manifesto-title">The Geometry of Silence</h3>
          <p className="manifesto-copy">
            For the nights when a plot is not enough. We are here for the <em>color</em>, the silence, the impossible architecture, and the single frame that breaks the whole story open.
          </p>
          <a className="arrowlink" href="#calendar" data-cursor style={{ marginTop: '24px', display: 'inline-flex' }}>
            <span>Incoming milestones</span>
            <span className="ar">
              <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
                <path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" />
              </svg>
            </span>
          </a>
        </div>
      </section>

      {/* ── Calendar Section ── */}
      <section className="calendar" id="calendar">
        <div className="calendar-head">
          <p className="eyebrow">07 / Incoming Drops</p>
          <h2 className="display h-sec" style={{ marginTop: '8px' }}>Mark the dates.</h2>
          <p className="body" style={{ marginTop: '10px' }}>
            Upcoming premier drops, fresh episodes, and confident reasons to cancel plans.
          </p>
        </div>
        <div className="release-list">
          {releases.map(([date, name, detail]) => (
            <div className="release" key={name} data-cursor>
              <time>{date}</time>
              <div className="release-info">
                <h3>{name}</h3>
                <p>{detail}</p>
              </div>
              <span className="release-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
