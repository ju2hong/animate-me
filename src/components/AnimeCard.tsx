import type { Anime } from '../types/anime';

interface Props {
  anime: Anime;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClick: (anime: Anime) => void;
}

export default function AnimeCard({ anime, isFavorite, onToggleFavorite, onClick }: Props) {
  const title = anime.title_english ?? anime.title;

  return (
    <div className="anime-card" onClick={() => onClick(anime)}>
      <div className="anime-card-img-wrap">
        <img src={anime.images.jpg.image_url} alt={title} loading="lazy" />
        {anime.score && (
          <span className="anime-score">⭐ {anime.score.toFixed(1)}</span>
        )}
        <button
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleFavorite(anime.mal_id); }}
          title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <div className="anime-card-body">
        <h3 className="anime-title">{title}</h3>
        <div className="anime-meta">
          {anime.year && <span>{anime.year}</span>}
          {anime.episodes && <span>{anime.episodes}화</span>}
          {anime.type && <span>{anime.type}</span>}
        </div>
        <div className="anime-genres">
          {anime.genres.slice(0, 3).map(g => (
            <span key={g.mal_id} className="genre-tag">{g.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
