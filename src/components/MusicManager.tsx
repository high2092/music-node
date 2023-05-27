import { useState } from 'react';
import { MUSIC_DATA_TRANSFER_KEY } from '../constants/interface';
import { addMusic, findByMusicId } from '../features/mainSlice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { Div } from '../styles/common/Div';
import { trim } from '../utils/string';
import { IconDiv } from './icons/IconDiv';
import { ScopeIcon } from './icons/ScopeIcon';

export function MusicManager() {
  const dispatch = useAppDispatch();
  const { musics, musicSequence, findMusicId, findDepth, foundNodeList } = useAppSelector((state) => state.main);

  const [filterQuery, setFilterQuery] = useState('');

  const filteredMusicList = Object.values(musics).filter(({ name }) => trim(name).includes(trim(filterQuery)));

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData(MUSIC_DATA_TRANSFER_KEY);
    const { name, videoId } = JSON.parse(data);
    if (!name || !videoId) return;
    const music = { id: musicSequence, name, videoId };
    dispatch(addMusic(music));
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData(MUSIC_DATA_TRANSFER_KEY, JSON.stringify({ musicId: id }));
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ width: 'max-content' }}>필터</label>
        <input onChange={(e) => setFilterQuery(e.target.value)} value={filterQuery} />
      </div>
      <div style={{ height: '88%', overflow: 'scroll' }} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        {filteredMusicList.map(({ id, name, videoId }) => (
          <Div key={`music-${id}`} style={{ justifyContent: 'space-between', alignItems: 'center' }} onDragStart={(e) => handleDragStart(e, id)} draggable>
            <div>{name}</div>
            <div style={{ paddingLeft: '1rem', display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', paddingRight: '0.2rem' }}>{id === findMusicId ? `${findDepth}/${foundNodeList.length}` : ''}</div>
              <IconDiv onClick={() => dispatch(findByMusicId(id))}>
                <ScopeIcon />
              </IconDiv>
              <div />
            </div>
          </Div>
        ))}
      </div>
    </>
  );
}
