// News article types based on the backend from https://github.com/nyujuzer/integrityproject

export interface NewsArticle {
  id?: string;
  title: string;
  content?: string;
  body?: string; // alternate field name as used in some API responses
  tags: string[];
  views_last_24?: number;
  created_at?: string;
}

export interface RankedArticle extends NewsArticle {
  rank: number;
}

export const TAGS = [
  "POLITICS",
  "ECONOMY",
  "TECHNOLOGY",
  "HEALTH",
  "ENTERTAINMENT",
  "SPORTS",
  "ENVIRONMENT",
  "INTERNATIONAL",
  "CULTURE",
  "OPINION",
  "INVESTIGATIONS",
  "BREAKING_NEWS",
  "CONSPIRACIES",
  "HUMAN_INTEREST",
  "CELEBRITIES",
  "SCIENCE",
  "CRIME",
  "MILITARY",
  "FAITH",
  "WEIRD_NEWS",
  "UFO_SIGHTINGS",
  "CORPORATE_SCANDALS",
  "ARTIFICIAL_INTELLIGENCE",
  "HISTORICAL_REVISIONISM",
  "AGRICULTURE",
  "EDUCATION",
  "SOCIAL_MEDIA",
  "SECRET_SOCIETIES",
  "REAL_ESTATE",
];
