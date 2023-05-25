import { Music } from '../types/music';

class MusicService {
  sequence: number;

  constructor() {
    this.sequence = 1;
  }

  createMusic(name: string, videoId: string): Music {
    return { id: this.sequence++, name, videoId };
  }
}

export const musicService = new MusicService();
