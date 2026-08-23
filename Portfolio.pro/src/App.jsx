import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import './App.css'

const projects = [
  { title: 'Northstar', type: 'Web', year: '2024', description: 'A calm operating system for ambitious teams.', tags: ['Product design', 'React'], accent: 'coral' },
  { title: 'Aperture', type: 'Brand', year: '2023', description: 'A visual identity for a new kind of camera studio.', tags: ['Art direction', 'Identity'], accent: 'lime' },
  { title: 'Kindred', type: 'Web', year: '2023', description: 'Making meaningful introductions feel effortless.', tags: ['Strategy', 'Interface'], accent: 'blue' },
  { title: 'Morrow', type: 'Experiments', year: '2022', description: 'An interactive study in light, space, and attention.', tags: ['Three.js', 'Motion'], accent: 'yellow' },
]
const skills = ['Product strategy', 'Creative direction', 'Design systems', 'React / TypeScript', 'Three.js', 'Motion design']

function OrbitalScene() {
  const group = useRef(null)
  useFrame(({ clock }) => { if (group.current) { group.current.rotation.y = clock.getElapsedTime() * 0.16; group.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4) * 0.08 } })
  return <group ref={group}><mesh><icosahedronGeometry args={[1.25, 2]} /><meshStandardMaterial color="#e8ff72" wireframe transparent opacity={0.7} /></mesh><mesh rotation={[0.4, 0.2, 0]}><torusGeometry args={[1.75, 0.015, 8, 96]} /><meshBasicMaterial color="#ff674d" /></mesh><mesh rotation={[1.1, 0.3, 0.8]}><torusGeometry args={[2.05, 0.012, 8, 96]} /><meshBasicMaterial color="#79a9ff" /></mesh><mesh position={[0.9, 0.7, 0.6]}><sphereGeometry args={[0.12, 16, 16]} /><meshBasicMaterial color="#ff674d" /></mesh></group>
}
function ParticleField() {
  const points = useMemo(() => { const positions = new Float32Array(240); for (let index = 0; index < positions.length; index += 3) { positions[index] = Math.sin(index * 12.7) * 4.5; positions[index + 1] = Math.cos(index * 7.3) * 3.5; positions[index + 2] = Math.sin(index * 3.1) * 2 } return positions }, [])
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} /></bufferGeometry><pointsMaterial color="#79a9ff" size={0.025} transparent opacity={0.7} /></points>
}
function Scene() { return <Canvas camera={{ position: [0, 0, 6], fov: 48 }} dpr={[1, 1.5]}><ambientLight intensity={1.5} /><Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.4}><OrbitalScene /></Float><ParticleField /><OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} /></Canvas> }
function SectionHeading({ eyebrow, title, copy }) { return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div> }

function App() {
  const [filter, setFilter] = useState('All')
  const [sent, setSent] = useState(false)
  const visibleProjects = filter === 'All' ? projects : projects.filter((project) => project.type === filter)
  return <main>
    <nav className="nav"><a className="wordmark" href="#top">PORTFOLIO<span>.PRO</span></a><div className="nav-links"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></div><a className="status" href="#contact"><i /> Available for work</a></nav>
    <section className="hero-section" id="top"><div className="hero-copy"><span className="eyebrow">Independent designer + developer / 2024</span><h1>Ideas with<br /><em>dimension.</em></h1><p>I build expressive digital experiences for people shaping what comes next.</p><a className="arrow-link" href="#work">Explore selected work <span>↘</span></a></div><div className="scene-wrap"><Scene /><span className="scene-label">Interactive study / 001</span></div><div className="scroll-note">Scroll to wander <span>↓</span></div></section>
    <section className="intro section-rule"><p className="big-statement">A small studio for <span>big shifts.</span><br />Strategy, identity, and digital<br />products with a pulse.</p><div className="intro-note">Based between the<br />practical and the possible.<br /><br /><span>01 - 04</span></div></section>
    <section className="work-section content-section" id="work"><SectionHeading eyebrow="Selected work / 01" title="Things I have made" copy="A few recent collaborations and experiments. Each one starts with a question." /><div className="filters">{['All', 'Web', 'Brand', 'Experiments'].map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="project-grid">{visibleProjects.map((project, index) => <motion.article className={`project-card ${project.accent}`} key={project.title} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}><div className="project-visual"><span>{String(index + 1).padStart(2, '0')}</span><div className="visual-shape" /></div><div className="project-meta"><div><h3>{project.title}</h3><p>{project.description}</p></div><span>{project.year}</span></div><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></motion.article>)}</div></section>
    <section className="about-section content-section section-rule" id="about"><div><SectionHeading eyebrow="A little about / 02" title="Useful, curious, human." /></div><div className="about-body"><p className="about-lead">I am Sachin, a multidisciplinary creative who likes working where clear thinking meets visual surprise.</p><p>Over the last 7 years, I have helped teams turn early, fuzzy ideas into products people want to spend time with. The best work usually lives somewhere between the brief and the beautiful accident.</p><div className="skills">{skills.map((skill, index) => <span key={skill}><b>0{index + 1}</b>{skill}</span>)}</div></div></section>
    <section className="contact-section content-section" id="contact"><div className="contact-copy"><SectionHeading eyebrow="Start a conversation / 03" title={<>Have a good<br /><em>question?</em></>} /><p>Tell me what you are working on, what feels stuck, or what you are curious about.</p><a href="mailto:hello@portfolio.pro" className="email-link">hello@portfolio.pro <span>↗</span></a></div><form onSubmit={(event) => { event.preventDefault(); setSent(true) }}><label>Name<input required type="text" placeholder="Your name" /></label><label>Email<input required type="email" placeholder="you@company.com" /></label><label>What is on your mind?<textarea required rows="4" placeholder="A few words is plenty..." /></label><button className="submit-button" type="submit">{sent ? 'Message ready to send' : 'Send an inquiry'} <span>↗</span></button></form></section>
    <footer><a className="wordmark" href="#top">PORTFOLIO<span>.PRO</span></a><p>Made with intention, somewhere on Earth.</p><div className="socials"><a href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="#top">Back to top ↑</a></div></footer>
  </main>
}
export default App
