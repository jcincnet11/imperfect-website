"use client";

// ─────────────────────────────────────────────────────────────────
// TO UPDATE PLAYER INFO: edit OW2_ROSTER and MR_ROSTER arrays below
// Fields: name, ign, role, rank, flag, bio, socials, topHeroes
// tracker.gg links are auto-generated from the ign field
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import PlayerStatsSection from "@/components/team-hub/PlayerStatsSection";

// ── OW2 hero portrait URLs (Blizzard CDN) ──────────────────────
const OW2_HERO_PORTRAIT: Record<string, string> = {
  "Ana": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/985b06beae46b7ba3ca87d1512d0fc62ca7f206ceca58ef16fc44d43a1cc84ed.png",
  "Ashe": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/4076bbaa2eb52a0bfe612434071e56e7702d5454473dbbea2f9e392a9d997a94.png",
  "Baptiste": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/d4e6f1ca45d9f88fa89260787397f141a6f007b14e5b26698883b6a17bab9680.png",
  "Bastion": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/4ede795c2a681aaccfa72d0c901cba0cb8a2c292fd6a97b2ba9faed161c2d184.png",
  "Brigitte": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/795fba91376d87d441a7f359ae12a3175dfa95825ccc4414cc6b95b129fc4cb0.png",
  "Cassidy": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/9240cd64cc8ef58df9acbf55204ab1b5d8578f743fda5931f0dbccbd75ab841b.png",
  "D.Va": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/df5a5532862d9292634fb3dc0e51a4705aa601de65e5e815513ccc663d84de56.png",
  "Doomfist": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/ff5c54f43ad253c7faeda9c4ed31d42582ea6b19205d197866f3dd0c0aa14c16.png",
  "Echo": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/d4f2d5b0c2b7e82d61353186c5f23152ccba9d3569b50839aa580dca3e9114ba.png",
  "Genji": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/156b12c20b1aea872c1eeb5bb37a7de1047b2ab30ecefd0663a8925badde1ea8.png",
  "Hanzo": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/78b61c3e806fb26b02b8980fba62189155074fc15bd865b0883268e546030be5.png",
  "Illari": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/ce42d1455e03e79f321345fea84b27a8918b5db8bd7ab9b2ca9e569606ede9e4.png",
  "Junker Queen": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/06eeecb359f311f43a8f5121d4f9f3a93c565d70b30e94ef543c05596c9a39dc.png",
  "Junkrat": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/7660b9fc6f25f30858fdd8797fe0d52b2306f1e78fef99843f58a274e69af046.png",
  "Juno": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/c0167d251e57b0aa2b1e16c37d87f0e7c77263db9dd0503d77b5f2589bf3e4a0.png",
  "Kiriko": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/408603fe037e8576078eaac5eab2fb251489ced4003b11f5f522776d43d0b83d.png",
  "Lifeweaver": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/3376515cebed0904012e67e956f6d1b9c12e03da642845eeaf787b7e4c7b339d.png",
  "Lucio": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/040bb13f5123ab93faad2f95627ba184608aef4b2469a4d3003859c7087df044.png",
  "Mauga": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/33d39bb439c08975197fc52eff4874716839711b5356c4fdc174f9c24bac1d0e.png",
  "Mei": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/4a55ced3bd597fb08e0fde9dc007f8543ac616ba98ca3db9b0e4d871a8ae17f8.png",
  "Mercy": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/3bfb8bd8ec827e53d870f1238ab73d8aa1f5dbfbcfaaf7f96ffcd35b5c6102ab.png",
  "Moira": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/f48f8485056d5d00dad195859188d23e50f7126b8b08b5646f46ef1b42f5e1de.png",
  "Orisa": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/a73958a28551f5254f3ab3f97c5f5f8d698a95c0b6a515d1a2b1caac169205a6.png",
  "Pharah": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/60ac2d5de4a6d34644d8872233da402f1436c87f804bb11a21661bb30bf4a51f.png",
  "Ramattra": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/ddef7c9fb8ce4256e8508196b486f81950efe7aaa6cf27fec4668beb4cd15774.png",
  "Reaper": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/dc6ff07ac790c00dc95a40882449617bb6e0e38906b353a630cffe0c815270a9.png",
  "Reinhardt": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/551fbe070c16fdfcc17f7f1de63af22c53e7d2f1340fc2f3172441504527bc4e.png",
  "Sigma": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/a4c032fa466c9a6d9c6974747635d7ef910027f91cd58892af0c899db565f92d.png",
  "Sojourn": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/82b8c1b8765dcb9a0ba16e343c3516bf324c771ac81e9878473280216e70a889.png",
  "Soldier": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/c93b5f0a528c40473188f77cc2a267aee7d5b6cf5c9e104105d634b4388674e2.png",
  "Sombra": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/47727b02a16e3bd7b2447d86ae1edf11587bc320b2aecb4f2f16a7ca4ad4e8a0.png",
  "Symmetra": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/ebec57e8bd68b3d4383edfeb34f8f52dd0b94a6467d594c2fee722e8a97c32aa.png",
  "Torbjorn": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/ce17118cedc29b0d2ac1e059666bed36b9531c85079b0b894bb402d12c917ba9.png",
  "Tracer": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/4504f6f15cb3feaa92ecd38e01dcf751cb5abdac2e0bb52d0555727e53277502.png",
  "Venture": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/dcab9123f5f55df22e54d4e797de43c71b917e0149dd059a7fd6136f48464cd0.png",
  "Widowmaker": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/6e4702b45f196aaf51555cf57327322721f45458b17f5f0643ed008a88378259.png",
  "Winston": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/46a10db3aa908c590ddc4e7606376a88143d1f1306ecfbea043263040f9529a5.png",
  "Wrecking Ball": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/9ef1d58867136e0b26f928d896000b9dab216118f6e2f59e53f2e975e1e27afa.png",
  "Zarya": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/9b6f63cc66ddf9d5e0862173c733cc0d2e574c5c89357798d91b93b2f95a7080.png",
  "Zenyatta": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/7d1546b1541a8afc39353f9337a408d6275a141b0432b7e560ef61579996b0fc.png",
};

