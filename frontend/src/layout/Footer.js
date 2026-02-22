import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  const text = `© Copyright ${year} Dipak Portfolio. All rights reserved.`;

  return (
    <footer className="yazen-footer relative mt-10 border-t border-white/10 bg-[#151a2f]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7a3cff]/70 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 text-sm text-white/70 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="yazen-footer-primary">
          <div className="yazen-footer-kicker">Dipak Portfolio</div>
          <div className="yazen-footer-brand">Dipak</div>
          <div className="yazen-footer-desc">
            Full Stack Developer building fast, practical, and scalable digital products with clean UX.
          </div>
          <div className="yazen-footer-stats">
            <span className="yazen-footer-stat">MERN Stack</span>
            <span className="yazen-footer-stat">REST APIs</span>
            <span className="yazen-footer-stat">Responsive UI</span>
          </div>
          <div className="yazen-footer-cta">
            <Link to="/contact" className="yazen-footer-link-btn">Open To Work</Link>
          </div>
          <div className="yazen-footer-line" />
          <div className="yazen-footer-copy">{text}</div>
        </div>
        <div className="yazen-footer-meta lg:justify-self-end">
          <div className="yazen-footer-pill">Available for freelance and full-time roles</div>
          <div className="yazen-footer-note">Focused on business-ready web apps with reliable backend architecture and modern frontend quality.</div>
          <div className="yazen-footer-stack">React | Node.js | MongoDB | Express</div>
        </div>
      </div>
    </footer>
  );
}
