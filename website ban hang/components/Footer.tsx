import { Bot } from "lucide-react";
export default function Footer({
  info,
  homeHref = "#home",
  overviewHref = homeHref,
  sectionPrefix = "",
}: {
  info: (name: string) => void;
  homeHref?: string;
  overviewHref?: string;
  sectionPrefix?: string;
}) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <a href={homeHref} className="brand">
            <Bot size={30} /> ROBO<span>AI</span>
          </a>
          <p>
            A little intelligence.
            <br />A lot of personality.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h3>PRODUCT</h3>
            <a href={overviewHref}>Overview</a>
            <a href={`${sectionPrefix}#features`}>Features</a>
            <a href={`${sectionPrefix}#technology`}>Technology</a>
            <a href={`${sectionPrefix}#models`}>Models</a>
          </div>
          <div>
            <h3>PLATFORM</h3>
            <a href={`${sectionPrefix}#experience`}>Personality</a>
            <a href={`${sectionPrefix}#memory`}>Memory</a>
            <a href={`${sectionPrefix}#knowledge`}>Knowledge Packs</a>
          </div>
          {[
            ["COMPANY", "About", "Research", "Contact"],
            ["SUPPORT", "Help", "FAQ"],
          ].map(([title, ...links]) => (
            <div key={title}>
              <h3>{title}</h3>
              {links.map((link) => (
                <button key={link} onClick={() => info(link)}>
                  {link}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 ROBO AI. All rights reserved.</span>
        <span>
          <button onClick={() => info("Privacy")}>Privacy</button>
          <button onClick={() => info("Terms")}>Terms</button>
        </span>
        <a href={overviewHref}>BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}
