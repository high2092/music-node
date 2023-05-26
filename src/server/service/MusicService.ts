import { Music } from '../../types/music';
import { musicNodeRepository } from '../repository/MusicNodeRepository';
import { musicRepository } from '../repository/MusicRepository';

class MusicService {
  createMusic(name: string, videoId: string) {
    const music: Music = { name, videoId };
    const alreadyExist = musicRepository.findByVideoId(videoId);
    if (alreadyExist) return alreadyExist;
    musicRepository.save(music);
    return music;
  }

  deleteMusic(id: number) {
    if (musicNodeRepository.findByMusic(id)) throw new Error();
    musicRepository.deleteById(id);
  }
}

export const musicService = new MusicService();
