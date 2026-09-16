import { useState } from "react";
import { ArrowUpRight, Search as SearchIcon } from "lucide-react";
import { Modal } from "./ui/Modal";
const entries = [
  {
    title: "Robo AI One",
    text: "Your intelligent companion — $499",
    href: "#shop",
  },
  {
    title: "Technology",
    text: "AI core, voice array, vision sensor and motion",
    href: "#technology",
  },
  {
    title: "Design & features",
    text: "Vision, voice, personality and battery",
    href: "#design",
  },
  {
    title: "Personality",
    text: "Normal, happy, curious and sleepy",
    href: "#experience",
  },
];
export default function Search({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const results = entries.filter((item) =>
    `${item.title} ${item.text}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <Modal title="Discover Robo" onClose={onClose}>
      <label className="search-field">
        <SearchIcon size={20} />
        <input
          autoFocus
          type="search"
          aria-label="Search products and features"
          placeholder="Search products, technology, personality…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className="micro search-count" role="status">
        {results.length} RESULTS
      </p>
      <div className="search-results">
        {results.map((item) => (
          <a key={item.title} href={item.href} onClick={onClose}>
            <span>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </span>
            <ArrowUpRight size={20} />
          </a>
        ))}
        {results.length === 0 && (
          <p>No matches. Try “Robo”, “voice” or “personality”.</p>
        )}
      </div>
    </Modal>
  );
}
