"use client";

import { useState } from "react";
import type { Player } from "@/lib/db";
import type { OrgRole } from "@/lib/permissions";
import { can, ROLE_LABELS } from "@/lib/permissions";

const GAME_BADGE: Record<string, string> = {
  OW2: "text-[#F99E1A] bg-[#F99E1A]/10",
  MR:  "text-[#e84040] bg-[#e84040]/10",
  BOTH: "text-[#c5d400] bg-[#c5d400]/10",
};

const IN_GAME_ROLES = ["Tank", "DPS", "Duelist", "Support", "Strategist", "Vanguard", "Flex"];

type Props = {
  grouped: Record<string, Player[]>;
  orgRole: OrgRole;
  currentDiscordId: string;
  captainOf: string | null;
};

export default function RosterPanel({ grouped, orgRole, currentDiscordId, captainOf }: Props) {
  const [editing, setEditing] = useState<Player | null>(null);
  const [localGrouped, setLocalGrouped] = useState(grouped);
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<Player | null>(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ discord_id: "", display_name: "", division: Object.keys(grouped)[0] ?? "", game: "MR", in_game_role: "Player" });

  const canEdit = can.editPlayerProfiles(orgRole);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function saveEdit(patch: Record<string, any> & { discord_id: string }) {
    setSaving(true);
    const res = await fetch("/api/players", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setLocalGrouped((prev) => {
        const next = { ...prev };
        for (const div of Object.keys(next)) {
          next[div] = next[div].map((p) => p.discord_id === patch.discord_id ? { ...p, ...patch } : p);
        }
        return next;
      });
    }
    setSaving(false);
    setEditing(null);
  }

  async function handleAddPlayer() {
    setSaving(true);
    const body: Partial<Player> & { discord_id: string } = {
      discord_id: newPlayer.discord_id,
      display_name: newPlayer.display_name,
      division: newPlayer.division,
      game: newPlayer.game as Player["game"],
      in_game_role: newPlayer.in_game_role,
      role: "player",
      is_admin: false,
      org_role: "PLAYER",
      rank: null,
      captain_of: null,
      archived: false,
    };
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setLocalGrouped((prev) => {
        const next = { ...prev };
        const div = newPlayer.division;
        next[div] = [...(next[div] ?? []), body as Player];
        return next;
      });
      setShowAddPlayer(false);
      setNewPlayer({ discord_id: "", display_name: "", division: Object.keys(grouped)[0] ?? "", game: "MR", in_game_role: "Player" });
    }
    setSaving(false);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-white tracking-wide uppercase">
            <span className="text-[#c5d400]">Roster</span> Management
          </h1>
          <p className="text-white/40 text-sm mt-1">All active players grouped by team</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowAddPlayer(true)}
            className="px-4 py-2 bg-[#c5d400] text-black text-sm font-bold rounded-xl hover:bg-[#d4e500] uppercase tracking-wide transition-colors"
          >
            + Add Player
          </button>
        )}
      </div>

      {/* Add player form */}
      {showAddPlayer && (
        <div className="bg-white/[0.03] border border-[#c5d400]/20 rounded-2xl p-5 mb-6">
          <h3 className="font-heading text-lg text-white font-bold mb-4 uppercase">New Player</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Discord ID" value={newPlayer.discord_id} onChange={(v) => setNewPlayer((p) => ({ ...p, discord_id: v }))} placeholder="123456789" />
            <Field label="Display Name" value={newPlayer.display_name} onChange={(v) => setNewPlayer((p) => ({ ...p, display_name: v }))} placeholder="gamertag" />
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Team</label>
              <select value={newPlayer.division} onChange={(e) => setNewPlayer((p) => ({ ...p, division: e.target.value }))}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40 [&>option]:bg-[#1a1a1a] [&>option]:text-white">
                {Object.keys(localGrouped).map((div) => <option key={div} value={div}>{div}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Game</label>
              <select value={newPlayer.game} onChange={(e) => setNewPlayer((p) => ({ ...p, game: e.target.value }))}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40 [&>option]:bg-[#1a1a1a] [&>option]:text-white">
                <option value="OW2">Overwatch 2</option>
                <option value="MR">Marvel Rivals</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">In-Game Role</label>
              <select value={newPlayer.in_game_role} onChange={(e) => setNewPlayer((p) => ({ ...p, in_game_role: e.target.value }))}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40 [&>option]:bg-[#1a1a1a] [&>option]:text-white">
                {IN_GAME_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAddPlayer(false)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
            <button onClick={handleAddPlayer} disabled={saving || !newPlayer.discord_id || !newPlayer.display_name}
              className="flex-1 py-2.5 bg-[#c5d400] text-black text-sm font-bold rounded-xl hover:bg-[#d4e500] disabled:opacity-50 transition-colors uppercase tracking-wide">
              {saving ? "Adding..." : "Add Player"}
            </button>
          </div>
        </div>
      )}

      {/* Teams */}
      {Object.entries(localGrouped).map(([division, players]) => {
        const canViewTeam = canEdit || orgRole === "HEAD_COACH" || captainOf === division;
        if (!canViewTeam) return null;
        return (
          <div key={division} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-heading text-xl font-black text-white uppercase tracking-wide">{division}</h2>
              <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-0.5 rounded">{players.length} players</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {players.map((player) => (
                <PlayerCard
                  key={player.discord_id}
                  player={player}
                  canEdit={canEdit}
                  isSelf={player.discord_id === currentDiscordId}
                  onEdit={() => setEditing(player)}
                  onRemove={can.deletePlayer(orgRole) ? () => setConfirmRemove(player) : undefined}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Edit modal */}
      {editing && (
        <EditModal
          player={editing}
          saving={saving}
          onSave={(patch) => saveEdit({ ...patch, discord_id: editing.discord_id })}
          onClose={() => setEditing(null)}
          divisions={Object.keys(localGrouped)}
          canMoveTeams={can.movePlayersBetweenTeams(orgRole)}
        />
      )}

      {/* Confirm remove */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-heading text-xl text-white font-bold mb-2">Archive Player?</h3>
            <p className="text-white/50 text-sm mb-6">
              <strong className="text-white">{confirmRemove.display_name}</strong> will be removed from the active roster. Historical data is retained.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmRemove(null)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
              <button onClick={async () => {
                await fetch(`/api/admin/users/${confirmRemove.discord_id}`, { method: "DELETE" });
                setLocalGrouped((prev) => {
                  const next = { ...prev };
                  for (const div of Object.keys(next)) {
                    next[div] = next[div].filter((p) => p.discord_id !== confirmRemove.discord_id);
                  }
                  return next;
                });
                setConfirmRemove(null);
              }} className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm font-bold transition-colors">
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ player, canEdit, isSelf, onEdit, onRemove }: {
  player: Player; canEdit: boolean; isSelf: boolean;
  onEdit: () => void; onRemove?: () => void;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.1] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-full bg-[#c5d400]/10 flex items-center justify-center text-[#c5d400] font-bold text-sm flex-shrink-0">
          {player.display_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex gap-1">
          {(canEdit || isSelf) && (
            <button onClick={onEdit} className="text-white/30 hover:text-white/70 transition-colors p-1 rounded">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          )}
          {onRemove && (
            <button onClick={onRemove} className="text-red-400/40 hover:text-red-400 transition-colors p-1 rounded">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          )}
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm text-white font-semibold">{player.display_name}</p>
          {isSelf && <span className="text-[10px] text-[#c5d400]/60 bg-[#c5d400]/5 px-1.5 py-0.5 rounded">you</span>}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {player.org_role && player.org_role !== "PLAYER" && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/[0.06] px-1.5 py-0.5 rounded">
              {ROLE_LABELS[player.org_role]}
            </span>
          )}
          {player.in_game_role && (
            <span className="text-[10px] text-white/40">{player.in_game_role}</span>
          )}
          {player.game && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GAME_BADGE[player.game] ?? "text-white/30 bg-white/[0.04]"}`}>
              {player.game}
            </span>
          )}
        </div>
        {player.rank && <p className="text-[10px] text-white/30 mt-1">{player.rank}</p>}
      </div>
    </div>
  );
}

function EditModal({ player, saving, onSave, onClose, divisions, canMoveTeams }: {
  player: Player; saving: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (patch: Record<string, any>) => void;
  onClose: () => void;
  divisions: string[];
  canMoveTeams: boolean;
}) {
  const [form, setForm] = useState({
    display_name: player.display_name,
    division: player.division,
    game: player.game ?? "",
    in_game_role: player.in_game_role ?? "",
    rank: player.rank ?? "",
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full">
        <h3 className="font-heading text-xl text-white font-bold mb-4 uppercase">Edit {player.display_name}</h3>
        <div className="space-y-3">
          <Field label="Display Name" value={form.display_name} onChange={(v) => setForm((f) => ({ ...f, display_name: v }))} />
          {canMoveTeams && (
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Team</label>
              <select value={form.division} onChange={(e) => setForm((f) => ({ ...f, division: e.target.value }))}
                className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40 [&>option]:bg-[#1a1a1a] [&>option]:text-white">
                {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">Game</label>
            <select value={form.game} onChange={(e) => setForm((f) => ({ ...f, game: e.target.value }))}
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40 [&>option]:bg-[#1a1a1a] [&>option]:text-white">
              <option value="OW2">Overwatch 2</option><option value="MR">Marvel Rivals</option><option value="BOTH">Both</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">In-Game Role</label>
            <select value={form.in_game_role} onChange={(e) => setForm((f) => ({ ...f, in_game_role: e.target.value }))}
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5d400]/40 [&>option]:bg-[#1a1a1a] [&>option]:text-white">
              {IN_GAME_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <Field label="Rank" value={form.rank} onChange={(v) => setForm((f) => ({ ...f, rank: v }))} placeholder="e.g. Diamond 1" />
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
          <button onClick={() => onSave(form as Record<string, unknown>)} disabled={saving}
            className="flex-1 py-2.5 bg-[#c5d400] text-black text-sm font-bold rounded-xl hover:bg-[#d4e500] disabled:opacity-50 transition-colors uppercase tracking-wide">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-white/40 uppercase tracking-widest font-semibold block mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c5d400]/40"
      />
    </div>
  );
}
