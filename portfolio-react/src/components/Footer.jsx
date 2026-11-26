import { profile } from "../data/portfolio.js";

function Footer() {
  return (
    <footer className="footer">
      <p>
        <span className="footer-mark">{profile.name}</span>
        <span>© {new Date().getFullYear()} · Made with care and a little React.</span>
      </p>
      <a href="#home">Back to top ↑</a>
    </footer>
  );
}

export default Footer;
