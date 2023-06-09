import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { MUSIC_DATA_TRANSFER_KEY } from '../constants/interface';
import { Music } from '../types/music';
import { Div } from '../styles/common/Div';
import * as S from '../styles/components/SearchManager';
import { useAppDispatch, useAppSelector } from '../features/store';
import { Tutorials, completeTutorial } from '../features/tutorialSlice';
import { decodeHtmlEntities } from '../utils/string';

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
      <div onSubmit={handleSubmit(handleSearch)}>
        <S.SearchInputForm tutorial={tutorials[Tutorials.SEARCH]}>
          <input style={{ flexGrow: 1 }} {...register('query')} onKeyDown={(e) => e.stopPropagation()} />
          <button style={{ width: 'max-content' }} disabled={isWaiting}>
            검색
          </button>
        </S.SearchInputForm>
      </div>
      <S.SearchResultListContainer style={{ height: '88%' }}>
        {isWaiting ? (
          <WaitingSearchSpinner />
        ) : (
          <S.SearchResultList style={{ height: '100%' }}>
            {searchResultList.map(({ title: name, videoId }, idx) => (
              <Div key={`searchResult-${videoId}-${idx}`} onDragStart={(e) => handleDragStart(e, { name, videoId })} draggable>
                <div>{name}</div>
              </Div>
            ))}
          </S.SearchResultList>
        )}
      </S.SearchResultListContainer>
    </>
  );
}

function WaitingSearchSpinner() {
  return (
    <S.WaitingSearchSpinnerContainer>
      <S.WaitingSearchSpinner />
      <S.WaitingSearchSpinner delayed />
    </S.WaitingSearchSpinnerContainer>
  );
}
