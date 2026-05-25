import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CHAY_CE | WoW UI Profiles, Addons, Stream Tools",
  description:
    "CHAY_CE creator hub for World of Warcraft UI profiles, addons, stream tools, imports, custom media textures, Twitch clips, and community links.",
};

type DownloadCard = {
  title: string;
  label: string;
  image: string;
  description: string;
  href: string;
  button: string;
  external?: boolean;
};

const addonCards: DownloadCard[] = [
  {
    title: "ChayBar",
    label: "ADDON",
    image: "/images/chaybar-card.png",
    description:
      "A clean action bar addon built for performance, visibility, and a sharp Chay_CE style.",
    href: "https://www.curseforge.com/wow/addons/chaybar",
    button: "View on CurseForge",
    external: true,
  },
  {
    title: "ChayImages",
    label: "ADDON",
    image: "/images/chayimages-card.png",
    description:
      "Custom UI images, textures, and visuals for a sharper World of Warcraft setup.",
    href: "https://www.curseforge.com/wow/addons/chayimages",
    button: "View on CurseForge",
    external: true,
  },
  {
    title: "CHAY_CE Media Library",
    label: "MEDIA",
    image: "/images/chaymedia-logo.png",
    description:
      "Adds CHAY_CE Bushido textures to ElvUI, Details, nameplates, bars, and other LibSharedMedia-compatible addons.",
    href: "/downloads/ChayMedia.zip",
    button: "Download Media Library",
  },
  {
    title: "ElvUI Profile",
    label: "PROFILE",
    image: "/images/elvui-card.png",
    description:
      "My personal ElvUI profile for a clean, readable, gameplay-focused interface.",
    href: "/downloads/ElvuiSave.zip",
    button: "Download Profile",
  },
  {
    title: "Details! Profile",
    label: "PROFILE",
    image: "/images/details-card.png",
    description:
      "My personal Details! profile for clean damage tracking and readable meters.",
    href: "/downloads/details-profile.txt",
    button: "Download Profile",
  },
];

