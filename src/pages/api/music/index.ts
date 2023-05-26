import { NextApiRequest, NextApiResponse } from 'next';
import { musicService } from '../../../server/service/MusicService';
import { musicRepository } from '../../../server/repository/MusicRepository';

export default function music(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return res.json({ musics: musicRepository.findAll() });
    }
    case 'POST': {
      const { name, videoId } = req.body;
      const music = musicService.createMusic(name, videoId);
      return res.json({ music });
    }
  }
}
