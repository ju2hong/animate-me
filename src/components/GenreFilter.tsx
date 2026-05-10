import type { Genre } from '../types/anime';

interface Props {
  genres: Genre[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export default function GenreFilter({ genres, selected, onSelect }: Props) {
  return (
    <div className="genre-filter">
      <button
        className={`genre-btn ${selected === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        전체
      </button>
      {genres.map(g => (
        <button
          key={g.mal_id}
          className={`genre-btn ${selected === g.mal_id ? 'active' : ''}`}
          onClick={() => onSelect(g.mal_id === selected ? null : g.mal_id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
