import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { MUSIC_DATA_TRANSFER_KEY } from '../../constants/interface';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { Tutorials, completeTutorial } from '../../features/tutorialSlice';
import { decodeHtmlEntities } from '../../utils/string';
import { row } from '../../styles/components/row.css';
import { searchResultContainer, spinner, spinnerContainer } from './SearchManager.css';
import { musicList } from '../MusicManager/MusicManager.css';

interface SearchResult {
  title: string;
  videoId: string;
}

export function SearchManager() {
  const dispatch = useAppDispatch();
  const { tutorials } = useAppSelector((state) => state.tutorial);

  const { register, handleSubmit } = useForm();
  const [searchResultList, setSearchResultList] = useState<SearchResult[]>([]);

  const [isWaiting, setIsWaiting] = useState(false);

  const handleSearch = async ({ query }: FieldValues) => {
    setIsWaiting(true);
    dispatch(completeTutorial(Tutorials.SEARCH));
    const response = await fetch(`/api/search-youtube?q=${query}`, { method: 'GET' });

    if (!response.ok) {
      console.error(response.statusText);
      return;
    }

    const { items } = await response.json();
    setSearchResultList(items.map(({ id: { videoId }, snippet: { title } }) => ({ title: decodeHtmlEntities(title), videoId })));
    setIsWaiting(false);
  };

  const handleDragStart = (e: React.DragEvent, { name, videoId }) => {
    e.dataTransfer.setData(MUSIC_DATA_TRANSFER_KEY, JSON.stringify({ name, videoId }));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ paddingRight: '0.5rem', wordBreak: 'keep-all' }}>유튜브 검색</div>
        <form onSubmit={handleSubmit(handleSearch)} style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex' }}>
            <input style={{ flexGrow: 1 }} {...register('query')} onKeyDown={(e) => e.stopPropagation()} placeholder={'예시) 별모래 해변 OST'} />
            <button style={{ width: 'max-content' }} disabled={isWaiting}>
              검색
            </button>
          </div>
        </form>
      </div>
      <div className={searchResultContainer} style={{ height: '88%' }}>
        {isWaiting ? (
          <WaitingSearchSpinner />
        ) : (
          <div className={musicList} style={{ height: '100%' }}>
            {searchResultList.map(({ title: name, videoId }, idx) => (
              <div className={row} key={`searchResult-${videoId}-${idx}`} onDragStart={(e) => handleDragStart(e, { name, videoId })} draggable>
                <div>{name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function WaitingSearchSpinner() {
  return (
    <div className={spinnerContainer}>
      <div className={spinner({ delayed: false })} />
      <div className={spinner({ delayed: true })} />
    </div>
  );
}