// ── Types ────────────────────────────────────────────────────────

type Socials = {
  twitter: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitch: string | null;
};

type Hero = {
  name: string;
  role: string;
  winRate: string;
  timePlayed: string;
};

type Player = {
  id: number;
  name: string;
  ign: string;
  role: string;
  division: "OW2" | "MR";
  rank: string;
  flag: string;
  bio: string;
  socials: Socials;
  topHeroes: Hero[];
};

// ── Roster Data ──────────────────────────────────────────────────

// NOTE: OW2 division is being rebuilt — these are placeholder players for now.
const OW2_ROSTER: Player[] = [
  {
    id: 1,
    name: "Player One",
    ign: "P1xGaming",
    role: "Tank",
    division: "OW2",
    rank: "Top 500",
    flag: "🇵🇷",
    bio: "The anchor of the team. Calls the dives and holds the line.",
    socials: {
      twitter: "https://twitter.com/placeholder",
      instagram: null,
      tiktok: null,
      twitch: null,
    },
    topHeroes: [
      { name: "Reinhardt", role: "Tank", winRate: "68%", timePlayed: "120h" },
      { name: "D.Va",      role: "Tank", winRate: "62%", timePlayed: "85h"  },
      { name: "Zarya",     role: "Tank", winRate: "59%", timePlayed: "60h"  },
    ],
  },
  {
    id: 2,
    name: "Player Two",
    ign: "FlexDPS99",
    role: "DPS",
    division: "OW2",
    rank: "Diamond 1",
    flag: "🇵🇷",
    bio: "Flex DPS with a lethal hitscan. If you see the tracer blink, it's already over.",
    socials: {
      twitter: "https://twitter.com/placeholder",
      instagram: "https://instagram.com/placeholder",
      tiktok: null,
      twitch: null,
    },
    topHeroes: [
      { name: "Tracer", role: "DPS", winRate: "71%", timePlayed: "200h" },
      { name: "Genji",  role: "DPS", winRate: "65%", timePlayed: "110h" },
      { name: "Sombra", role: "DPS", winRate: "60%", timePlayed: "70h"  },
    ],
  },
  {
    id: 3,
    name: "Player Three",
    ign: "VaultHunter",
    role: "DPS",
    division: "OW2",
    rank: "Diamond 2",
    flag: "🇵🇷",
    bio: "Hitscan specialist. Doesn't miss. Keeps it simple. Gets the job done.",
    socials: {
      twitter: null,
      instagram: "https://instagram.com/placeholder",
      tiktok: "https://tiktok.com/@placeholder",
      twitch: null,
    },
    topHeroes: [
      { name: "Cassidy", role: "DPS", winRate: "66%", timePlayed: "150h" },
      { name: "Ashe",    role: "DPS", winRate: "61%", timePlayed: "90h"  },
      { name: "Soldier", role: "DPS", winRate: "58%", timePlayed: "55h"  },
    ],
  },
  {
    id: 4,
    name: "Player Four",
    ign: "AngelWings",
    role: "Support",
    division: "OW2",
    rank: "Platinum 1",
    flag: "🇵🇷",
    bio: "Main support. Keeps everyone alive and the calls clean.",
    socials: {
      twitter: "https://twitter.com/placeholder",
      instagram: null,
      tiktok: null,
      twitch: "https://twitch.tv/placeholder",
    },
    topHeroes: [
      { name: "Ana",    role: "Support", winRate: "70%", timePlayed: "180h" },
      { name: "Lucio",  role: "Support", winRate: "63%", timePlayed: "100h" },
      { name: "Kiriko", role: "Support", winRate: "59%", timePlayed: "75h"  },
    ],
  },
  {
    id: 5,
    name: "Player Five",
    ign: "FlexSupport",
    role: "Support",
    division: "OW2",
    rank: "Platinum 2",
    flag: "🇵🇷",
    bio: "Flex support. Adapts to whatever the team needs. Silent but essential.",
    socials: {
      twitter: null,
      instagram: "https://instagram.com/placeholder",
      tiktok: null,
      twitch: null,
    },
    topHeroes: [
      { name: "Mercy",    role: "Support", winRate: "67%", timePlayed: "130h" },
      { name: "Moira",    role: "Support", winRate: "61%", timePlayed: "80h"  },
      { name: "Zenyatta", role: "Support", winRate: "55%", timePlayed: "50h"  },
    ],
  },
];

