import { MUSIC_DATA_TRANSFER_KEY } from '../constants/interface';
import { addMusic } from '../features/mainSlice';
import { useAppDispatch, useAppSelector } from '../features/store';
import { musicService } from '../server/MusicService';
import { Div } from '../styles/common/Div';

export function MusicManager() {
  const dispatch = useAppDispatch();
  const { musics } = useAppSelector((state) => state.main);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const { name, videoId } = JSON.parse(e.dataTransfer.getData(MUSIC_DATA_TRANSFER_KEY));
    const music = musicService.createMusic(name, videoId);
    dispatch(addMusic(music));
  };

  const handleDragStart = (e: React.DragEvent, { name, videoId }) => {
    e.dataTransfer.setData(MUSIC_DATA_TRANSFER_KEY, JSON.stringify({ name, videoId }));
  };

  return (
    <>
      <div style={{ height: '7%', display: 'flex', alignItems: 'center' }}>
        <label>필터</label>
        <input />
      </div>
      <div style={{ height: '93%', background: '#dddddd' }} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        {Object.values(musics).map(({ id, name, videoId }) => (
          <Div key={`music-${id}`} onDragStart={(e) => handleDragStart(e, { name, videoId })} draggable>
            {name}
          </Div>
        ))}
      </div>
    </>
  );
}
