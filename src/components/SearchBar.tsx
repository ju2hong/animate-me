import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form className="search-bar" onSubmit={submit}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="애니메이션 제목을 검색하세요..."
      />
      <button type="submit">🔍 검색</button>
      {value && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => { setValue(''); onSearch(''); }}
        >
          ✕
        </button>
      )}
    </form>
  );
}
