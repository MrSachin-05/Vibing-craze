import { useState, useEffect, useRef, useCallback } from 'react'
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

/* ── Kage chapter data ── */
const kageCards = [
  {
    id: 'approach', title: 'Approach', jp: '参道', meta: 'The long climb', idx: '01 / 03',
    image: '/secret-pathways-assets/generated/kage-approach.webp',
    glow: { gx: '80.2%', gy: '23.9%', gr: '22%', gt: '6.1s', gt2: '9.7s', gc1: 'rgba(255,142,108,.50)', gc2: 'rgba(212,56,38,.24)' },
  },
  {
    id: 'lanterns', title: 'Lanterns', jp: '灯籠', meta: 'Lantern court', idx: '02 / 03',
    image: '/secret-pathways-assets/generated/kage-lantern-court.webp',
    glow: { gx: '70.5%', gy: '47.2%', gr: '14%', gt: '3.7s', gt2: '5.3s', gc1: 'rgba(255,198,124,.62)', gc2: 'rgba(226,118,40,.30)' },
    flame: true,
  },
  {
    id: 'moonwater', title: 'Moonwater', jp: '月影', meta: 'The wet court', idx: '03 / 03',
    image: '/secret-pathways-assets/generated/kage-moonwater.webp',
    glow: { gx: '48.0%', gy: '16.8%', gr: '20%', gt: '7.3s', gt2: '11.2s', gc1: 'rgba(255,138,104,.52)', gc2: 'rgba(208,54,36,.24)' },
  },
]

const kageLessons = [
  { n: '01', title: 'The Hidden Gate', jp: '山門', desc: 'Why a gate is a sentence, and what you agree to when you walk under one.', time: '14 min' },
  { n: '02', title: 'Borrowed Scenery', jp: '借景', desc: 'Shakkei: composing with a mountain you will never own.', time: '18 min' },
  { n: '03', title: 'Charred Cypress', jp: '焼杉', desc: 'Yakisugi: burning a board black so the weather will let it live.', time: '21 min' },
  { n: '04', title: 'Lantern Light', jp: '灯籠', desc: 'How a single ember decides the scale of everything around it.', time: '17 min' },
  { n: '05', title: 'The Vermilion Moon', jp: '朱月', desc: 'Why the moon burns red over the valley, and what the garden does with it.', time: '22 min' },
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

/* ── Seeded PRNG (mulberry32) so particles are deterministic on every render ── */
function mulberry32(seed) {
  let s = seed >>> 0
  return function () {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ── Canvas-based ember particle overlay ── */
const PALETTES = [
  ['rgba(255,110,60,1)',   'rgba(224,60,20,0.55)',  'rgba(180,30,10,0)'],   // hot ember
  ['rgba(255,170,80,1)',   'rgba(220,90,30,0.45)',  'rgba(160,40,10,0)'],   // copper spark
  ['rgba(200,140,255,0.7)','rgba(140,80,200,0.25)', 'rgba(80,30,120,0)'],   // violet spirit (rare)
]

function EmberOverlay() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)  // { pool, raf, W, H }

  const init = useCallback((canvas) => {
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    const rand = mulberry32(0xCA3D7)
    const COUNT = 55

    let W = 0, H = 0
    function resize() {
      const rect = canvas.getBoundingClientRect()
      W = canvas.width  = rect.width  || window.innerWidth
      H = canvas.height = rect.height || window.innerHeight
    }
    resize()

    // ResizeObserver keeps canvas pixel-perfect after any layout change
    const ro = new ResizeObserver(() => resize())
    ro.observe(canvas)

    function makeParticle(born) {
      const r = rand
      const rval = r()
      return {
        x:     r() * W,
        y:     born ? (H * (0.3 + r() * 0.7)) : (H + r() * 40),
        rad:   0.6 + Math.pow(r(), 3) * 4.4,
        pal:   rval < 0.78 ? 0 : rval < 0.96 ? 1 : 2,
        vy:    -(0.08 + r() * 0.28),
        amp:   8 + r() * 28,
        freq:  0.00018 + r() * 0.00034,
        phase: r() * Math.PI * 2,
        life:  0,  // set below
        born:  0,
        maxA:  0.42 + r() * 0.48,   // boosted: must punch through vignette on screen blend
      }
    }

    const pool = []
    const now = performance.now()
    for (let i = 0; i < COUNT; i++) {
      const p = makeParticle(true)
      p.life = (6000 + rand() * 12000) * (0.6 + p.rad * 0.12)
      p.born = now - rand() * p.life * 0.9
      pool.push(p)
    }

    let raf
    function frame(t) {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < pool.length; i++) {
        const p = pool[i]
        const age = t - p.born
        if (age > p.life || p.life === 0) {
          const np = makeParticle(false)
          np.life = (6000 + rand() * 12000) * (0.6 + np.rad * 0.12)
          np.born = t
          pool[i] = np
          continue
        }
        const rel = age / p.life
        let alpha
        if (rel < 0.12)       alpha = (rel / 0.12) * p.maxA
        else if (rel < 0.72)  alpha = p.maxA
        else                  alpha = p.maxA * (1 - (rel - 0.72) / 0.28)

        const x = p.x + Math.sin(t * p.freq + p.phase) * p.amp
        const y = p.y + p.vy * age
        if (y < -p.rad * 4) {
          const np = makeParticle(false)
          np.life = (6000 + rand() * 12000) * (0.6 + np.rad * 0.12)
          np.born = t
          pool[i] = np
          continue
        }
        const pal = PALETTES[p.pal]
        const R   = p.rad * (2.4 + Math.sin(t * 0.00073 + p.phase) * 0.4)
        const g   = ctx.createRadialGradient(x, y, 0, x, y, R)
        g.addColorStop(0,    pal[0])
        g.addColorStop(0.38, pal[1])
        g.addColorStop(1,    pal[2])
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(x, y, R, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        ctx.restore()
      }
      raf = requestAnimationFrame(frame)
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        const t2 = performance.now()
        pool.forEach(p => { p.born = t2 - rand() * p.life * 0.5 })
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(frame)
    stateRef.current = { raf, pool, cleanup: () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }}
  }, [])

  useEffect(() => {
    init(canvasRef.current)
    return () => stateRef.current?.cleanup()
  }, [init])

  return (
    <canvas
      ref={canvasRef}
      className="ember-canvas"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
               pointerEvents: 'none', mixBlendMode: 'screen', zIndex: 3 }}
    />
  )
}

