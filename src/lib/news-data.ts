export type Article = {
  slug: string;
  date: string;
  tag: string;
  tagColor: string;
  title: string;
  excerpt: string;
  game?: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "season-2-recap-marvel-rivals",
    date: "March 28, 2026",
    tag: "Tournament Recap",
    tagColor: "#E74C3C",
    title: "IMPerfect Closes Season 2 With Back-to-Back Finals Runs",
    excerpt:
      "The squad went 7–1 across the final two weeks of the Marvel Rivals Puerto Rico Open, finishing second overall and securing our highest regional placement to date.",
    game: "Marvel Rivals",
  },
  {
    slug: "roster-update-spring-2026",
    date: "March 15, 2026",
    tag: "Roster News",
    tagColor: "#C8E400",
    title: "Spring 2026 Roster Confirmed — IMPerfect, Shadows & Echoes",
    excerpt:
      "After a strong offseason, all three Marvel Rivals rosters are locked in for Spring 2026. Meet the coaches, captains, and the new faces joining the org.",
    game: "Marvel Rivals",
  },
  {
    slug: "overwatch-2-ranked-push",
    date: "March 5, 2026",
    tag: "Season Update",
    tagColor: "#F99E1A",
    title: "OW2 Division Eyes Diamond Climb in Season 14",
    excerpt:
      "With two new additions to the Overwatch 2 roster, the team is targeting a full Diamond rating across all five roles before the mid-season checkpoint.",
    game: "Overwatch 2",
  },
  {
    slug: "community-tournament-april",
    date: "February 24, 2026",
    tag: "Event",
    tagColor: "#3A7BD5",
    title: "IMPerfect Community Cup — April 12",
    excerpt:
      "We're hosting a open-bracket Marvel Rivals community tournament for Puerto Rico–based teams. $150 prize pool. Register in the Discord by April 8.",
    game: "Marvel Rivals",
  },
  {
    slug: "partnership-announcement",
    date: "February 10, 2026",
    tag: "Partnership",
    tagColor: "#9B59B6",
    title: "IMPerfect Partners With Puerto Rico Esports Alliance",
    excerpt:
      "We're proud to join forces with PREA to grow competitive gaming infrastructure on the island. This partnership brings coaching resources, tournament access, and community programming to our players.",
  },
  {
    slug: "player-spotlight-aguacate",
    date: "January 30, 2026",
    tag: "Player Spotlight",
    tagColor: "#C8E400",
    title: "Spotlight: iaguacate — The Strategist Behind the System",
    excerpt:
      "Coach and strategist iaguacate breaks down his role-reading philosophy, how he builds team comps from scratch, and what it means to rep Puerto Rico at every LAN.",
    game: "Marvel Rivals",
  },
];
