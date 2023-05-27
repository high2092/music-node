import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { MUSIC_DATA_TRANSFER_KEY } from '../constants/interface';
import { Music } from '../types/music';
import { Div } from '../styles/common/Div';

interface SearchResult {
  title: string;
  videoId: string;
}

export function SearchManager() {
  const { register, handleSubmit } = useForm();
  const [searchResultList, setSearchResultList] = useState<SearchResult[]>([]);

  const handleSearch = async ({ query }: FieldValues) => {
    const response = await fetch(`/api/search-youtube?q=${query}`, { method: 'GET' });

    if (!response.ok) {
      console.error(response.statusText);
      return;
    }

    const { items } = await response.json();
    setSearchResultList(items.map(({ id: { videoId }, snippet: { title } }) => ({ title, videoId })));
  };

  const handleDragStart = (e: React.DragEvent, { name, videoId }) => {
    e.dataTransfer.setData(MUSIC_DATA_TRANSFER_KEY, JSON.stringify({ name, videoId }));
  };

  return (
    <>
      <div onSubmit={handleSubmit(handleSearch)}>
        <form style={{ display: 'flex' }}>
          <input style={{ flexGrow: 1 }} {...register('query')} />
          <button style={{ width: 'max-content' }}>검색</button>
        </form>
      </div>
      <div style={{ height: '88%', overflow: 'scroll' }}>
        {searchResultList.map(({ title: name, videoId }, idx) => (
          <Div key={`searchResult-${videoId}-${idx}`} onDragStart={(e) => handleDragStart(e, { name, videoId })} draggable>
            <div>{name}</div>
          </Div>
        ))}
      </div>
    </>
  );
}