const MR_ROSTER: Player[] = [
  {
    id: 6,
    name: "iaguacate",
    ign: "l Aguacate l",
    role: "Strategist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Head Coach and Strategist. The brain behind the gameplan — sees three plays ahead.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Loki",         role: "Strategist", winRate: "71%", timePlayed: "110h" },
      { name: "Luna Snow",    role: "Strategist", winRate: "64%", timePlayed: "85h"  },
      { name: "Adam Warlock", role: "Strategist", winRate: "59%", timePlayed: "60h"  },
    ],
  },
  {
    id: 7,
    name: "lblazerowl",
    ign: "BŁXZER",
    role: "Strategist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Captain and Strategist. Calls the shots and keeps the squad locked in.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Mantis",        role: "Strategist", winRate: "68%", timePlayed: "100h" },
      { name: "Luna Snow",     role: "Strategist", winRate: "62%", timePlayed: "75h"  },
      { name: "Cloak & Dagger", role: "Strategist", winRate: "57%", timePlayed: "45h" },
    ],
  },
  {
    id: 9,
    name: "georgierican",
    ign: "georgierican",
    role: "Strategist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Flex strategist. Adapts the kit to whatever the team needs in the moment.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Mantis",     role: "Strategist", winRate: "68%", timePlayed: "100h" },
      { name: "Loki",       role: "Strategist", winRate: "62%", timePlayed: "75h"  },
      { name: "Luna Snow",  role: "Strategist", winRate: "57%", timePlayed: "45h"  },
    ],
  },
  {
    id: 10,
    name: "spooit",
    ign: "kev0o1",
    role: "Vanguard",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Front line enforcer. Sets the pace and controls the space.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Magneto",         role: "Vanguard", winRate: "72%", timePlayed: "95h" },
      { name: "Thor",            role: "Vanguard", winRate: "65%", timePlayed: "70h" },
      { name: "Captain America", role: "Vanguard", winRate: "58%", timePlayed: "40h" },
    ],
  },
  {
    id: 11,
    name: "the_mofn_ninja",
    ign: "the_mofn_ninja",
    role: "Duelist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Dive duelist. If you blinked, you already lost the 1v1.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Black Panther", role: "Duelist", winRate: "67%", timePlayed: "90h" },
      { name: "Wolverine",     role: "Duelist", winRate: "63%", timePlayed: "70h" },
      { name: "Spider-Man",    role: "Duelist", winRate: "58%", timePlayed: "50h" },
    ],
  },
  {
    id: 12,
    name: "tides100ping",
    ign: "tides100ping",
    role: "Duelist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Ranged duelist. Consistent damage. Never out of position.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Star-Lord", role: "Duelist", winRate: "69%", timePlayed: "100h" },
      { name: "Hawkeye",   role: "Duelist", winRate: "62%", timePlayed: "65h"  },
      { name: "Spider-Man", role: "Duelist", winRate: "57%", timePlayed: "45h" },
    ],
  },
  {
    id: 13,
    name: "zoivanni",
    ign: "zoivanni",
    role: "Vanguard",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Anchor vanguard. Holds the line and creates space for the team.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Thor",            role: "Vanguard", winRate: "70%", timePlayed: "90h" },
      { name: "Magneto",         role: "Vanguard", winRate: "64%", timePlayed: "75h" },
      { name: "Captain America", role: "Vanguard", winRate: "59%", timePlayed: "55h" },
    ],
  },
];

