import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Github, Linkedin, Menu, X } from "lucide-react";
import Footer from "./Footer";
import { SocialLinksAPI } from "../services/social-links.service";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const defaultNavItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
  { to: "/service", label: "Service" },
  { to: "/project", label: "Project" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const socialQ = useQuery({ queryKey: ["social-links-public"], queryFn: SocialLinksAPI.getPublic });
  const isAdmin = location.pathname.startsWith("/admin");
  const isHome = location.pathname === "/";
  const siteName = "Dipak";
  const navItems = defaultNavItems;
  const social = socialQ.data || {};

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="hafiz-theme yazen-public min-h-screen text-white">
      <header className={cx("yazen-header", isHome ? "is-home" : "is-inner")}>
        <div className="yazen-header-inner yazen-header-shell relative">
          <Link to="/" className="yazen-logo">
            <span>{siteName}</span>
            <small>Portfolio</small>
          </Link>

          <nav className="yazen-nav-dock hidden items-center gap-8 lg:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    "yazen-nav-link",
                    isActive ? "is-active" : ""
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="yazen-header-social hidden lg:flex lg:absolute lg:right-0 items-center gap-5">
            {social.githubUrl ? (
              <div className="yazen-social-tooltip yazen-social-tooltip--below">
                <a
                  href={social.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="yazen-social-icon"
                  aria-label="GitHub"
                >
                  <Github size={19} />
                </a>
                <span className="yazen-social-tooltip-label">GitHub</span>
              </div>
            ) : null}
            {social.linkedinUrl ? (
              <div className="yazen-social-tooltip yazen-social-tooltip--below">
                <a
                  href={social.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="yazen-social-icon"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={19} />
                </a>
                <span className="yazen-social-tooltip-label">LinkedIn</span>
              </div>
            ) : null}
          </div>

          <button
            className="yazen-mobile-toggle rounded-md p-2 text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open ? (
          <>
          <button
            className="yazen-mobile-backdrop lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div id="mobile-nav-panel" className="yazen-mobile lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cx(
                      "yazen-mobile-link",
                      isActive ? "is-active" : ""
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-3 flex items-center gap-5 px-2">
                {social.githubUrl ? (
                  <div className="yazen-social-tooltip yazen-social-tooltip--below">
                    <a
                      href={social.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="yazen-social-icon"
                      aria-label="GitHub"
                    >
                      <Github size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">GitHub</span>
                  </div>
                ) : null}
                {social.linkedinUrl ? (
                  <div className="yazen-social-tooltip yazen-social-tooltip--below">
                    <a
                      href={social.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="yazen-social-icon"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                    <span className="yazen-social-tooltip-label">LinkedIn</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          </>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
