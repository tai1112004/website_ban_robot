import { Bot, Menu, X, UserRound } from "lucide-react";
import styles from "./Navbar.module.css";
import { useEffect, useState } from "react";
import CartLink from "./cart/CartLink";
const links = [
  ["HOME", "#home"],
  ["FEATURES", "#features"],
  ["TECHNOLOGY", "#technology"],
  ["PERSONALITY", "#experience"],
  ["MODELS", "#models"],
];
export default function Navbar({
  watchFilm,
  menu,
  setMenu,
  homeHref = "#home",
  discoverHref = "/products/basic",
  discoverLabel = "VIEW ROBO BASIC",
  sectionPrefix = "",
}: {
  watchFilm?: () => void;
  menu: boolean;
  setMenu: (value: boolean) => void;
  homeHref?: string;
  discoverHref?: string;
  discoverLabel?: string;
  sectionPrefix?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header
      className={`navbar ${styles.header} ${scrolled || menu ? "nav-scrolled" : ""}`}
    >
      <a href={homeHref} className="brand" aria-label="Robo AI home">
        <Bot size={29} strokeWidth={1.8} /> ROBO<span>AI</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a
            key={label}
            href={label === "HOME" ? homeHref : `${sectionPrefix}${href}`}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <a
          href="/account"
          className={styles.accountLink}
          aria-label="My account"
        >
          <UserRound size={19} />
        </a>
        <CartLink />
        {watchFilm && (
          <button className="nav-film" onClick={watchFilm}>
            WATCH FILM
          </button>
        )}
        <a
          className="button button-primary nav-discover"
          href={discoverHref}
          onClick={() => setMenu(false)}
        >
          {discoverLabel} ↗
        </a>
        <button
          className="icon-button menu-toggle"
          onClick={() => setMenu(!menu)}
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="mobile-navigation"
        >
          {menu ? <X /> : <Menu />}
        </button>
      </div>
      {menu && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {links.map(([label, href], i) => (
            <a
              key={label}
              href={label === "HOME" ? homeHref : `${sectionPrefix}${href}`}
              onClick={() => setMenu(false)}
            >
              <span>0{i + 1}</span>
              {label}
            </a>
          ))}
          {watchFilm && (
            <button
              className="film-button"
              onClick={() => {
                setMenu(false);
                watchFilm();
              }}
            >
              WATCH FILM ↗
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
