import { useEffect, useState } from 'react';
import { MUSIC_DATA_TRANSFER_KEY } from '../../constants/interface';
import { addMusic, findByMusicId, renameMusic } from '../../features/mainSlice';
import { useAppDispatch, useAppSelector } from '../../features/store';
import { trim } from '../../utils/string';
import { ScopeIcon } from '../icons/ScopeIcon';
import { EditIcon } from '../icons/EditIcon';
import { BlankIcon } from '../icons/BlankIcon';
import { Tutorials } from '../../features/tutorialSlice';
import { cursorPointer } from '../icons/CursorPointer.css';
import { row } from '../../styles/components/row.css';
import { musicList } from './MusicManager.css';
import { handleUnauthorized, http } from '../../utils/api';

export function MusicManager() {
  const dispatch = useAppDispatch();
  const { musics, musicSequence, findMusicId, findDepth, foundNodeList } = useAppSelector((state) => state.main);
  const { tutorials } = useAppSelector((state) => state.tutorial);

  const [filterQuery, setFilterQuery] = useState('');
  const [hoveredMusicId, setHoveredMusicId] = useState<number>(null);
  const [editingMusicId, setEditingMusicId] = useState<number>(null);

  const filteredMusicList = Object.values(musics).filter(({ name }) => trim(name).includes(trim(filterQuery)));

  useEffect(() => {
    const resetHover = () => {
      setHoveredMusicId(null);
    };
    window.addEventListener('mouseover', resetHover);
    return () => window.removeEventListener('mouseover', resetHover);
  }, []);

  useEffect(() => {
    const escapeRename = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditingMusicId(null);
    };
    window.addEventListener('keydown', escapeRename);
    return () => window.removeEventListener('keydown', escapeRename);
  }, []);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData(MUSIC_DATA_TRANSFER_KEY, JSON.stringify({ musicId: id }));
  };

  const handleMouseOver = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setHoveredMusicId(id);
  };

  const handleRenameInputKeyDown = async (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key !== 'Enter') return;
    const target = e.target as HTMLInputElement;

    const response = await http.post('/api/data/rename-music', { id: editingMusicId, name: target.value });
    if (response.status === 401) {
      handleUnauthorized();
      return;
    } else if (response.status !== 200) return;

    dispatch(renameMusic({ id: editingMusicId, name: target.value }));
    setEditingMusicId(null);
  };

  // tutorial={tutorials[Tutorials.CREATE_NODE]}

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ width: 'max-content' }}>필터</label>
        <input onChange={(e) => setFilterQuery(e.target.value)} onKeyDown={(e) => e.stopPropagation()} value={filterQuery} />
      </div>
      <div className={musicList} style={{ height: '88%' }}>
        {filteredMusicList.map(({ id, name, videoId }) => (
          <div className={row} key={`music-${id}`} style={{ justifyContent: 'space-between', alignItems: 'center' }} onMouseOver={(e) => handleMouseOver(e, id)} onDragStart={(e) => handleDragStart(e, id)} draggable>
            <div style={{ width: '100%' }}>
              {id === editingMusicId ? (
                <div style={{ display: 'flex' }}>
                  <input style={{ flexGrow: 1 }} defaultValue={name} onKeyDown={handleRenameInputKeyDown} />
                </div>
              ) : (
                <div>
                  <div style={{ display: 'inline' }}>{name}</div>
                  <div className={cursorPointer} style={{ marginLeft: '0.5rem', display: 'inline', verticalAlign: 'middle' }} onClick={() => setEditingMusicId(id)}>
                    {id === hoveredMusicId ? <EditIcon /> : <BlankIcon />}
                  </div>
                </div>
              )}
            </div>
            <div style={{ paddingLeft: '1rem', display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', paddingRight: '0.2rem' }}>{id === findMusicId ? `${findDepth}/${foundNodeList.length}` : ''}</div>
              <div className={cursorPointer} onClick={() => dispatch(findByMusicId(id))}>
                <ScopeIcon />
              </div>
              <div />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
