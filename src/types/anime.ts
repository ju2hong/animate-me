export interface AnimeImage {
  jpg: {
    image_url: string;
    large_image_url: string;
  };
}

export interface Genre {
  mal_id: number;
  name: string;
  count?: number;
}

export interface Studio {
  name: string;
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  titles?: AnimeTitle[];
  images: AnimeImage;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  synopsis: string | null;
  genres: Genre[];
  episodes: number | null;
  status: string;
  aired: { string: string };
  year: number | null;
  season: string | null;
  type: string;
  studios: Studio[];
  rating: string;
  trailer?: { url: string | null };
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    has_next_page: boolean;
    current_page: number;
  };
}