const importCards: DownloadCard[] = [
  {
    title: "EXBoss Import",
    label: "IMPORT",
    image: "/images/EXBoss.jpg",
    description:
      "EXBoss import setup for matching the CHAY_CE UI ecosystem.",
    href: "/downloads/ExBoss.txt",
    button: "Download Import",
  },
  {
    title: "EX WindTools Import",
    label: "IMPORT",
    image: "/images/EXBoss.jpg",
    description:
      "EX WindTools import setup made to fit the CHAY_CE UI layout.",
    href: "/downloads/ExwindTools.txt",
    button: "Download Import",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="header-wordmark-bg" aria-hidden="true" />

        <a className="brand-mark" href="#home" aria-label="CHAY_CE home">
          <img src="/images/chay-logo.png" alt="CHAY_CE" />
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#downloads">Downloads</a>
          <a href="#support">Support</a>
          <a href="https://discord.gg/q4thpsfSvm" target="_blank" rel="noreferrer">
            Community
          </a>
        </nav>

        <a
          className="watch-button"
          href="https://www.twitch.tv/chay_ce"
          target="_blank"
          rel="noreferrer"
        >
          Watch Live
        </a>
      </header>

      <section id="home" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Streaming • UI Systems • MMO Visuals • Community</p>

          <h1>
            <span>Welcome to the</span>
            <strong>CHAY_CE</strong>
            <em>Ecosystem</em>
          </h1>

          <p className="hero-subtitle">
            Cinematic UI. Clean visuals. Maximum immersion. Premium World of Warcraft
            UI profiles, custom visuals, stream branding, creator tools, and community
            systems built for performance.
          </p>

          <div className="hero-actions">
            <a
              className="primary-button"
              href="https://www.twitch.tv/chay_ce"
              target="_blank"
              rel="noreferrer"
            >
              Watch Live
            </a>
          </div>
        </div>

        <aside className="feature-panel" aria-label="Launch version panel">
          <p className="panel-kicker">Launch Version</p>

          <div className="video-frame">
            <video
              src="/video/chay-hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/images/chay-dragon.jpg"
            />
          </div>

          <h2>Simple. Clean. Expandable.</h2>
          <p>
            Start fresh with ElvUI, Details, ChayBar, ChayImages, ChayMedia,
            EXBoss, and EX WindTools. Built to grow later without turning your
            UI into clutter.
          </p>
        </aside>
      </section>

      <section className="quality-strip" aria-label="Site features">
        <article>
          <span>01</span>
          <h3>Premium Quality</h3>
          <p>UI systems built for clarity, speed, and clean presentation.</p>
        </article>

        <article>
          <span>02</span>
          <h3>Cinematic Design</h3>
          <p>Dark red MMO styling with stream-ready visuals.</p>
        </article>

        <article>
          <span>03</span>
          <h3>Creator Focused</h3>
          <p>Profiles, imports, tools, textures, and visuals built around content creation.</p>
        </article>

        <article>
          <span>04</span>
          <h3>Community Driven</h3>
          <p>Connected through Twitch, Discord, World of Warcraft, and stream team growth.</p>
        </article>
      </section>

      <section id="downloads" className="downloads-section">
        <p className="section-kicker">Downloads</p>
        <h2>Pick Your Download.</h2>
        <p className="section-intro">
          Each item below is its own separate download or external addon page.
        </p>

        <div className="download-grid">
          {addonCards.map((card) => (
            <DownloadCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="downloads-section imports-section">
        <p className="section-kicker">Imports</p>
        <h2>EX Imports.</h2>
        <p className="section-intro">
          Separate import files for EXBoss and EX WindTools.
        </p>

        <div className="download-grid import-grid">
          {importCards.map((card) => (
            <DownloadCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="support-section" aria-label="CHAY_CE media instructions">
        <div>
          <p className="section-kicker">How To</p>
          <h2>Use CHAY_CE textures.</h2>
          <p>
            Download ChayMedia, extract it into your World of Warcraft AddOns folder,
            reload the game, then select the CHAY_CE Bushido textures from ElvUI,
            Details, nameplates, cast bars, or any LibSharedMedia-compatible texture
            dropdown.
          </p>
        </div>

        <div className="support-actions">
          <a className="primary-button" href="/downloads/ChayMedia.zip">
            Download ChayMedia
          </a>
          <span className="secondary-button" aria-disabled="true">
            Reload WoW After Install
          </span>
        </div>
      </section>

      <section className="support-section">
        <div>
          <p className="section-kicker">Stream Clips</p>
          <h2>Watch the highlights.</h2>
          <p>
            Catch raid moments, funny wipes, stream highlights, community clips,
            and CHAY_CE Twitch moments directly from the official clips page.
          </p>
        </div>

        <div className="support-actions">
          <a
            className="primary-button"
            href="https://www.twitch.tv/chay_ce/clips"
            target="_blank"
            rel="noreferrer"
          >
            Watch Twitch Clips
          </a>
        </div>
      </section>

      <section className="support-section">
        <div>
          <p className="section-kicker">Community</p>
          <h2>Stream team Discord.</h2>
          <p>
            A separate stream team community space is planned for creators,
            collaborators, raid content, stream networking, and CHAY_CE community
            projects.
          </p>
        </div>

        <div className="support-actions">
          <span className="primary-button" aria-disabled="true">
            Stream Team Discord Coming Soon
          </span>
          <a
            className="secondary-button"
            href="https://discord.gg/q4thpsfSvm"
            target="_blank"
            rel="noreferrer"
          >
            Main Community Discord
          </a>
        </div>
      </section>

      <section id="support" className="support-section">
        <div>
          <p className="section-kicker">Support</p>
          <h2>Follow the build.</h2>
          <p>
            Watch live, grab updates, join the community, and keep the CHAY_CE UI
            ecosystem moving forward.
          </p>
        </div>

        <div className="support-actions">
          <a
            className="primary-button"
            href="https://www.twitch.tv/chay_ce"
            target="_blank"
            rel="noreferrer"
          >
            Twitch
          </a>
          <a
            className="secondary-button"
            href="https://discord.gg/q4thpsfSvm"
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>
          <a
            className="secondary-button"
            href="https://patreon.com/Chay_CE"
            target="_blank"
            rel="noreferrer"
          >
            Patreon
          </a>
          <span className="secondary-button" aria-disabled="true">
            Merch Coming Soon
          </span>
        </div>
      </section>

      <footer className="site-footer">
        <p>© 2026 CHAY_CE. All rights reserved.</p>
        <p>Built for World of Warcraft.</p>
      </footer>
    </main>
  );
}

function DownloadCard({ card }: { card: DownloadCard }) {
  return (
    <article className="download-card">
      <div className="card-label">{card.label}</div>

      <div className="card-image-wrap">
        <img src={card.image} alt={card.title} />
      </div>

      <h3>{card.title}</h3>
      <p>{card.description}</p>

      <a
        className="card-button"
        href={card.href}
        target={card.external ? "_blank" : undefined}
        rel={card.external ? "noreferrer" : undefined}
      >
        {card.button}
      </a>
    </article>
  );
}