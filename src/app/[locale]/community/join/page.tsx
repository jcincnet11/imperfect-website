"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

// ── Constants ────────────────────────────────────────────────────

const GAMES = [
  { value: "ow2", label: "Overwatch 2" },
  { value: "marvel_rivals", label: "Marvel Rivals" },
];
const PLATFORMS = ["PC", "PlayStation", "Xbox", "Cross-platform"];
const ROLES = ["Tank / Vanguard", "DPS / Duelist", "Support / Strategist", "Flex", "Coach", "Manager"];
const PLAYER_PLATFORMS = ["PC", "PlayStation", "Xbox"];
const GOALS = ["Scrims", "Community Events", "Tournaments", "Coaching", "Just hanging out"];
const REFERRAL_OPTIONS = ["Discord", "Tournament", "Social Media", "Referred by someone", "Other"];

type PlayerRow = {
  is_captain: boolean;
  ign: string;
  discord_handle: string;
  role: string;
  rank: string;
  platform: string;
};

const blankPlayer = (): PlayerRow => ({
  is_captain: false, ign: "", discord_handle: "", role: "", rank: "", platform: "",
});

// ── Styles ───────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#1A1A1A",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
  padding: "10px 14px",
  fontSize: "14px",
};

const errStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#ef4444",
  marginTop: "4px",
};

// ── Main Component ───────────────────────────────────────────────