const SHADOWS_ROSTER: Player[] = [
  {
    id: 21,
    name: "filthypryde",
    ign: "FifiPryde",
    role: "Duelist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Aggressive duelist. Sharp reads and sharper plays.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Mantis",    role: "Strategist", winRate: "66%", timePlayed: "75h" },
      { name: "Luna Snow", role: "Strategist", winRate: "60%", timePlayed: "55h" },
      { name: "Loki",      role: "Strategist", winRate: "55%", timePlayed: "40h" },
    ],
  },
  {
    id: 22,
    name: "oxarianz",
    ign: "Oxarian",
    role: "Strategist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Strategist with 140+ ranked matches. Controls the flow of every fight.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Spider-Man",    role: "Duelist", winRate: "70%", timePlayed: "85h" },
      { name: "Black Panther", role: "Duelist", winRate: "63%", timePlayed: "60h" },
      { name: "Wolverine",     role: "Duelist", winRate: "57%", timePlayed: "45h" },
    ],
  },
  {
    id: 23,
    name: "shokwave10",
    ign: "Shockwave",
    role: "Duelist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Duelist with explosive plays. High risk, high reward.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Wolverine",     role: "Duelist", winRate: "68%", timePlayed: "80h" },
      { name: "Hawkeye",       role: "Duelist", winRate: "61%", timePlayed: "55h" },
      { name: "Black Panther", role: "Duelist", winRate: "56%", timePlayed: "40h" },
    ],
  },
  {
    id: 24,
    name: "silenustv",
    ign: "Silenusᵗᵛ",
    role: "Vanguard",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Vanguard anchor. Sets the pace and holds the line for the squad.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Mantis",    role: "Strategist", winRate: "65%", timePlayed: "70h" },
      { name: "Luna Snow", role: "Strategist", winRate: "59%", timePlayed: "50h" },
      { name: "Loki",      role: "Strategist", winRate: "54%", timePlayed: "35h" },
    ],
  },
  {
    id: 25,
    name: "vhaze21",
    ign: "vHaze",
    role: "Vanguard",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Front line vanguard. Creates space and never backs down.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Star-Lord",  role: "Duelist", winRate: "67%", timePlayed: "75h" },
      { name: "Spider-Man", role: "Duelist", winRate: "61%", timePlayed: "55h" },
      { name: "Hawkeye",    role: "Duelist", winRate: "55%", timePlayed: "40h" },
    ],
  },
  {
    id: 26,
    name: "DerekVieraPR",
    ign: "DerekVieraPR",
    role: "Strategist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Strategist with versatile reads. Controls the fight from every angle.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Loki",           role: "Strategist", winRate: "60%", timePlayed: "50h" },
      { name: "Doctor Strange", role: "Vanguard",   winRate: "55%", timePlayed: "40h" },
      { name: "Mantis",         role: "Strategist", winRate: "52%", timePlayed: "30h" },
    ],
  },
  {
    id: 27,
    name: "ABJ",
    ign: "ABJ.",
    role: "Strategist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Flex strategist. Reads the game and adapts — 96 ranked matches deep.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "The Punisher",   role: "Duelist",    winRate: "58%", timePlayed: "60h" },
      { name: "Doctor Strange", role: "Vanguard",   winRate: "54%", timePlayed: "45h" },
      { name: "Mantis",         role: "Strategist", winRate: "52%", timePlayed: "35h" },
    ],
  },
  {
    id: 28,
    name: "PapitaSlayër",
    ign: "PapitaSlayër",
    role: "Duelist",
    division: "MR",
    rank: "",
    flag: "🇵🇷",
    bio: "Duelist with 94 ranked matches. Psylocke main — sharp and relentless.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Psylocke",  role: "Duelist", winRate: "62%", timePlayed: "50h" },
      { name: "Star-Lord", role: "Duelist", winRate: "58%", timePlayed: "35h" },
      { name: "Magik",     role: "Duelist", winRate: "55%", timePlayed: "25h" },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────

