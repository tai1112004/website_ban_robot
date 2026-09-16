import {
  BookOpen,
  GraduationCap,
  Languages,
  Smile,
  Landmark,
  BriefcaseBusiness,
  SlidersHorizontal,
  ArrowUpRight,
  AudioLines,
} from "lucide-react";
import { SectionTitle } from "./ui/SectionTitle";
const packs = [
  {
    name: "GENERAL ASSISTANT",
    text: "A little help with everyday questions.",
    Icon: BookOpen,
  },
  {
    name: "EDUCATION",
    text: "Make room for curiosity and discovery.",
    Icon: GraduationCap,
  },
  {
    name: "ENGLISH PRACTICE",
    text: "A companion for everyday conversation.",
    Icon: Languages,
  },
  { name: "KIDS", text: "A world of stories and questions.", Icon: Smile },
  {
    name: "MUSEUM GUIDE",
    text: "Bring places and their stories closer.",
    Icon: Landmark,
  },
  {
    name: "BUSINESS",
    text: "Knowledge shaped around your work.",
    Icon: BriefcaseBusiness,
  },
  {
    name: "CUSTOM",
    text: "Start with what matters to you.",
    Icon: SlidersHorizontal,
  },
];
export default function KnowledgePacks({
  index = "07",
  product = false,
}: {
  index?: string;
  product?: boolean;
}) {
  return (
    <section id="knowledge" className="knowledge section-space">
      <div className="section-heading">
        <SectionTitle index={index} label="A WORLD OF KNOWLEDGE. YOUR WORLD.">
          WHAT SHOULD
          <br />
          <span className="accent">ROBO KNOW?</span>
        </SectionTitle>
        <p data-reveal>
          Knowledge Packs let Robo adapt to different people, places and
          purposes.
        </p>
      </div>
      <div className="knowledge-layout">
        <article
          id={product ? "featured-knowledge" : undefined}
          className="featured-pack"
          data-reveal
        >
          <p className="eyebrow">
            <span className="status-dot" /> FIRST KNOWLEDGE PACK
          </p>
          <div className="pack-title">
            <span lang="vi">
              HÁT <br />
              SẮC BÙA
            </span>
            <AudioLines size={72} strokeWidth={0.8} aria-hidden="true" />
          </div>
          <h3>KNOWLEDGE PACK</h3>
          <p>
            A place for cultural knowledge.
            <br />A new way to explore its stories.
          </p>
          <div className="featured-pack-bottom">
            <span>KNOWLEDGE, WITH CHARACTER.</span>
            <BookOpen size={24} strokeWidth={1.1} />
          </div>
        </article>
        <div className="pack-directory">
          <p className="pack-intro micro">
            ONE COMPANION. DIFFERENT POSSIBILITIES.
          </p>
          {packs.map(({ name, text, Icon }) => (
            <div className="pack-row" key={name} data-reveal>
              <Icon size={21} strokeWidth={1.3} />
              <div>
                <h3>{name}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
          <p className="pack-note">A preview of the Knowledge Pack concept.</p>
        </div>
      </div>
      <a
        href={product ? "#featured-knowledge" : "#models"}
        className="knowledge-link"
      >
        {product ? "EXPLORE KNOWLEDGE" : "FIND THE ROBO THAT FITS YOUR WORLD"}{" "}
        <ArrowUpRight size={18} />
      </a>
    </section>
  );
}
