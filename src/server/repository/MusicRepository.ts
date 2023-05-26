import { Music } from '../../types/music';
import { Repository } from './Repository';

class MusicRepository extends Repository<Music> {
  findByVideoId(videoId: string) {
    for (const id in this.entities) {
      if (this.entities[id].videoId === videoId) return this.entities[id];
    }
  }
}

export const musicRepository = new MusicRepository();