const ROLE_COLOR: Record<string, string> = {
  Tank:       "#3A7BD5",
  Vanguard:   "#3A7BD5",
  DPS:        "#E74C3C",
  Duelist:    "#E74C3C",
  Support:    "#1D9E75",
  Strategist: "#1D9E75",
};

function roleColor(role: string): string {
  return ROLE_COLOR[role] ?? "#888888";
}

function initials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function trackerUrl(player: Player): string {
  if (player.division === "OW2") {
    return `https://tracker.gg/overwatch2/profile/ign/${player.ign}`;
  }
  return `https://tracker.gg/marvel-rivals/profile/ign/${player.ign}`;
}

// ── Sub-components ───────────────────────────────────────────────

function RoleBadge({ role, small = false }: { role: string; small?: boolean }) {
  const color = roleColor(role);
  return (
    <span
      style={{
        display: "inline-block",
        background: `${color}22`,
        border: `1px solid ${color}55`,
        color,
        borderRadius: "3px",
        fontSize: small ? "9px" : "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: small ? "1px 5px" : "2px 7px",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-barlow), sans-serif",
      }}
    >
      {role}
    </span>
  );
}

function SocialButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        background: "#1A1A1A",
        border: "1px solid #333333",
        borderRadius: "4px",
        fontSize: "9px",
        fontWeight: 700,
        color: "#888888",
        textDecoration: "none",
        letterSpacing: "0.04em",
        fontFamily: "var(--font-barlow), sans-serif",
        transition: "border-color 0.15s, color 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#C8E400";
        e.currentTarget.style.color = "#C8E400";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#333333";
        e.currentTarget.style.color = "#888888";
      }}
    >
      {label}
    </a>
  );
}

