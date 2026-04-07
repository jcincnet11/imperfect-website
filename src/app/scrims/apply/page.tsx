"use client";

import { useState } from "react";
import Link from "next/link";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const BLOCKS = ["morning", "afternoon", "evening"];
const BLOCK_LABELS: Record<string, string> = {
  morning: "Morning (8 AM–12 PM AST)",
  afternoon: "Afternoon (12–6 PM AST)",
  evening: "Evening (6–11 PM AST)",
};

type FormData = {
  team_name: string;
  discord_invite: string;
  captain_name: string;
  captain_discord: string;
  region: string;
  game: string;
  format: string;
  rank_range: string;
  preferred_days: string[];
  preferred_blocks: string[];
  earliest_date: string;
  message: string;
  discord_confirmed: boolean;
};

const INITIAL: FormData = {
  team_name: "",
  discord_invite: "",
  captain_name: "",
  captain_discord: "",
  region: "",
  game: "",
  format: "",
  rank_range: "",
  preferred_days: [],
  preferred_blocks: [],
  earliest_date: "",
  message: "",
  discord_confirmed: false,
};

export default function ScrimApplyPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  })();

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleArray = (field: "preferred_days" | "preferred_blocks", val: string) => {
    setForm((prev) => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.team_name.trim()) e.team_name = "Required";
    if (!form.captain_name.trim()) e.captain_name = "Required";
    if (!form.captain_discord.trim()) e.captain_discord = "Required";
    if (!form.region.trim()) e.region = "Required";
    if (!form.game) e.game = "Required";
    if (!form.format) e.format = "Required";
    if (!form.rank_range.trim()) e.rank_range = "Required";
    if (form.preferred_days.length === 0) e.preferred_days = "Select at least one day";
    if (form.preferred_blocks.length === 0) e.preferred_blocks = "Select at least one time block";
    if (!form.earliest_date) e.earliest_date = "Required";
    if (!form.discord_confirmed) e.discord_confirmed = "Must confirm";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/scrim-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: 500, textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#10003;</div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#C8E400", marginBottom: "12px" }}>Application Submitted!</h1>
          <p style={{ color: "#aaa", fontSize: "15px", lineHeight: 1.6 }}>
            Our Manager will reach out via Discord within 48 hours.
            Make sure <strong style={{ color: "#fff" }}>{form.captain_discord}</strong> is reachable.
          </p>
          <Link href="/" style={{ display: "inline-block", marginTop: "24px", color: "#C8E400", fontSize: "13px", textDecoration: "none" }}>
            ← Back to IMPerfect Gaming
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#1A1A1A",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "14px",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "#ef4444",
    marginTop: "4px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "40px 20px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ color: "#C8E400", fontSize: "14px", fontWeight: 800, textDecoration: "none", letterSpacing: "0.1em" }}>
            IMPERFECT GAMING
          </Link>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", marginTop: "12px" }}>
            Scrim Application
          </h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>
            Request a scrimmage against IMPerfect. Fill out the form below and our Manager will follow up on Discord.
          </p>
          <p style={{ color: "#555", fontSize: "13px", marginTop: "12px" }}>
            New to the community?{" "}
            <Link href="/en/community/join" style={{ color: "#C8E400", textDecoration: "none", fontWeight: 600 }}>
              Register your team first →
            </Link>
          </p>
        </div>

        {serverError && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#ef4444", fontSize: "13px" }}>
            {serverError}
          </div>
        )}

        <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px" }}>
          {/* Team Information */}
          <SectionLabel>Team Information</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
            <Field label="Team / Org Name *" error={errors.team_name}>
              <input style={inputStyle} value={form.team_name} onChange={(e) => set("team_name", e.target.value)} placeholder="Your team name" />
            </Field>
            <Field label="Discord Server Invite Link" error="">
              <input style={inputStyle} value={form.discord_invite} onChange={(e) => set("discord_invite", e.target.value)} placeholder="https://discord.gg/..." />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Captain / Contact Name *" error={errors.captain_name}>
                <input style={inputStyle} value={form.captain_name} onChange={(e) => set("captain_name", e.target.value)} placeholder="Your name" />
              </Field>
              <Field label="Captain Discord Handle *" error={errors.captain_discord}>
                <input style={inputStyle} value={form.captain_discord} onChange={(e) => set("captain_discord", e.target.value)} placeholder="username" />
              </Field>
            </div>
            <Field label="Region / Location *" error={errors.region}>
              <input style={inputStyle} value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="Puerto Rico, East US, etc." />
            </Field>
          </div>

          {/* Game & Format */}
          <SectionLabel>Game &amp; Format</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="Which game? *" error={errors.game}>
                <select style={{ ...inputStyle, appearance: "none" }} value={form.game} onChange={(e) => set("game", e.target.value)}>
                  <option value="">Select...</option>
                  <option value="ow2">Overwatch 2</option>
                  <option value="marvel_rivals">Marvel Rivals</option>
                  <option value="both">Both</option>
                </select>
              </Field>
              <Field label="Format *" error={errors.format}>
                <select style={{ ...inputStyle, appearance: "none" }} value={form.format} onChange={(e) => set("format", e.target.value)}>
                  <option value="">Select...</option>
                  <option value="5v5">5v5</option>
                  <option value="6v6">6v6</option>
                  <option value="Scrimmage">Scrimmage</option>
                  <option value="Best of 3">Best of 3</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>
            <Field label="Competitive rank range of your team *" error={errors.rank_range}>
              <input style={inputStyle} value={form.rank_range} onChange={(e) => set("rank_range", e.target.value)} placeholder="e.g., Diamond–Grandmaster" />
            </Field>
          </div>

          {/* Availability */}
          <SectionLabel>Availability</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
            <Field label="Preferred days *" error={errors.preferred_days}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {DAYS.map((d, i) => (
                  <CheckPill key={d} label={DAY_LABELS[i]} checked={form.preferred_days.includes(d)} onClick={() => toggleArray("preferred_days", d)} />
                ))}
              </div>
            </Field>
            <Field label="Preferred time blocks * (Puerto Rico time — AST)" error={errors.preferred_blocks}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {BLOCKS.map((b) => (
                  <CheckPill key={b} label={BLOCK_LABELS[b]} checked={form.preferred_blocks.includes(b)} onClick={() => toggleArray("preferred_blocks", b)} />
                ))}
              </div>
            </Field>
            <Field label="Earliest available date *" error={errors.earliest_date}>
              <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={form.earliest_date} min={minDate} onChange={(e) => set("earliest_date", e.target.value)} />
            </Field>
          </div>

          {/* Message */}
          <SectionLabel>Message (optional)</SectionLabel>
          <div style={{ marginBottom: "28px" }}>
            <textarea
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              value={form.message}
              onChange={(e) => set("message", e.target.value.slice(0, 300))}
              placeholder="Anything else we should know?"
              maxLength={300}
            />
            <div style={{ textAlign: "right", fontSize: "11px", color: "#555", marginTop: "4px" }}>
              {form.message.length}/300
            </div>
          </div>

          {/* Agreement */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.discord_confirmed}
                onChange={(e) => set("discord_confirmed", e.target.checked)}
                style={{ marginTop: "3px", accentColor: "#C8E400" }}
              />
              <span style={{ fontSize: "13px", color: "#aaa", lineHeight: 1.5 }}>
                I confirm this team is in the{" "}
                <a href="https://discord.gg/VuTAEqPT" target="_blank" rel="noopener noreferrer" style={{ color: "#C8E400", textDecoration: "none" }}>
                  IMPerfect Gaming Discord server
                </a>{" "}
                or will join before the scrim date. *
              </span>
            </label>
            {errors.discord_confirmed && <p style={errorStyle}>{errors.discord_confirmed}</p>}
          </div>

          {/* Submit */}
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
              transition: "opacity 0.15s",
            }}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#444" }}>
          Need help? Join our <a href="https://discord.gg/VuTAEqPT" target="_blank" rel="noopener noreferrer" style={{ color: "#C8E400", textDecoration: "none" }}>Discord</a>.
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "10px",
      fontWeight: 700,
      color: "#C8E400",
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      marginBottom: "12px",
      paddingBottom: "8px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      {children}
    </p>
  );
}

function Field({ label, error, children }: { label: string; error: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#aaa", marginBottom: "6px" }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{error}</p>}
    </div>
  );
}

function CheckPill({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "12px",
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
