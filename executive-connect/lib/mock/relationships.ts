import { Relationship } from "@/lib/types";

export const MOCK_RELATIONSHIPS: Relationship[] = [
  // Me (user) connections
  { source: "me", target: "p-001", type: "connected_to", strength: 0.9, sourcePlatform: "linkedin" },
  { source: "me", target: "p-002", type: "attended", strength: 0.7, sourcePlatform: "event" },
  { source: "me", target: "p-006", type: "mutual", strength: 0.6, sourcePlatform: "linkedin" },
  { source: "me", target: "p-011", type: "connected_to", strength: 0.8, sourcePlatform: "linkedin" },
  { source: "me", target: "p-015", type: "attended", strength: 0.5, sourcePlatform: "event" },

  // p-001 Alexandra Chen connections
  { source: "p-001", target: "p-002", type: "same_event", strength: 0.75, sourcePlatform: "event" },
  { source: "p-001", target: "p-004", type: "connected_to", strength: 0.85, sourcePlatform: "linkedin" },
  { source: "p-001", target: "p-006", type: "worked_at", strength: 0.9, sourcePlatform: "linkedin" },
  { source: "p-001", target: "p-008", type: "same_event", strength: 0.6, sourcePlatform: "event" },
  { source: "p-001", target: "p-009", type: "mutual", strength: 0.7, sourcePlatform: "linkedin" },
  { source: "p-001", target: "p-012", type: "same_event", strength: 0.5, sourcePlatform: "event" },
  { source: "p-001", target: "p-015", type: "connected_to", strength: 0.8, sourcePlatform: "linkedin" },

  // p-002 Marcus Williams connections
  { source: "p-002", target: "p-003", type: "connected_to", strength: 0.65, sourcePlatform: "linkedin" },
  { source: "p-002", target: "p-007", type: "same_event", strength: 0.55, sourcePlatform: "event" },
  { source: "p-002", target: "p-010", type: "mutual", strength: 0.6, sourcePlatform: "linkedin" },
  { source: "p-002", target: "p-014", type: "same_event", strength: 0.5, sourcePlatform: "event" },
  { source: "p-002", target: "p-017", type: "connected_to", strength: 0.75, sourcePlatform: "linkedin" },

  // p-003 Sarah Rodriguez connections
  { source: "p-003", target: "p-010", type: "same_company", strength: 0.8, sourcePlatform: "linkedin" },
  { source: "p-003", target: "p-016", type: "connected_to", strength: 0.7, sourcePlatform: "linkedin" },
  { source: "p-003", target: "p-020", type: "mutual", strength: 0.6, sourcePlatform: "linkedin" },
  { source: "p-003", target: "p-025", type: "same_event", strength: 0.5, sourcePlatform: "event" },

  // p-004 James Okafor connections
  { source: "p-004", target: "p-007", type: "same_event", strength: 0.65, sourcePlatform: "event" },
  { source: "p-004", target: "p-015", type: "worked_at", strength: 0.85, sourcePlatform: "linkedin" },
  { source: "p-004", target: "p-027", type: "connected_to", strength: 0.7, sourcePlatform: "linkedin" },
  { source: "p-004", target: "p-009", type: "same_event", strength: 0.55, sourcePlatform: "event" },

  // p-005 Rachel Kim connections
  { source: "p-005", target: "p-013", type: "same_event", strength: 0.8, sourcePlatform: "event" },
  { source: "p-005", target: "p-019", type: "connected_to", strength: 0.75, sourcePlatform: "linkedin" },
  { source: "p-005", target: "p-022", type: "mutual", strength: 0.6, sourcePlatform: "linkedin" },
  { source: "p-005", target: "p-030", type: "same_event", strength: 0.55, sourcePlatform: "event" },

  // p-006 David Park connections
  { source: "p-006", target: "p-009", type: "same_event", strength: 0.7, sourcePlatform: "event" },
  { source: "p-006", target: "p-011", type: "connected_to", strength: 0.85, sourcePlatform: "linkedin" },
  { source: "p-006", target: "p-012", type: "same_event", strength: 0.5, sourcePlatform: "event" },
  { source: "p-006", target: "p-024", type: "mutual", strength: 0.65, sourcePlatform: "linkedin" },
  { source: "p-006", target: "p-028", type: "worked_at", strength: 0.9, sourcePlatform: "linkedin" },

  // p-007 Lisa Thompson connections
  { source: "p-007", target: "p-017", type: "same_event", strength: 0.7, sourcePlatform: "event" },
  { source: "p-007", target: "p-021", type: "connected_to", strength: 0.6, sourcePlatform: "linkedin" },
  { source: "p-007", target: "p-026", type: "mutual", strength: 0.55, sourcePlatform: "linkedin" },

  // p-008 Robert Martinez connections
  { source: "p-008", target: "p-014", type: "same_event", strength: 0.65, sourcePlatform: "event" },
  { source: "p-008", target: "p-018", type: "connected_to", strength: 0.7, sourcePlatform: "linkedin" },
  { source: "p-008", target: "p-022", type: "mutual", strength: 0.6, sourcePlatform: "linkedin" },
  { source: "p-008", target: "p-029", type: "same_event", strength: 0.5, sourcePlatform: "event" },

  // p-009 Jennifer Walsh connections
  { source: "p-009", target: "p-012", type: "same_event", strength: 0.7, sourcePlatform: "event" },
  { source: "p-009", target: "p-023", type: "connected_to", strength: 0.65, sourcePlatform: "linkedin" },
  { source: "p-009", target: "p-024", type: "worked_at", strength: 0.8, sourcePlatform: "linkedin" },

  // p-010 Kevin Zhang connections
  { source: "p-010", target: "p-020", type: "same_company", strength: 0.75, sourcePlatform: "linkedin" },
  { source: "p-010", target: "p-027", type: "same_event", strength: 0.6, sourcePlatform: "event" },
  { source: "p-010", target: "p-030", type: "connected_to", strength: 0.65, sourcePlatform: "linkedin" },

  // p-011 Amanda Foster connections
  { source: "p-011", target: "p-016", type: "connected_to", strength: 0.8, sourcePlatform: "linkedin" },
  { source: "p-011", target: "p-023", type: "mutual", strength: 0.55, sourcePlatform: "linkedin" },
  { source: "p-011", target: "p-028", type: "connected_to", strength: 0.85, sourcePlatform: "linkedin" },

  // p-012 Thomas Reed connections
  { source: "p-012", target: "p-013", type: "same_event", strength: 0.5, sourcePlatform: "event" },
  { source: "p-012", target: "p-019", type: "mutual", strength: 0.45, sourcePlatform: "linkedin" },

  // p-013 Nicole Patel connections
  { source: "p-013", target: "p-019", type: "connected_to", strength: 0.75, sourcePlatform: "linkedin" },
  { source: "p-013", target: "p-022", type: "same_event", strength: 0.6, sourcePlatform: "event" },

  // p-014 Christopher Johnson connections
  { source: "p-014", target: "p-018", type: "same_event", strength: 0.7, sourcePlatform: "event" },
  { source: "p-014", target: "p-022", type: "connected_to", strength: 0.65, sourcePlatform: "linkedin" },
  { source: "p-014", target: "p-029", type: "same_company", strength: 0.8, sourcePlatform: "linkedin" },

  // p-015 Michelle Torres connections
  { source: "p-015", target: "p-027", type: "connected_to", strength: 0.8, sourcePlatform: "linkedin" },
  { source: "p-015", target: "p-004", type: "shared_history", strength: 0.85, sourcePlatform: "linkedin" },

  // p-016 Daniel Kim connections
  { source: "p-016", target: "p-020", type: "connected_to", strength: 0.7, sourcePlatform: "linkedin" },
  { source: "p-016", target: "p-025", type: "same_event", strength: 0.55, sourcePlatform: "event" },
  { source: "p-016", target: "p-028", type: "mutual", strength: 0.6, sourcePlatform: "linkedin" },

  // p-017 Patricia Nguyen connections
  { source: "p-017", target: "p-021", type: "connected_to", strength: 0.75, sourcePlatform: "linkedin" },
  { source: "p-017", target: "p-026", type: "same_event", strength: 0.65, sourcePlatform: "event" },

  // p-018 Andrew Brooks connections
  { source: "p-018", target: "p-022", type: "same_event", strength: 0.65, sourcePlatform: "event" },
  { source: "p-018", target: "p-029", type: "connected_to", strength: 0.7, sourcePlatform: "linkedin" },

  // p-019 Samantha Price connections
  { source: "p-019", target: "p-030", type: "mutual", strength: 0.5, sourcePlatform: "linkedin" },

  // p-020 Brian Foster connections
  { source: "p-020", target: "p-030", type: "same_event", strength: 0.6, sourcePlatform: "event" },

  // p-021 Grace Liu connections
  { source: "p-021", target: "p-026", type: "same_event", strength: 0.65, sourcePlatform: "event" },

  // p-023 Laura Diaz connections
  { source: "p-023", target: "p-024", type: "connected_to", strength: 0.7, sourcePlatform: "linkedin" },
  { source: "p-023", target: "p-028", type: "same_event", strength: 0.55, sourcePlatform: "event" },

  // p-025 Olivia Jackson connections
  { source: "p-025", target: "p-026", type: "mutual", strength: 0.5, sourcePlatform: "linkedin" },
  { source: "p-025", target: "p-030", type: "connected_to", strength: 0.55, sourcePlatform: "linkedin" },

  // p-027 Cynthia Moore connections
  { source: "p-027", target: "p-030", type: "same_event", strength: 0.5, sourcePlatform: "event" },

  // p-028 Raymond Torres connections
  { source: "p-028", target: "p-029", type: "connected_to", strength: 0.65, sourcePlatform: "linkedin" },

  // p-029 Angela White connections
  { source: "p-029", target: "p-030", type: "mutual", strength: 0.45, sourcePlatform: "linkedin" },
];
