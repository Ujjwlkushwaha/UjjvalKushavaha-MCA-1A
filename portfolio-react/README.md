# React Portfolio Website

A personal portfolio for a full-stack developer, built with **React + Vite** and plain CSS (no UI libraries).

## Run it

```bash
npm install
npm run dev      # opens at http://localhost:5173
npm run build    # production build in /dist
```

## Folder structure

```
src/
  main.jsx            entry point, mounts <App />
  App.jsx             puts all sections in order
  data/portfolio.js   Profile, project, skills, and service content
  components/         one file per section (Navbar, Hero, Projects, ...)
  styles/index.css    all styling, colours are CSS variables at the top
```

## Concepts used (good for viva)

- Functional components and props (`ProjectCard`, `SectionHeading`)
- `.map()` with `key` to render lists from data
- `useState` for the mobile menu and the contact form
- Controlled form inputs with simple validation
- CSS Grid / Flexbox, CSS variables, media queries, keyframe animation
- GSAP loading sequence and Framer Motion reveals, with reduced-motion support

Project and workspace photos are loaded from Unsplash and require an internet connection. The contact form is a front-end demo: it validates input locally but does not send or store submissions.
