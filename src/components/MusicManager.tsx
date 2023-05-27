import { useState } from 'react';
import { MUSIC_DATA_TRANSFER_KEY } from '../constants/interface';
import { addMusic } from '../features/mainSlice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { Div } from '../styles/common/Div';
import { http } from '../utils/api';
import { trim } from '../utils/string';

export function MusicManager() {
  const dispatch = useAppDispatch();
  const { musics } = useAppSelector((state) => state.main);

  const [filterQuery, setFilterQuery] = useState('');

  const filteredMusicList = Object.values(musics).filter(({ name }) => trim(name).includes(trim(filterQuery)));

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData(MUSIC_DATA_TRANSFER_KEY);
    const { name, videoId } = JSON.parse(data);
    if (!name || !videoId) return;
    const { music } = await http.post('/api/music', { name, videoId });
    dispatch(addMusic(music));
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData(MUSIC_DATA_TRANSFER_KEY, JSON.stringify({ musicId: id }));
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label>필터</label>
        <input onChange={(e) => setFilterQuery(e.target.value)} value={filterQuery} />
      </div>
      <div style={{ height: '88%', overflow: 'scroll' }} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        {filteredMusicList.map(({ id, name, videoId }) => (
          <Div key={`music-${id}`} onDragStart={(e) => handleDragStart(e, id)} draggable>
            {name}
          </Div>
        ))}
      </div>
    </>
  );
}
