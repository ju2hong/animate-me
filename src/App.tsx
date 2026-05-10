import { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import AnimeCard from './components/AnimeCard';
import AnimeModal from './components/AnimeModal';
import GenreFilter from './components/GenreFilter';
import { useTopAnime, useSearchAnime, useGenres, useFavorites } from './hooks/useAnime';
import type { Anime } from './types/anime';
import './App.css';

type Tab = 'top' | 'search' | 'favorites';

export default function App() {
  const [tab, setTab] = useState<Tab>('top');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [topPage, setTopPage] = useState(1);
  const [selected, setSelected] = useState<Anime | null>(null);
  const [allTopAnime, setAllTopAnime] = useState<Anime[]>([]);

  const { anime: topAnime, loading: topLoading, error: topError, hasNext } = useTopAnime(topPage);
  const { results, loading: searchLoading, error: searchError, search } = useSearchAnime();
  const genres = useGenres();
  const { favorites, toggle } = useFavorites();

  useEffect(() => {
    if (topAnime.length) {
      setAllTopAnime(prev =>
        topPage === 1 ? topAnime : [...prev, ...topAnime]
      );
    }
  }, [topAnime, topPage]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query || selectedGenre) {
      setTab('search');
      search(query, selectedGenre ?? undefined);
    }
  }, [search, selectedGenre]);

  const handleGenreSelect = useCallback((genreId: number | null) => {
    setSelectedGenre(genreId);
    if (genreId) {
      setTab('search');
      search(searchQuery, genreId);
    } else if (searchQuery) {
      search(searchQuery, undefined);
    } else {
      setTab('top');
    }
  }, [search, searchQuery]);

  const favoriteAnime = allTopAnime.filter(a => favorites.includes(a.mal_id));

  const isLoading = tab === 'top' ? topLoading : tab === 'search' ? searchLoading : false;
  const error = tab === 'top' ? topError : tab === 'search' ? searchError : null;

  let displayAnime: Anime[] = [];
  if (tab === 'top') displayAnime = allTopAnime;
  else if (tab === 'search') displayAnime = results;
  else displayAnime = favoriteAnime;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🎌</span>
            <span className="logo-text">AnimateMe</span>
            <span className="logo-sub">애니메이션 추천</span>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <h1>당신에게 딱 맞는 애니메이션을 찾아보세요</h1>
          <p>MyAnimeList 데이터 기반 · 장르별 필터 · 즐겨찾기 저장</p>
        </section>

        <div className="tabs">
          <button className={`tab ${tab === 'top' ? 'active' : ''}`} onClick={() => setTab('top')}>
            🏆 인기 TOP
          </button>
          <button className={`tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')}>
            🔍 검색 결과
          </button>
          <button className={`tab ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>
            ♥ 즐겨찾기 ({favorites.length})
          </button>
        </div>

        <div className="genre-section">
          <GenreFilter genres={genres} selected={selectedGenre} onSelect={handleGenreSelect} />
        </div>

        {error && <div className="error-msg">{error}</div>}

        {isLoading && displayAnime.length === 0 ? (
          <div className="loading">
            <div className="spinner" />
            <p>로딩 중...</p>
          </div>
        ) : displayAnime.length === 0 ? (
          <div className="empty">
            {tab === 'search'
              ? '검색 결과가 없습니다. 다른 키워드로 검색해보세요.'
              : tab === 'favorites'
              ? '즐겨찾기한 애니메이션이 없습니다. ♥ 버튼을 눌러 추가해보세요!'
              : ''}
          </div>
        ) : (
          <div className="anime-grid">
            {displayAnime.map(anime => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                isFavorite={favorites.includes(anime.mal_id)}
                onToggleFavorite={toggle}
                onClick={setSelected}
              />
            ))}
          </div>
        )}

        {tab === 'top' && hasNext && !topLoading && (
          <button className="load-more" onClick={() => setTopPage(p => p + 1)}>
            더 보기
          </button>
        )}
        {tab === 'top' && topLoading && displayAnime.length > 0 && (
          <div className="loading-more">불러오는 중...</div>
        )}
      </main>

      <footer className="footer">
        <p>데이터 출처: <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer">Jikan API (MyAnimeList)</a></p>
        <p>AnimateMe · React + TypeScript + Vite</p>
      </footer>

      {selected && (
        <AnimeModal
          anime={selected}
          isFavorite={favorites.includes(selected.mal_id)}
          onToggleFavorite={toggle}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
