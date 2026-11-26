import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Model from './Model.jsx'
import { links, stats, skills, projects, steps } from './data.js'

gsap.registerPlugin(ScrollTrigger)

const navigation = [
  ['hero', 'Homee'],
  ['about', 'About'],
  ['skills', 'Stack'],
  ['work', 'Projects'],
  ['now', 'Now'],
  ['contact', 'Contact'],
]

function Loader({ onReveal, reducedMotion }) {
  const [gone, setGone] = useState(false)
  const rootRef = useRef(null)
  const countRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    if (gone) return undefined
    const loaderElement = rootRef.current
    if (!loaderElement) {
      onReveal()
      setGone(true)
      return undefined
    }

    const progress = { value: 0 }
    const duration = reducedMotion ? 0.01 : 0.72
    const timeline = gsap.timeline({
      onComplete: () => {
        onReveal()
        setGone(true)
      },
    })

    timeline
      .to(progress, {
        value: 100,
        duration,
        ease: 'power1.out',
        onUpdate: () => {
          const value = Math.round(progress.value)
          if (countRef.current) countRef.current.textContent = String(value).padStart(2, '0')
          if (rootRef.current) rootRef.current.setAttribute('aria-valuenow', String(value))
          if (barRef.current) gsap.set(barRef.current, { scaleX: progress.value / 100 })
        },
      })
      .to(loaderElement, {
        yPercent: -100,
        duration: reducedMotion ? 0 : 0.42,
        ease: 'power3.inOut',
      })

    return () => timeline.kill()
  }, [gone, onReveal, reducedMotion])

  if (gone) return null

  return (
    <div
      ref={rootRef}
      className="loader"
      role="progressbar"
      aria-label="Loading Ujjval Kushavaha’s portfolio"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="0"
    >
      <div className="loader-mark">UK<span>.</span></div>
      <div className="loader-count"><span ref={countRef}>00</span><small>%</small></div>
      <div className="loader-bar"><i ref={barRef} /></div>
      <p className="loader-caption">Making the scene</p>
    </div>
  )
}

const Head = ({ eyebrow, title, sub }) => (
  <>
    <div className="eyebrow rv">{eyebrow}</div>
    <h2 className="rv">{title}</h2>
    {sub && <p className="sub rv">{sub}</p>}
  </>
)

export default function App() {
  const [ready, setReady] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const appRef = useRef(null)
  const reveal = useCallback(() => setReady(true), [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (!ready) return undefined

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.hero-in, .model', { y: 0, scale: 1, opacity: 1 })
        return
      }

      gsap.from('.hero-in', { y: 36, opacity: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' })
      gsap.from('.model', { scale: 0.9, opacity: 0, duration: 1.1, ease: 'expo.out' })
    }, appRef)

    return () => context.revert()
  }, [ready, reducedMotion])

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('.rv', { y: 0, opacity: 1 })
        return
      }

      gsap.utils.toArray('.rv').forEach((element) => {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        })
      })
    }, appRef)

    return () => context.revert()
  }, [reducedMotion])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip-link" href="#hero">Skip to content</a>
      <Loader onReveal={reveal} reducedMotion={reducedMotion} />
      <div ref={appRef} className={ready ? 'site-shell is-ready' : 'site-shell'}>
        <header className="site-header">
          <nav className="site-nav" aria-label="Main navigation">
            <a className="brand" href="#hero" onClick={closeMenu} aria-label="Ujjval Kushavaha, home">
              ujjval<span>.</span>
            </a>
            <button
              className="nav-toggle"
              type="button"
              aria-controls="primary-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
            <div id="primary-navigation" className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
              {navigation.map(([id, title]) => (
                <a key={id} href={`#${id}`} onClick={closeMenu}>{title}</a>
              ))}
            </div>
            <a className="nav-contact" href="#contact" onClick={closeMenu}>Let’s connect <span>↗</span></a>
          </nav>
        </header>

        <main>
          <section id="hero">
            <div className="inner hero-layout">
              <div className="stage"><Model /></div>
              <div className="hero-copy">
                <p className="hero-kicker hero-in">Developer / Kanpur, India</p>
                <h1 className="hero-in">Ujjval<br /><em>Kushavaha</em></h1>
                <div className="role hero-in">Full-Stack Developer <span>·</span> AI &amp; DSA Enthusiast</div>
                <p className="sub hero-in">I turn ideas into reality with code, building modern, animated web experiences.</p>
                <div className="btns hero-in">
                  <a className="btn p" href="#work">Explore my work <span>↘</span></a>
                  <a className="btn" href="#contact">Get in touch</a>
                </div>
                <div className="hero-footnote hero-in"><span className="availability-dot" /> Open to collaborations</div>
              </div>
              <span className="hero-index" aria-hidden="true">01 / 06</span>
            </div>
          </section>

          <section id="about" className="section-about">
            <div className="inner about-layout">
              <div className="section-intro">
                <Head eyebrow="01 / About" title={<>Building for the web,<br />solving problems daily.</>} />
              </div>
              <div className="about-copy">
                <p className="sub rv">I’m a MERN-stack and Python developer from Kanpur, India, passionate about AI, web animations and performance. Alongside building products, I practice data structures and algorithms with an eye on cracking top-tier tech interviews, and I’m always open to collaborations.</p>
                <div className="stats">
                  {stats.map(([value, label]) => (
                    <div className="stat rv" key={label}><b>{value}</b><span>{label}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="skills" className="section-skills">
            <div className="inner">
              <Head eyebrow="02 / Tech stack" title="Tools I work with." sub="A growing toolkit for building end-to-end products and expressive interfaces." />
              <div className="skill-groups">
                {skills.map(([group, items], index) => (
                  <div className="skill-group rv" key={group}>
                    <span className="skill-index">0{index + 1}</span>
                    <h3>{group}</h3>
                    <div className="chips">{items.map((item) => <span key={item}>{item}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="work" className="section-work">
            <div className="inner">
              <div className="work-heading">
                <Head eyebrow="03 / Selected projects" title="Ideas, made tangible." sub="A selection of things I’ve built, explored and learned from." />
                <span className="work-count">06 projects</span>
              </div>
              <div className="grid">
                {projects.map(([title, description, tags, url], index) => (
                  <a className="card rv" href={url} target="_blank" rel="noopener noreferrer" key={title}>
                    <span className="num">0{index + 1}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <div className="tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className="go">View on GitHub <span>↗</span></div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section id="now" className="section-now">
            <div className="inner">
              <Head eyebrow="04 / Right now" title="What I’m focused on." sub="Keep learning, keep building, and stay curious about what’s next." />
              <div className="steps">
                {steps.map(([title, description], index) => (
                  <article className="step rv" key={title}>
                    <span className="step-index">0{index + 1}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="section-contact">
            <div className="inner contact-layout">
              <div>
                <Head eyebrow="05 / Contact" title={<>Let’s build<br /><em>something great.</em></>} sub="Open to collaborations, internships and exciting projects." />
              </div>
              <div className="contact-links rv">
                <p>Find me around the web</p>
                <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a>
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span>↗</span></a>
                <a href={links.codolio} target="_blank" rel="noopener noreferrer">Codolio <span>↗</span></a>
              </div>
            </div>
          </section>
        </main>
        <footer className="site-footer">
          <a className="brand" href="#hero">ujjval<span>.</span></a>
          <span>© {new Date().getFullYear()} Ujjval Kushavaha</span>
          <a href="#hero">Back to top ↑</a>
        </footer>
      </div>
    </>
  )
}
