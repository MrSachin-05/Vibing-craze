import { useState } from 'react'
import { motion } from 'framer-motion'
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
  return <motion.article className="title-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
    <div className="poster" style={{ backgroundImage: `url(${title.image})` }}>
      <span className="poster-kind">{title.kind}</span>
      <button className={`save-button ${saved ? 'saved' : ''}`} onClick={onSave} aria-label={saved ? `Remove ${title.name} from watchlist` : `Add ${title.name} to watchlist`}>{saved ? '★' : '+'}</button>
      <span className="poster-index">0{index + 1}</span>
    </div>
    <div className="title-details"><div><h3>{title.name}</h3><p>{title.genre} <span>/</span> {title.year}</p></div><strong>{title.score}</strong></div>
  </motion.article>
}

function VideoSculpture() {
  return <div className="video-sculpture" aria-label="Animated abstract video sculpture">
    <video autoPlay loop muted playsInline poster="/hero.png">
      <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
    </video>
    <div className="sculpture-grid" />
    <div className="sculpture-ring ring-one" />
    <div className="sculpture-ring ring-two" />
    <div className="sculpture-cube cube-one"><span /></div>
    <div className="sculpture-cube cube-two"><span /></div>
  </div>
}

function App() {
  const [activeKind, setActiveKind] = useState('All')
  const [activeGenre, setActiveGenre] = useState('All genres')
  const [watchlist, setWatchlist] = useState([])
  const visibleTitles = titles.filter((title) => (activeKind === 'All' || title.kind === activeKind) && (activeGenre === 'All genres' || title.genre === activeGenre))
  const toggleWatchlist = (name) => setWatchlist((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name])

  return <main>
    <header className="topbar"><a className="brand" href="#top">VIBING <span>CRAZY</span></a><nav><a href="#discover">Discover</a><a href="#calendar">Calendar</a><a href="#notes">Notes</a></nav><button className="watchlist-link" onClick={() => setActiveKind('All')}>Watchlist <b>{watchlist.length}</b></button></header>

    <section className="hero" id="top"><div className="hero-copy"><p className="kicker"><span /> Issue 004 / 2026</p><h1>Stories that<br /><i>stay loud.</i></h1><p className="hero-intro">A hand-picked orbit of movies and anime for the beautifully obsessed.</p><a className="text-link" href="#discover">Enter the archive <span>↘</span></a></div><div className="feature-art"><VideoSculpture /><div className="feature-label"><span>Tonight's signal</span><h2>When the<br /><em>stars fall.</em></h2><p>Watch the sky change. Keep the weird parts.</p></div><span className="feature-code">VC / 04-26 / A1</span></div><div className="hero-ticker"><span>NOW PLAYING</span><b>◼</b><span>FILMS + ANIMATION + AFTERIMAGES</span><b>◼</b><span>NOW PLAYING</span></div></section>

    <section className="discover" id="discover"><div className="section-head"><div><p className="kicker">01 / The signal</p><h2>Pick your<br /><i>frequency.</i></h2></div><p className="section-note">No rankings from a machine. Just things with a point of view, a pulse, and one scene you will think about tomorrow.</p></div><div className="controls"><div className="kind-tabs">{['All', 'Movie', 'Anime'].map((kind) => <button className={activeKind === kind ? 'active' : ''} key={kind} onClick={() => setActiveKind(kind)}>{kind}</button>)}</div><select value={activeGenre} onChange={(event) => setActiveGenre(event.target.value)} aria-label="Filter by genre"><option>All genres</option>{[...new Set(titles.map((title) => title.genre))].map((genre) => <option key={genre}>{genre}</option>)}</select></div><div className="title-grid">{visibleTitles.map((title, index) => <Poster key={title.name} title={title} index={index} saved={watchlist.includes(title.name)} onSave={() => toggleWatchlist(title.name)} />)}</div></section>

    <section className="manifesto" id="notes"><div className="manifesto-orbit"><span>✳</span><b>WATCH<br />WIDER</b></div><div><p className="kicker">02 / Scene notes</p><p className="manifesto-copy">For the nights when a plot is not enough. We are here for the <em>color</em>, the silence, the impossible architecture, the one frame that breaks the whole story open.</p><a className="text-link" href="#calendar">See what is next <span>↘</span></a></div></section>

    <section className="calendar" id="calendar"><div className="section-head"><div><p className="kicker">03 / Incoming</p><h2>Mark the<br /><i>dates.</i></h2></div><p className="section-note">Upcoming drops, fresh episodes, and reasons to cancel plans with confidence.</p></div><div className="release-list">{releases.map(([date, name, detail]) => <div className="release" key={name}><time>{date}</time><h3>{name}</h3><p>{detail}</p><span>↗</span></div>)}</div></section>

    <footer><div><a className="brand" href="#top">VIBING <span>CRAZY</span></a><p>For curious eyes and late-night brains.</p></div><p className="footer-mark">Movies / Anime / Repeat</p><a className="text-link" href="#top">Back to top ↑</a></footer>
  </main>
}

export default App
