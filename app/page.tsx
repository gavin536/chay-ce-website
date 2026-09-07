import type { Metadata } from "next";
import { CommunityFeedbackForm } from "./components/CommunityFeedbackForm";
import { MerchPreviewButton } from "./components/MerchPreviewButton";

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

type RaiderIoScoreSegment = {
  score?: number;
  color?: string;
};

type RaiderIoSeasonScore = {
  season?: string;
  scores?: {
    all?: number;
  };
  segments?: {
    all?: RaiderIoScoreSegment;
  };
};

type RaiderIoRank = {
  world?: number;
  region?: number;
  realm?: number;
};

type RaiderIoRun = {
  keystone_run_id?: number;
  dungeon?: string;
  short_name?: string;
  mythic_level?: number;
  completed_at?: string;
  clear_time_ms?: number;
  par_time_ms?: number;
  num_keystone_upgrades?: number;
  url?: string;
};

type RaiderIoRaidProgress = {
  summary?: string;
  expansion_id?: number;
  total_bosses?: number;
  normal_bosses_killed?: number;
  heroic_bosses_killed?: number;
  mythic_bosses_killed?: number;
};

type RaiderIoCharacterProfile = {
  name?: string;
  realm?: string;
  region?: string;
  class?: string;
  active_spec_name?: string;
  faction?: string;
  thumbnail_url?: string;
  profile_url?: string;
  gear?: {
    item_level_equipped?: number;
  };
  raid_progression?: Record<string, RaiderIoRaidProgress>;
  mythic_plus_scores_by_season?: RaiderIoSeasonScore[];
  mythic_plus_ranks?: {
    overall?: RaiderIoRank;
    class?: RaiderIoRank;
    dps?: RaiderIoRank;
    class_dps?: RaiderIoRank;
  };
  mythic_plus_recent_runs?: RaiderIoRun[];
};

type CharacterProfileData = {
  profile: RaiderIoCharacterProfile | null;
  unavailable: boolean;
};

const characterProfileUrl = "https://raider.io/characters/us/malfurion/Chay";
const armoryProfileUrl = "https://worldofwarcraft.blizzard.com/en-us/character/us/malfurion/chay";
const raiderIoFields = [
  "gear",
  "raid_progression",
  "mythic_plus_scores_by_season:current",
  "mythic_plus_ranks",
  "mythic_plus_recent_runs",
  "mythic_plus_best_runs",
].join(",");

async function getCharacterProfile(): Promise<CharacterProfileData> {
  const params = new URLSearchParams({
    region: "us",
    realm: "Malfurion",
    name: "Chay",
    fields: raiderIoFields,
  });

  try {
    const response = await fetch(
      `https://raider.io/api/v1/characters/profile?${params.toString()}`,
      {
        next: { revalidate: 900 },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!response.ok) {
      return { profile: null, unavailable: true };
    }

    const profile = (await response.json()) as RaiderIoCharacterProfile;

    return { profile, unavailable: false };
  } catch {
    return { profile: null, unavailable: true };
  }
}

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
    title: "ChayChat",
    label: "ADDON",
    image: "/images/chay-logo.png",
    description:
      "A Chay_CE styled whisper and chat popout addon built for cleaner messages, better visibility, and stream-friendly chat control.",
    href: "/downloads/ChayChat.zip",
    button: "Download Addon",
  },
  {
    title: "ChayAlert HUD",
    label: "ADDON",
    image: "/images/chay-logo.png",
    description:
      "Custom World of Warcraft combat alert HUD with configurable mechanic alerts, circles, timeline tracking, sounds, and TTS.",
    href: "/downloads/ChayAlertHUD.zip",
    button: "Download Addon",
  },
  {
    title: "ChayLFGRegions",
    label: "ADDON",
    image: "/images/chay-logo.png",
    description:
      "Displays useful region information for World of Warcraft Group Finder listings.",
    href: "/downloads/ChayLFGRegions.zip",
    button: "Download Addon",
  },
  {
    title: "ChayDemonicCore",
    label: "ADDON",
    image: "/images/chay-logo.png",
    description:
      "A lightweight World of Warcraft addon for tracking Demonic Core procs and related Demonology Warlock information.",
    href: "/downloads/ChayDemonicCore.zip",
    button: "Download Addon",
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

export default async function Home() {
  const characterProfile = await getCharacterProfile();

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
          <a href="https://scymplex.com/" target="_blank" rel="noreferrer">
            Addons made by Scymplex
          </a>
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
            Start fresh with ElvUI, Details, ChayBar, ChayImages, ChayChat,
            ChayMedia, and EX WindTools. Built to grow later without
            turning your UI into clutter.
          </p>
        </aside>
      </section>

      <CharacterProfileSection data={characterProfile} />

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
          <MerchPreviewButton />
        </div>
      </section>

      <section className="support-section feedback-section" aria-labelledby="feedback-title">
        <div>
          <p className="section-kicker">Community Feedback</p>
          <h2 id="feedback-title">Share Your Ideas.</h2>
          <p>
            Have an addon idea, website suggestion, bug report, or something you&apos;d like
            to see added to the CHAY_CE ecosystem? Send it here.
          </p>
        </div>

        <CommunityFeedbackForm />
      </section>

      <footer className="site-footer">
        <p>© 2026 CHAY_CE. All rights reserved.</p>
        <p>Built for World of Warcraft.</p>
      </footer>
    </main>
  );
}

