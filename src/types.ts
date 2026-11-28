export interface Beer {
  id: number;
  name: string;
  brewery: string;
  style: string;
  country: string;
  abvPercentage: number;
  imageUrl: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  username: string;
}

export interface RankingEntry {
  username: string;
  uniqueBeerCount: number;
}

export interface LabelSuggestions {
  name: string | null;
  brewery: string | null;
  style: string | null;
  abvPercentage: number | null;
  country: string | null;
}