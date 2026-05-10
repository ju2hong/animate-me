import { useEffect } from 'react';
import type { Anime } from '../types/anime';

interface Props {
  anime: Anime;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClose: () => void;
}

export default function AnimeModal({ anime, isFavorite, onToggleFavorite, onClose }: Props) {
  const title = anime.title_english ?? anime.title;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-content">
          <div className="modal-left">
            <img src={anime.images.jpg.large_image_url} alt={title} />
            <button
              className={`fav-btn-lg ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(anime.mal_id)}
            >
              {isFavorite ? '♥ 즐겨찾기 해제' : '♡ 즐겨찾기 추가'}
            </button>
          </div>
          <div className="modal-right">
            <h2>{title}</h2>
            {title !== anime.title && <p className="modal-original-title">{anime.title}</p>}

            <div className="modal-stats">
              {anime.score && (
                <div className="stat">
                  <span className="stat-label">평점</span>
                  <span className="stat-value">⭐ {anime.score.toFixed(1)}</span>
                </div>
              )}
              {anime.rank && (
                <div className="stat">
                  <span className="stat-label">순위</span>
                  <span className="stat-value">#{anime.rank}</span>
                </div>
              )}
              {anime.episodes && (
                <div className="stat">
                  <span className="stat-label">에피소드</span>
                  <span className="stat-value">{anime.episodes}화</span>
                </div>
              )}
              {anime.year && (
                <div className="stat">
                  <span className="stat-label">방영년도</span>
                  <span className="stat-value">{anime.year}</span>
                </div>
              )}
              <div className="stat">
                <span className="stat-label">상태</span>
                <span className="stat-value">{anime.status}</span>
              </div>
              {anime.type && (
                <div className="stat">
                  <span className="stat-label">유형</span>
                  <span className="stat-value">{anime.type}</span>
                </div>
              )}
            </div>

            <div className="modal-genres">
              {anime.genres.map(g => (
                <span key={g.mal_id} className="genre-tag">{g.name}</span>
              ))}
            </div>

            {anime.studios.length > 0 && (
              <p className="modal-studio">
                <strong>제작사:</strong> {anime.studios.map(s => s.name).join(', ')}
              </p>
            )}

            {anime.synopsis && (
              <div className="modal-synopsis">
                <h3>줄거리</h3>
                <p>{anime.synopsis}</p>
              </div>
            )}

            {anime.trailer?.url && (
              <a
                href={anime.trailer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="trailer-btn"
              >
                ▶ 트레일러 보기
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
