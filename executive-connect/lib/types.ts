// ─── Core Types ──────────────────────────────────────────────────────────────

export type Executive = {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedin: string;
  industry: string;
  interests: string[];
  cities: string[];
  avatar?: string;
};

export type EventType =
  | "Summit"
  | "Conference"
  | "Roundtable"
  | "Mixer"
  | "Private Dinner"
  | "Leadership Forum";

export type AccessType = "Public" | "Paid" | "Invite Only";

export type Event = {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  venue: string;
  city: string;
  state: string;
  eventType: EventType;
  accessType: AccessType;
  host: string;
  description: string;
  topics: string[];
  attendeeCount: number;
  registrationUrl?: string;
  featured?: boolean;
  matchScore?: number;
  attendeeIds?: string[];
};

export type Person = {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedin: string;
  industry: string;
  expertise: string[];
  eventIds: string[];
  avatar?: string;
  whyMeet?: string;
  starters?: string[];
  matchScore?: number;
};

export type RelationshipType =
  | "worked_at"
  | "connected_to"
  | "attended"
  | "same_company"
  | "same_event"
  | "mutual"
  | "same_org"
  | "shared_history";

export type Relationship = {
  source: string;
  target: string;
  type: RelationshipType;
  strength: number; // 0..1
  sourcePlatform?: "linkedin" | "event" | "manual";
};

// ─── Graph Types ──────────────────────────────────────────────────────────────

export type GraphNode = {
  id: string;
  label: string;
  title: string;
  company: string;
  avatar?: string;
  isMe?: boolean;
};

export type GraphEdge = {
  source: string;
  target: string;
  type: RelationshipType;
  strength: number;
};

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

// ─── Session ──────────────────────────────────────────────────────────────────

export type Session = {
  id: string;
  email: string;
  name: string;
  title?: string;
  company?: string;
  industry?: string;
  interests?: string[];
  cities?: string[];
};

// ─── Filter ───────────────────────────────────────────────────────────────────

export type EventFilter = {
  domain?: string;
  city?: string;
  accessType?: AccessType;
};