function PlayerCard({ player }: { player: Player }) {
  const t = useTranslations("team_page");
  const color = roleColor(player.role);

  return (
    <div
      style={{
        background: "#222222",
        border: "1px solid #2A2A2A",
        borderTop: `3px solid ${color}`,
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Avatar */}
        <div
          style={{
            width: "40px",
            height: "40px",
            minWidth: "40px",
            borderRadius: "50%",
            background: "#2A2A2A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#C8E400",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "var(--font-barlow), sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          {initials(player.name)}
        </div>

        {/* Name + IGN */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            className="font-heading font-black uppercase"
            style={{
              fontSize: "18px",
              color: "#FFFFFF",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {player.name}
          </p>
          <p style={{ fontSize: "13px", color: "#888888", marginTop: "1px" }}>
            @{player.ign}
          </p>
        </div>

        {/* Flag + rank badge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
          <span style={{ fontSize: "16px", lineHeight: 1 }}>{player.flag}</span>
          {player.rank && (
            <span
              style={{
                background: color,
                color: "#111111",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 700,
                fontFamily: "var(--font-barlow), sans-serif",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "2px 8px",
                whiteSpace: "nowrap",
              }}
            >
              {player.rank}
            </span>
          )}
        </div>
      </div>

      {/* ── Bio ── */}
      <p
        style={{
          fontSize: "13px",
          color: "#888888",
          fontStyle: "italic",
          lineHeight: 1.55,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          margin: 0,
        }}
      >
        {player.bio}
      </p>

      {/* ── Top Heroes (static fallback — only shown for OW2 players without live stats) ── */}
      {player.division !== "MR" && (
        <div>
          <p
            style={{
              fontSize: "10px",
              color: "#C8E400",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 700,
              fontFamily: "var(--font-barlow), sans-serif",
              marginBottom: "10px",
            }}
          >
            {t("top_heroes")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {player.topHeroes.map((hero, i) => {
              const isTop = i === 0;
              return (
                <div
                  key={hero.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    paddingLeft: isTop ? "8px" : "0",
                    borderLeft: isTop ? "3px solid #C8E400" : "3px solid transparent",
                  }}
                >
                  {OW2_HERO_PORTRAIT[hero.name] ? (
                    <Image
                      src={OW2_HERO_PORTRAIT[hero.name]}
                      alt={hero.name}
                      width={isTop ? 28 : 24}
                      height={isTop ? 28 : 24}
                      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                      unoptimized
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div style={{ width: isTop ? 28 : 24, height: isTop ? 28 : 24, borderRadius: "50%", background: "#2A2A2A", flexShrink: 0 }} />
                  )}
                  <span
                    className="font-heading font-bold"
                    style={{
                      fontSize: isTop ? "15px" : "13px",
                      color: "#FFFFFF",
                      flex: 1,
                      minWidth: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {hero.name}
                  </span>
                  <RoleBadge role={hero.role} small />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#C8E400",
                      whiteSpace: "nowrap",
                      fontFamily: "var(--font-barlow), sans-serif",
                      minWidth: "34px",
                      textAlign: "right",
                    }}
                  >
                    {hero.winRate}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#666666",
                      whiteSpace: "nowrap",
                      minWidth: "32px",
                      textAlign: "right",
                    }}
                  >
                    {hero.timePlayed}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Social links ── */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {player.socials.twitter && (
          <SocialButton href={player.socials.twitter} label="TW" />
        )}
        {player.socials.instagram && (
          <SocialButton href={player.socials.instagram} label="IG" />
        )}
        {player.socials.tiktok && (
          <SocialButton href={player.socials.tiktok} label="TT" />
        )}
        {player.socials.twitch && (
          <SocialButton href={player.socials.twitch} label="TV" />
        )}
        <SocialButton href={trackerUrl(player)} label="TRK" />
      </div>

      {/* ── Live stats (MR only) ── */}
      {player.division === "MR" && (
        <PlayerStatsSection ign={player.ign} division={player.division} />
      )}
    </div>
  );
}

// ── Sub-team coming-soon card ────────────────────────────────────

const MR_SUBTEAMS = [
  {
    id: "echoes",
    name: "Echoes",
    tagline: "Rising talent. Next in line.",
    color: "#3A7BD5",
    slots: 6,
  },
] as const;

function SubTeamComingSoon({
  team,
}: {
  team: (typeof MR_SUBTEAMS)[number];
}) {
  const t = useTranslations("team_page");
  return (
    <div
      style={{
        marginTop: "48px",
        borderTop: "1px solid #222222",
        paddingTop: "40px",
      }}
    >
      {/* Sub-team label row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <span
          className="font-heading font-bold uppercase"
          style={{ fontSize: "13px", color: "#FFFFFF", letterSpacing: "0.12em" }}
        >
          IMPerfect · {team.name}
        </span>
        <span
          style={{
            background: `${team.color}18`,
            border: `1px solid ${team.color}44`,
            color: team.color,
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-barlow), sans-serif",
            padding: "2px 10px",
          }}
        >
          Marvel Rivals
        </span>
        <span
          style={{
            background: "#C8E40012",
            border: "1px solid #C8E40030",
            color: "#C8E400",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-barlow), sans-serif",
            padding: "2px 10px",
          }}
        >
          {t("roster_tba")}
        </span>
      </div>

      {/* Ghost card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "16px" }}>
        {Array.from({ length: team.slots }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "#1E1E1E",
              border: "1px solid #242424",
              borderTop: `3px solid ${team.color}44`,
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minHeight: "120px",
              opacity: 0.55,
            }}
          >
            {/* Ghost avatar */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#2A2A2A",
                border: `1px dashed ${team.color}55`,
              }}
            />
            <span
              className="font-heading font-bold uppercase"
              style={{ fontSize: "10px", color: "#444444", letterSpacing: "0.15em" }}
            >
              TBA
            </span>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div
        style={{
          marginTop: "20px",
          background: "#1E1E1E",
          border: `1px solid ${team.color}22`,
          borderLeft: `3px solid ${team.color}`,
          borderRadius: "6px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            className="font-heading font-black uppercase"
            style={{ fontSize: "16px", color: "#FFFFFF", marginBottom: "4px" }}
          >
            {team.tagline}
          </p>
          <p style={{ fontSize: "12px", color: "#555555" }}>
            {t("coming_soon_desc")}
          </p>
        </div>
        <span
          className="font-heading font-bold uppercase"
          style={{
            fontSize: "10px",
            color: team.color,
            letterSpacing: "0.15em",
            padding: "6px 14px",
            border: `1px solid ${team.color}44`,
            borderRadius: "3px",
            whiteSpace: "nowrap",
          }}
        >
          {t("coming_soon")}
        </span>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────

type Division = "OW2" | "MR";

export default function TeamPage() {
  const locale = useLocale();
  const t = useTranslations("team_page");
  const [activeDivision, setActiveDivision] = useState<Division>("OW2");

  const roster = activeDivision === "OW2" ? OW2_ROSTER : MR_ROSTER;
  const divisionLabel = activeDivision === "OW2" ? "Overwatch 2" : "Marvel Rivals";

  return (
    <div style={{ background: "#1A1A1A", minHeight: "100vh" }}>
      {/* ── Page header ── */}
      <section style={{ padding: "120px 24px 64px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <Link
            href={`/${locale}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "#555555",
              textDecoration: "none",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "32px",
              fontFamily: "var(--font-barlow), sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8E400")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
          >
            {t("back")}
          </Link>

          <span className="eyebrow">{t("eyebrow")}</span>
          <h1
            className="font-heading font-black uppercase text-white"
            style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "16px" }}
          >
            {t("title")}
          </h1>
          <p style={{ fontSize: "15px", color: "#888888", maxWidth: "440px", lineHeight: 1.65, marginBottom: "40px" }}>
            {t("description")}
          </p>

          {/* Division toggle */}
          <div style={{ display: "flex", gap: "8px" }}>
            {(["OW2", "MR"] as Division[]).map((div) => {
              const active = activeDivision === div;
              const label = div === "OW2" ? "Overwatch 2" : "Marvel Rivals";
              return (
                <button
                  key={div}
                  onClick={() => setActiveDivision(div)}
                  aria-label={`Switch to ${label}`}
                  aria-pressed={active}
                  style={{
                    background: active ? "#C8E400" : "#2A2A2A",
                    color: active ? "#2A2A2A" : "#888888",
                    border: active ? "none" : "1px solid #333333",
                    borderRadius: "4px",
                    padding: "10px 20px",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "var(--font-barlow), sans-serif",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Division section ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 24px" }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <span
            className="font-heading font-bold uppercase"
            style={{ fontSize: "13px", color: "#FFFFFF", letterSpacing: "0.12em" }}
          >
            {activeDivision === "MR" ? t("main_squad") : divisionLabel}
          </span>
          <span
            style={{
              background: "#C8E40022",
              border: "1px solid #C8E40044",
              color: "#C8E400",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "var(--font-barlow), sans-serif",
              padding: "2px 10px",
            }}
          >
            {roster.length} {t("players_count")}
          </span>
        </div>

        {/* Card grid with fade on tab switch */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeDivision}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "16px" }}>
              {roster.map((player, i) => (
                <m.div
                  key={player.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <PlayerCard player={player} />
                </m.div>
              ))}
            </div>

            {/* Shadows roster — MR only */}
            {activeDivision === "MR" && (
              <div
                style={{
                  marginTop: "48px",
                  borderTop: "1px solid #222222",
                  paddingTop: "40px",
                }}
              >
                {/* Shadows section label */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                  <span
                    className="font-heading font-bold uppercase"
                    style={{ fontSize: "13px", color: "#FFFFFF", letterSpacing: "0.12em" }}
                  >
                    IMPerfect · Shadows
                  </span>
                  <span
                    style={{
                      background: "#9B59B618",
                      border: "1px solid #9B59B644",
                      color: "#9B59B6",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      fontFamily: "var(--font-barlow), sans-serif",
                      padding: "2px 10px",
                    }}
                  >
                    Marvel Rivals
                  </span>
                  <span
                    style={{
                      background: "#C8E40022",
                      border: "1px solid #C8E40044",
                      color: "#C8E400",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      fontFamily: "var(--font-barlow), sans-serif",
                      padding: "2px 10px",
                    }}
                  >
                    {SHADOWS_ROSTER.length} {t("players_count")}
                  </span>
                </div>

                {/* Shadows card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "16px" }}>
                  {SHADOWS_ROSTER.map((player, i) => (
                    <m.div
                      key={player.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <PlayerCard player={player} />
                    </m.div>
                  ))}
                </div>
              </div>
            )}

            {/* Echoes sub-team — MR only */}
            {activeDivision === "MR" && MR_SUBTEAMS.map((subteam) => (
              <SubTeamComingSoon key={subteam.id} team={subteam} />
            ))}
          </m.div>
        </AnimatePresence>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ borderTop: "1px solid #1F1F1F", background: "#111111" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px 24px" }}>
          <p
            className="font-heading font-bold uppercase"
            style={{ fontSize: "12px", color: "#555555", letterSpacing: "0.15em", textAlign: "center" }}
          >
            {t("stats_strip")}
          </p>
        </div>
      </div>
    </div>
  );
}
