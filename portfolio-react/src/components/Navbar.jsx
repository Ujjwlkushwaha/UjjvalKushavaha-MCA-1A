import { useState } from "react";
import { navLinks, profile } from "../data/portfolio.js";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = profile.name.split(" ")[0].toLowerCase();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a className="wordmark" href="#home" onClick={closeMenu} aria-label={`${profile.name}, home`}>
          {firstName}<span>.</span>
        </a>

        <nav
          id="primary-navigation"
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="btn btn-small">
          Let’s talk
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
