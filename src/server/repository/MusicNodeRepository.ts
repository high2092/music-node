import { MusicNode } from '../../types/musicNode';
import { Repository } from './Repository';

class MusicNodeRepository extends Repository<MusicNode> {
  findByMusic(musicId: number) {
    for (const id in this.entities) {
      if (this.entities[id].musicId === musicId) return this.entities[id];
    }
  }
}

export const musicNodeRepository = new MusicNodeRepository();