/* ── Scroll-reveal hook: fades + slides children in when they enter viewport ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, visible]
}

/* ── Reveal wrapper component ── */
function Rv({ children, as: Tag = 'div', className = '', delay = 0, variant = 'up', ...rest }) {
  const [ref, visible] = useReveal()
  const base = variant === 'fade'
    ? { opacity: 0, transform: 'none' }
    : { opacity: 0, transform: 'translate3d(0, 26px, 0)' }
  const shown = { opacity: 1, transform: 'none' }
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...(visible ? shown : base),
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 1.05s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ══════════════════════════════════════════════════════════
   KAGE CHAPTER I — The Sanmon (The Gate)
   ══════════════════════════════════════════════════════════ */
function KageGate() {
  return (
    <section className="kg-sec kg-gate" id="kage-gate">
      {/* foreground decoration */}
      <div className="kg-fg" aria-hidden="true">
        <span className="kg-fg-el kg-fg-wall">
          <img src="/secret-pathways-assets/foreground/png/temple-wall.webp" alt="" width="1536" height="884" loading="lazy" decoding="async" />
        </span>
        <span className="kg-fg-el kg-fg-pine">
          <img src="/secret-pathways-assets/foreground/png/pine-tree.webp" alt="" width="1024" height="1438" loading="lazy" decoding="async" />
        </span>
      </div>

      <Rv className="kg-sec-head" variant="fade">
        <span className="kg-k"><b>01</b> — The Sanmon</span>
        <span className="kg-rule" />
        <span className="kg-k kg-jp">山門</span>
      </Rv>

      <div className="kg-gate-grid">
        <Rv as="h2" className="kg-display">
          Charred cypress, worn stone, one gate left open.
        </Rv>
        <div className="kg-gate-copy">
          <Rv as="p" className="kg-lead">
            Kage begins where the city stops: a mountain gate of cedar burned black,
            standing in its own weather. The soot is not decoration. It is how a board is taught to survive a
            hundred rainy seasons, and the first thing this place asks you to understand.
          </Rv>
          <Rv as="p" className="kg-body" delay={80}>
            Climb the worn steps and the worship hall lifts out of the mist, its paper
            screens lit from inside like a lantern the size of a house. Above the eaves a vermilion moon holds
            its place, patient, half hidden. Nothing here is in a hurry. Neither, for the next ninety minutes,
            are you.
          </Rv>
          <Rv className="kg-arrowlink" variant="fade" delay={160}>
            <a href="#kage-gardens">
              <span>Cross the threshold</span>
              <span className="kg-ar">
                <svg viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" /></svg>
              </span>
            </a>
          </Rv>
        </div>
      </div>

      <Rv className="kg-gate-stats">
        <div><b>05</b><span>Chapters</span></div>
        <div><b>92</b><span>Minutes</span></div>
        <div><b>1611</b><span>Hall raised</span></div>
        <div><b>∞</b><span>Stillness</span></div>
      </Rv>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   KAGE CHAPTER II — Still Gardens
   ══════════════════════════════════════════════════════════ */
function KageGardens() {
  return (
    <section className="kg-sec kg-gardens" id="kage-gardens">
      {/* foreground decoration */}
      <div className="kg-fg" aria-hidden="true">
        <span className="kg-fg-el kg-fg-sakura kg-fg-sway">
          <img src="/secret-pathways-assets/foreground/png/sakura-branch.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
        </span>
        <span className="kg-fg-el kg-fg-bush">
          <img src="/secret-pathways-assets/foreground/png/garden-bush.webp" alt="" width="1717" height="876" loading="lazy" decoding="async" />
        </span>
      </div>

      <Rv className="kg-sec-head" variant="fade">
        <span className="kg-k"><b>02</b> — Still Gardens</span>
        <span className="kg-rule" />
        <span className="kg-k kg-jp">庭園</span>
      </Rv>

      <div className="kg-cards">
        {kageCards.map((card, i) => (
          <Rv key={card.id} className="kg-card" delay={i * 100}>
            <div
              className="kg-card-fr"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(3,6,9,.04) 36%, rgba(3,6,9,.72) 100%), url(${card.image})` }}
            >
              <span className="kg-card-ar">
                <svg viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" /></svg>
              </span>
              <i
                className={`kg-glow${card.flame ? ' kg-glow--flame' : ''}`}
                style={{
                  '--gx': card.glow.gx, '--gy': card.glow.gy, '--gr': card.glow.gr,
                  '--gt': card.glow.gt, '--gt2': card.glow.gt2, '--gc1': card.glow.gc1, '--gc2': card.glow.gc2,
                }}
              />
              <div className="kg-card-lab">
                <b>{card.title}</b>
                <span className="kg-jp">{card.jp}</span>
              </div>
            </div>
            <div className="kg-card-meta">
              <span>{card.meta}</span>
              <span>{card.idx}</span>
            </div>
          </Rv>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   KAGE CHAPTER III — Sacred Craft (Curriculum)
   ══════════════════════════════════════════════════════════ */
function KageCurriculum() {
  return (
    <section className="kg-sec kg-curriculum" id="kage-curriculum">
      {/* foreground decoration */}
      <div className="kg-fg" aria-hidden="true">
        <span className="kg-fg-el kg-fg-stones">
          <img src="/secret-pathways-assets/foreground/png/basalt-stones.webp" alt="" width="1536" height="996" loading="lazy" decoding="async" />
        </span>
        <span className="kg-fg-el kg-fg-grass">
          <img src="/secret-pathways-assets/foreground/png/tall-grass.webp" alt="" width="1717" height="916" loading="lazy" decoding="async" />
        </span>
      </div>

      <Rv className="kg-sec-head" variant="fade">
        <span className="kg-k"><b>03</b> — Sacred Craft</span>
        <span className="kg-rule" />
        <span className="kg-k kg-jp">手業</span>
      </Rv>

      <div className="kg-cur-head">
        <Rv as="h2" className="kg-display">
          Five chapters. Ninety minutes. One quiet mind.
        </Rv>
        <Rv as="p" className="kg-body-lg" delay={80}>
          Each chapter is a walk, not a lecture. You arrive at the gate, climb the
          steps, sit with the lantern, and leave with one thing worth keeping.
        </Rv>
      </div>

      <div className="kg-cur">
        {kageLessons.map((les, i) => (
          <Rv key={les.n} className="kg-les" delay={i * 60}>
            <span className="kg-les-k">{les.n}</span>
            <h3>{les.title}<em className="kg-jp">{les.jp}</em></h3>
            <p>{les.desc}</p>
            <span className="kg-les-t">{les.time}</span>
            <i className="kg-les-bar" />
          </Rv>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   KAGE CHAPTER IV — Afterlight (Closing CTA)
   ══════════════════════════════════════════════════════════ */
function KageAfterlight() {
  return (
    <section className="kg-sec kg-afterlight" id="kage-afterlight">
      {/* foreground decoration */}
      <div className="kg-fg" aria-hidden="true">
        <span className="kg-fg-el kg-fg-hill">
          <img src="/secret-pathways-assets/foreground/png/hill.webp" alt="" width="1774" height="887" loading="lazy" decoding="async" />
        </span>
        <span className="kg-fg-el kg-fg-ruins">
          <img src="/secret-pathways-assets/foreground/png/shrine-ruins.webp" alt="" width="1536" height="1001" loading="lazy" decoding="async" />
        </span>
      </div>

      <Rv className="kg-eyebrow" variant="fade">Chapter 04 — Afterlight</Rv>
      <Rv as="h2" className="kg-fin-title">Afterlight</Rv>
      <Rv as="p" className="kg-body-lg kg-fin-body" delay={80}>
        The gate does not close behind you. Take the walk whenever the noise
        gets loud — it is always the same path, and never the same light.
      </Rv>
      <Rv variant="fade" delay={160}>
        <a className="kg-cta" href="#top">
          <i />
          <span>Begin the walk</span>
          <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
            <path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" />
          </svg>
        </a>
      </Rv>
    </section>
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
        {/* vermilion vignette to blend iframe into content */}
        <div className="kage-vignette" />
        {/* ember canvas: ABOVE vignette so screen-blend light punches through */}
        <EmberOverlay />
      </div>

      {/* ── App overlay ── */}
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="#top">VIBING <span>CRAZY</span></a>
          <nav>
            <a href="#discover">Discover</a>
            <a href="#kage-showcase">Kage</a>
            <a href="#kage-gate">Temples</a>
            <a href="#kage-gardens">Gardens</a>
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

        {/* ── kage showcase ── */}
        <section className="kage-showcase" id="kage-showcase">
          <div className="kage-showcase-head">
            <div>
              <p className="kicker"><span />&#8197;00 / Featured Experience</p>
              <h2 className="kage-showcase-title">
                Enter the<br /><i>hidden realm.</i>
              </h2>
            </div>
            <p className="kage-showcase-sub">
              A five-chapter night walk through a Kyoto mountain temple.
              Charred cypress, lantern light and a vermilion moon — rendered
              live in WebGL. Scroll inside the gate.
            </p>
          </div>

          {/* the full interactive kage.html experience */}
          <div className="kage-window-wrap">
            {/* outer glow ring */}
            <div className="kage-window-ring" />
            {/* interactive iframe — allow-pointer-events, full sandbox */}
            <div className="kage-window">
              <iframe
                src="/kage.html"
                title="Kage — Hidden Realms of Kyoto"
                className="kage-window-iframe"
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
              />
              {/* top edge label */}
              <div className="kage-window-bar">
                <span className="kage-window-dot" />
                <span className="kage-window-dot" />
                <span className="kage-window-dot" />
                <span className="kage-window-title">KAGE — WHERE STILLNESS REVEALS THE UNSEEN</span>
                <a href="/kage.html" target="_blank" rel="noopener" className="kage-window-open">
                  Open full ↗
                </a>
              </div>
            </div>
            {/* side annotation */}
            <div className="kage-window-annot">
              <span className="kage-annot-line" />
              <span className="kage-annot-text">WebGL · Three.js · Live scene</span>
              <span className="kage-annot-line" />
            </div>
          </div>

          {/* chapter strip */}
          <div className="kage-chapters">
            {[
              { n: '01', jp: '山門', en: 'The Sanmon', sub: 'Charred cypress gate' },
              { n: '02', jp: '庭園', en: 'Still Gardens', sub: 'Lantern court' },
              { n: '03', jp: '手業', en: 'Sacred Craft', sub: 'Yakisugi & borrowed scenery' },
              { n: '04', jp: '残光', en: 'Afterlight', sub: 'Vermilion moon ritual' },
            ].map(ch => (
              <div key={ch.n} className="kage-ch">
                <span className="kage-ch-n">{ch.n}</span>
                <span className="kage-ch-jp">{ch.jp}</span>
                <b className="kage-ch-en">{ch.en}</b>
                <span className="kage-ch-sub">{ch.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Kage chapter sections (ported from kage.html) ── */}
        <KageGate />
        <KageGardens />
        <KageCurriculum />
        <KageAfterlight />

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