export default function CommunityJoinPage() {
  const locale = useLocale();
  const t = useTranslations("community_join");

  // Team state
  const [teamName, setTeamName] = useState("");
  const [teamTag, setTeamTag] = useState("");
  const [games, setGames] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [discordServer, setDiscordServer] = useState("");
  const [referral, setReferral] = useState("");

  // Players state
  const [captain, setCaptain] = useState<PlayerRow>({ is_captain: true, ign: "", discord_handle: "", role: "", rank: "", platform: "" });
  const [extraPlayers, setExtraPlayers] = useState<PlayerRow[]>([blankPlayer()]);

  // Final details
  const [about, setAbout] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const clearErr = (field: string) => setErrors((prev) => ({ ...prev, [field]: "" }));

  const toggleArr = (arr: string[], val: string, setter: (v: string[]) => void, errKey: string) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    clearErr(errKey);
  };

  // ── Validation ──

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    // Team
    const name = teamName.trim();
    if (!name || name.length < 2 || name.length > 50) e.teamName = "2–50 characters required";
    else if (!/^[a-zA-Z0-9\s\-'áéíóúñÁÉÍÓÚÑ]+$/.test(name)) e.teamName = "Letters, numbers, spaces, hyphens, apostrophes only";
    if (teamTag && (teamTag.length < 2 || teamTag.length > 6 || !/^[A-Za-z0-9]+$/.test(teamTag))) e.teamTag = "2–6 alphanumeric characters";
    if (games.length === 0) e.games = "Select at least one game";
    if (platforms.length === 0) e.platforms = "Select at least one platform";
    if (!region.trim() || region.trim().length < 2) e.region = "Required (min 2 chars)";

    // Captain
    if (!captain.ign.trim() || captain.ign.trim().length < 2) e.captainIgn = "Required (2–30 chars)";
    if (!captain.discord_handle.trim()) e.captainDiscord = "Required";
    if (!captain.role) e.captainRole = "Required";
    if (!captain.rank.trim() || captain.rank.trim().length < 2) e.captainRank = "Required (min 2 chars)";
    if (!captain.platform) e.captainPlatform = "Required";

    // Extra players — if row has any data, ign + discord required
    const allPlayers = [captain, ...extraPlayers.filter((p) => p.ign.trim() || p.discord_handle.trim())];
    for (let i = 1; i < allPlayers.length; i++) {
      const p = allPlayers[i];
      if (!p.ign.trim()) e[`player${i}Ign`] = "IGN required";
      if (!p.discord_handle.trim()) e[`player${i}Discord`] = "Discord required";
    }

    // Duplicate discord handles
    const handles = allPlayers.map((p) => p.discord_handle.trim().toLowerCase()).filter(Boolean);
    if (new Set(handles).size !== handles.length) e.duplicateHandles = "Each player must have a unique Discord handle";

    // Goals
    if (goals.length === 0) e.goals = "Select at least one";
    if (!confirmed) e.confirmed = "Must confirm";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");

    const filledPlayers = extraPlayers.filter((p) => p.ign.trim() || p.discord_handle.trim());
    const allPlayers = [
      { ...captain, is_captain: true },
      ...filledPlayers.map((p) => ({ ...p, is_captain: false })),
    ];

    try {
      const res = await fetch("/api/community-teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_name: teamName,
          team_tag: teamTag || null,
          games,
          platforms,
          region,
          discord_server: discordServer || null,
          referral_source: referral || null,
          goals,
          about: about || null,
          discord_confirmed: confirmed,
          players: allPlayers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError(t("error_network"));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ──

  if (submitted) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", color: "#C8E400" }}>&#10003;</div>
        <h1 className="font-heading" style={{ fontSize: "28px", fontWeight: 800, color: "#C8E400", marginBottom: "12px" }}>
          {teamName} {t("success_title")}
        </h1>
        <p style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.7, maxWidth: 480, marginBottom: "8px" }}>
          {t("success_body")}
        </p>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>
          {t("success_contact", { handle: captain.discord_handle })}
        </p>
        <a
          href="https://discord.gg/VuTAEqPT"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#C8E400",
            color: "#111",
            padding: "12px 28px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 800,
            textDecoration: "none",
            marginBottom: "12px",
          }}
        >
          {t("success_discord")}
        </a>
        <button
          onClick={() => { setSubmitted(false); setTeamName(""); setTeamTag(""); setGames([]); setPlatforms([]); setRegion(""); setDiscordServer(""); setReferral(""); setCaptain({ is_captain: true, ign: "", discord_handle: "", role: "", rank: "", platform: "" }); setExtraPlayers([blankPlayer()]); setAbout(""); setGoals([]); setConfirmed(false); }}
          style={{ background: "none", border: "none", color: "#C8E400", fontSize: "13px", cursor: "pointer", marginTop: "8px" }}
        >
          {t("success_another")}
        </button>
      </div>
    );
  }

  // ── Form ──

  const addPlayer = () => {
    if (extraPlayers.length < 9) setExtraPlayers((prev) => [...prev, blankPlayer()]);
  };
  const removePlayer = (idx: number) => {
    setExtraPlayers((prev) => prev.filter((_, i) => i !== idx));
  };
  const updatePlayer = (idx: number, field: keyof PlayerRow, value: string) => {
    setExtraPlayers((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <Link href={`/${locale}/community`} style={{ color: "#C8E400", fontSize: "12px", textDecoration: "none", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {t("back")}
        </Link>
        <h1 className="font-heading" style={{ fontSize: "32px", fontWeight: 900, color: "#fff", marginTop: "12px", lineHeight: 1.1 }}>
          {t("title_1")} <span style={{ color: "#C8E400" }}>{t("title_2")}</span> {t("title_3")}
        </h1>
        <p style={{ color: "#777", fontSize: "14px", marginTop: "10px", lineHeight: 1.6 }}>
          {t("subtitle")}
        </p>
      </div>

      {serverError && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444", fontSize: "13px" }}>
          {serverError}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* ═══ SECTION 1 — YOUR TEAM ═══ */}
        <section style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
          <SectionHead>{t("section_team")}</SectionHead>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field label="Team / Org Name *" error={errors.teamName}>
              <input style={inputStyle} value={teamName} maxLength={50} onChange={(e) => { setTeamName(e.target.value); clearErr("teamName"); }} placeholder="Your team name" />
            </Field>

            <Field label="Team Tag / Short Name" error={errors.teamTag} helper="e.g. IMP — shown next to player names">
              <input style={{ ...inputStyle, maxWidth: 140, textTransform: "uppercase" }} value={teamTag} maxLength={6} onChange={(e) => { setTeamTag(e.target.value.toUpperCase()); clearErr("teamTag"); }} placeholder="TAG" />
            </Field>

            <Field label="Game(s) You Play *" error={errors.games}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {GAMES.map((g) => (
                  <Pill key={g.value} label={g.label} checked={games.includes(g.value)} onClick={() => toggleArr(games, g.value, setGames, "games")} />
                ))}
              </div>
            </Field>

            <Field label="Platform *" error={errors.platforms}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {PLATFORMS.map((p) => (
                  <Pill key={p} label={p} checked={platforms.includes(p)} onClick={() => toggleArr(platforms, p, setPlatforms, "platforms")} />
                ))}
              </div>
            </Field>

            <Field label="Region / Location *" error={errors.region} helper="e.g. Puerto Rico, East US, LATAM">
              <input style={inputStyle} value={region} onChange={(e) => { setRegion(e.target.value); clearErr("region"); }} placeholder="Your region" />
            </Field>

            <Field label="Discord Server Link" error="" helper="Your team's Discord server if you have one">
              <input style={inputStyle} value={discordServer} onChange={(e) => setDiscordServer(e.target.value)} placeholder="https://discord.gg/..." />
            </Field>

            <Field label="How did you find us?" error="">
              <select style={{ ...inputStyle, appearance: "auto" }} value={referral} onChange={(e) => setReferral(e.target.value)}>
                <option value="" style={{ background: "#1a1a1a" }}>Select...</option>
                {REFERRAL_OPTIONS.map((r) => <option key={r} value={r} style={{ background: "#1a1a1a" }}>{r}</option>)}
              </select>
            </Field>
          </div>
        </section>

        {/* ═══ SECTION 2 — YOUR PLAYERS ═══ */}
        <section style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
          <SectionHead>{t("section_players")}</SectionHead>

          {errors.duplicateHandles && <p style={{ ...errStyle, marginBottom: "12px" }}>{errors.duplicateHandles}</p>}

          {/* Captain */}
          <div style={{ background: "rgba(200,228,0,0.04)", border: "1px solid rgba(200,228,0,0.15)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#C8E400", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Captain (required)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="IGN / Gamertag *" error={errors.captainIgn}>
                <input style={inputStyle} value={captain.ign} maxLength={30} onChange={(e) => { setCaptain((c) => ({ ...c, ign: e.target.value })); clearErr("captainIgn"); }} placeholder="Your gamertag" />
              </Field>
              <Field label="Discord Handle *" error={errors.captainDiscord}>
                <input style={inputStyle} value={captain.discord_handle} onChange={(e) => { setCaptain((c) => ({ ...c, discord_handle: e.target.value })); clearErr("captainDiscord"); }} placeholder="username" />
              </Field>
              <Field label="Role *" error={errors.captainRole}>
                <select style={{ ...inputStyle, appearance: "auto" }} value={captain.role} onChange={(e) => { setCaptain((c) => ({ ...c, role: e.target.value })); clearErr("captainRole"); }}>
                  <option value="" style={{ background: "#1a1a1a" }}>Select...</option>
                  {ROLES.map((r) => <option key={r} value={r} style={{ background: "#1a1a1a" }}>{r}</option>)}
                </select>
              </Field>
              <Field label="Rank *" error={errors.captainRank}>
                <input style={inputStyle} value={captain.rank} onChange={(e) => { setCaptain((c) => ({ ...c, rank: e.target.value })); clearErr("captainRank"); }} placeholder="Diamond 2, Grandmaster..." />
              </Field>
              <Field label="Platform *" error={errors.captainPlatform}>
                <div style={{ display: "flex", gap: "8px" }}>
                  {PLAYER_PLATFORMS.map((p) => (
                    <Pill key={p} label={p} checked={captain.platform === p} onClick={() => { setCaptain((c) => ({ ...c, platform: p })); clearErr("captainPlatform"); }} />
                  ))}
                </div>
              </Field>
            </div>
          </div>

          {/* Extra players */}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
            Additional Players (optional)
          </p>

          {extraPlayers.map((player, idx) => (
            <div key={idx} style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "14px", marginBottom: "10px", position: "relative" }}>
              <button
                onClick={() => removePlayer(idx)}
                style={{ position: "absolute", top: "8px", right: "10px", background: "none", border: "none", color: "#ef4444", fontSize: "16px", cursor: "pointer", opacity: 0.5 }}
                title="Remove player"
              >
                ×
              </button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <Field label="IGN / Gamertag" error={errors[`player${idx + 1}Ign`]}>
                  <input style={{ ...inputStyle, background: "#222" }} value={player.ign} maxLength={30} onChange={(e) => updatePlayer(idx, "ign", e.target.value)} placeholder="Gamertag" />
                </Field>
                <Field label="Discord Handle" error={errors[`player${idx + 1}Discord`]}>
                  <input style={{ ...inputStyle, background: "#222" }} value={player.discord_handle} onChange={(e) => updatePlayer(idx, "discord_handle", e.target.value)} placeholder="username" />
                </Field>
                <Field label="Role" error="">
                  <select style={{ ...inputStyle, background: "#222", appearance: "auto" }} value={player.role} onChange={(e) => updatePlayer(idx, "role", e.target.value)}>
                    <option value="" style={{ background: "#1a1a1a" }}>Select...</option>
                    {ROLES.map((r) => <option key={r} value={r} style={{ background: "#1a1a1a" }}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Rank" error="">
                  <input style={{ ...inputStyle, background: "#222" }} value={player.rank} onChange={(e) => updatePlayer(idx, "rank", e.target.value)} placeholder="Rank" />
                </Field>
                <Field label="Platform" error="">
                  <div style={{ display: "flex", gap: "6px" }}>
                    {PLAYER_PLATFORMS.map((p) => (
                      <Pill key={p} label={p} checked={player.platform === p} onClick={() => updatePlayer(idx, "platform", p)} small />
                    ))}
                  </div>
                </Field>
              </div>
            </div>
          ))}

          {extraPlayers.length < 9 && (
            <button
              onClick={addPlayer}
              style={{
                background: "transparent",
                border: "1px dashed rgba(255,255,255,0.12)",
                borderRadius: "8px",
                color: "#777",
                padding: "10px",
                width: "100%",
                fontSize: "13px",
                cursor: "pointer",
                marginTop: "4px",
              }}
            >
              + Add Another Player
            </button>
          )}

          <p style={{ fontSize: "11px", color: "#555", marginTop: "12px", lineHeight: 1.5 }}>
            Discord handles help us reach your team for scrim coordination. You do not need to share anything else.
          </p>
        </section>

        {/* ═══ SECTION 3 — FINAL DETAILS ═══ */}
        <section style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
          <SectionHead>{t("section_final")}</SectionHead>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field label="Tell us about your team" error="" helper="">
              <textarea
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                value={about}
                maxLength={300}
                onChange={(e) => setAbout(e.target.value.slice(0, 300))}
                placeholder="How long have you been playing together? What are your goals?"
              />
              <div style={{ textAlign: "right", fontSize: "11px", color: "#555", marginTop: "4px" }}>{about.length}/300</div>
            </Field>

            <Field label="What are you looking for? *" error={errors.goals}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {GOALS.map((g) => (
                  <Pill key={g} label={g} checked={goals.includes(g)} onClick={() => toggleArr(goals, g, setGoals, "goals")} />
                ))}
              </div>
            </Field>

            <div style={{ marginTop: "8px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => { setConfirmed(e.target.checked); clearErr("confirmed"); }}
                  style={{ marginTop: "3px", accentColor: "#C8E400" }}
                />
                <span style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.5 }}>
                  I confirm our team will join or has already joined the{" "}
                  <a href="https://discord.gg/VuTAEqPT" target="_blank" rel="noopener noreferrer" style={{ color: "#C8E400", textDecoration: "none" }}>
                    IMPerfect Gaming Discord server
                  </a>{" "}
                  before participating in any org events. *
                </span>
              </label>
              {errors.confirmed && <p style={errStyle}>{errors.confirmed}</p>}
            </div>

            <button
              onClick={submit}
              disabled={submitting}
              style={{
                width: "100%",
                background: "#C8E400",
                color: "#111",
                border: "none",
                borderRadius: "10px",
                padding: "14px",
                fontSize: "15px",
                fontWeight: 800,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1,
                marginTop: "8px",
              }}
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Helper Components ────────────────────────────────────────────

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading" style={{
      fontSize: "18px",
      fontWeight: 800,
      color: "#fff",
      textTransform: "uppercase",
      marginBottom: "16px",
      paddingBottom: "10px",
      borderBottom: "2px solid rgba(200,228,0,0.2)",
      borderLeft: "3px solid #C8E400",
      paddingLeft: "12px",
    }}>
      {children}
    </h2>
  );
}

function Field({ label, error, helper, children }: { label: string; error?: string; helper?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#aaa", marginBottom: "6px" }}>{label}</label>
      {children}
      {helper && <p style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>{helper}</p>}
      {error && <p style={errStyle}>{error}</p>}
    </div>
  );
}

function Pill({ label, checked, onClick, small }: { label: string; checked: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: small ? "5px 10px" : "7px 14px",
        borderRadius: "20px",
        fontSize: small ? "11px" : "12px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s",
        border: checked ? "1px solid rgba(200,228,0,0.5)" : "1px solid rgba(255,255,255,0.1)",
        background: checked ? "rgba(200,228,0,0.15)" : "transparent",
        color: checked ? "#C8E400" : "#777",
      }}
    >
      {checked ? "✓ " : ""}{label}
    </button>
  );
}