function CharacterProfileSection({ data }: { data: CharacterProfileData }) {
  const profile = data.profile;
  const seasonScore = profile?.mythic_plus_scores_by_season?.[0];
  const score = seasonScore?.scores?.all ?? seasonScore?.segments?.all?.score;
  const scoreColor = seasonScore?.segments?.all?.color;
  const rank = profile?.mythic_plus_ranks?.overall?.region;
  const raidProgression = getCurrentRaidProgression(profile?.raid_progression);
  const itemLevel = profile?.gear?.item_level_equipped;
  const recentRuns = profile?.mythic_plus_recent_runs?.slice(0, 3) ?? [];
  const recentKey = recentRuns[0];
  const characterName = profile?.name ?? "Chay";
  const realm = profile?.realm ?? "Malfurion";
  const region = (profile?.region ?? "us").toUpperCase();
  const characterClass = profile?.class;
  const spec = profile?.active_spec_name;
  const faction = profile?.faction;
  const profileUrl = profile?.profile_url ?? characterProfileUrl;

  return (
    <section className="character-profile-section" aria-labelledby="character-profile-title">
      <div className="character-profile-shell">
        <div className="character-profile-heading">
          <p className="section-kicker">Live World of Warcraft Data</p>
          <h2 id="character-profile-title">CHAY // Character Profile</h2>
        </div>

        <div className="character-dashboard">
          <div className="character-identity-panel">
            <div className="scanline" aria-hidden="true" />
            <div className="character-portrait-wrap">
              {profile?.thumbnail_url ? (
                <img src={profile.thumbnail_url} alt={`${characterName} character portrait`} />
              ) : (
                <div className="portrait-fallback" aria-label="Character portrait unavailable">
                  CHAY
                </div>
              )}
            </div>

            <div className="character-id-copy">
              <p className="character-callout">{data.unavailable ? "Data Temporarily Unavailable" : "Raider.IO Dossier"}</p>
              <h3>{characterName}</h3>
              <p className="character-realm">{realm} • {region}</p>

              <div className="character-tags" aria-label="Character details">
                {characterClass ? <span>{characterClass}</span> : null}
                {spec ? <span>{spec}</span> : null}
                {faction ? <span>{formatTitle(faction)}</span> : null}
                {typeof itemLevel === "number" ? <span>{itemLevel} Equipped</span> : null}
              </div>
            </div>
          </div>

          <div className="character-stats-grid" aria-label="Character stats">
            <ProfileStat
              label="Mythic+ Score"
              value={formatScore(score)}
              detail="Current overall score"
              featured
              valueColor={scoreColor}
            />
            <ProfileStat
              label="Mythic+ Rank"
              value={formatRank(rank)}
              detail={rank ? "US overall rank" : "Ranking unavailable"}
            />
            <ProfileStat
              label="Raid Progression"
              value={raidProgression?.summary ?? "Unavailable"}
              detail={raidProgression?.name ?? "No raid progression returned"}
            />
            <ProfileStat
              label="Item Level"
              value={typeof itemLevel === "number" ? itemLevel.toString() : "Unavailable"}
              detail="Equipped gear"
            />
          </div>

          <div className="recent-key-panel">
            <p className="panel-kicker">Recent Key</p>
            {recentKey ? (
              <div className="recent-key-content">
                <div>
                  <span className="key-level">+{recentKey.mythic_level}</span>
                  <h3>{recentKey.dungeon ?? recentKey.short_name ?? "Unknown Dungeon"}</h3>
                </div>
                <dl>
                  <div>
                    <dt>Status</dt>
                    <dd>{formatRunStatus(recentKey)}</dd>
                  </div>
                  <div>
                    <dt>Upgrades</dt>
                    <dd>{formatUpgrades(recentKey.num_keystone_upgrades)}</dd>
                  </div>
                  <div>
                    <dt>Completion</dt>
                    <dd>{formatCompletion(recentKey)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="empty-profile-state">No recent Mythic+ runs returned.</p>
            )}
          </div>

          <div className="recent-activity-panel">
            <p className="panel-kicker">Recent Activity</p>
            <div className="activity-list">
              {recentRuns.length > 0 ? (
                recentRuns.map((run) => (
                  <RecentRunRow key={`${run.keystone_run_id ?? run.completed_at ?? run.dungeon}`} run={run} />
                ))
              ) : (
                <p className="empty-profile-state">No recent activity returned.</p>
              )}
            </div>
          </div>
        </div>

        <div className="character-profile-actions">
          <a
            className="primary-button"
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Raider.IO Profile
          </a>
          <a
            className="secondary-button"
            href={armoryProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Armory
          </a>
          <a
            className="data-attribution"
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Data provided by Raider.IO
          </a>
        </div>
      </div>
    </section>
  );
}

function ProfileStat({
  label,
  value,
  detail,
  featured = false,
  valueColor,
}: {
  label: string;
  value: string;
  detail: string;
  featured?: boolean;
  valueColor?: string;
}) {
  return (
    <article className={featured ? "profile-stat profile-stat-featured" : "profile-stat"}>
      <span>{label}</span>
      <strong style={valueColor ? { color: valueColor } : undefined}>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function RecentRunRow({ run }: { run: RaiderIoRun }) {
  return (
    <div className="activity-row">
      <span className="activity-level">+{run.mythic_level ?? "-"}</span>
      <div>
        <strong>{run.dungeon ?? run.short_name ?? "Unknown Dungeon"}</strong>
        <p>{formatCompletion(run)}</p>
      </div>
      <span className="activity-status">{formatRunStatus(run)}</span>
    </div>
  );
}

function getCurrentRaidProgression(raidProgression?: Record<string, RaiderIoRaidProgress>) {
  if (!raidProgression) {
    return null;
  }

  const raids = Object.entries(raidProgression)
    .map(([slug, progression]) => ({
      name: formatSlug(slug),
      ...progression,
    }))
    .filter((progression) => progression.summary);

  if (raids.length === 0) {
    return null;
  }

  return raids.sort((first, second) => {
    const expansionDifference = (second.expansion_id ?? 0) - (first.expansion_id ?? 0);

    if (expansionDifference !== 0) {
      return expansionDifference;
    }

    const secondProgress = (second.mythic_bosses_killed ?? 0) * 100
      + (second.heroic_bosses_killed ?? 0) * 10
      + (second.normal_bosses_killed ?? 0);
    const firstProgress = (first.mythic_bosses_killed ?? 0) * 100
      + (first.heroic_bosses_killed ?? 0) * 10
      + (first.normal_bosses_killed ?? 0);

    return secondProgress - firstProgress;
  })[0];
}

function formatScore(score?: number) {
  return typeof score === "number" ? Math.round(score).toLocaleString("en-US") : "Unavailable";
}

function formatRank(rank?: number) {
  return typeof rank === "number" && rank > 0 ? `US #${rank.toLocaleString("en-US")}` : "Unavailable";
}

function formatTitle(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => (part.length > 0 ? formatTitle(part) : part))
    .join(" ");
}

function formatRunStatus(run: RaiderIoRun) {
  if (typeof run.clear_time_ms !== "number" || typeof run.par_time_ms !== "number") {
    return "Completed";
  }

  return run.clear_time_ms <= run.par_time_ms ? "Timed" : "Completed";
}

function formatUpgrades(upgrades?: number) {
  if (typeof upgrades !== "number") {
    return "Unavailable";
  }

  return upgrades > 0 ? `+${upgrades}` : "No upgrade";
}

function formatCompletion(run: RaiderIoRun) {
  if (typeof run.clear_time_ms !== "number") {
    return run.completed_at ? formatDate(run.completed_at) : "Completion unavailable";
  }

  const clearTime = formatDuration(run.clear_time_ms);

  if (typeof run.par_time_ms !== "number") {
    return clearTime;
  }

  return `${clearTime} / ${formatDuration(run.par_time_ms)}`;
}

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.round(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDate(value: string) {
  return value.slice(0, 10);
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