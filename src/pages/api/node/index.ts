import { NextApiRequest, NextApiResponse } from 'next';
import { musicNodeRepository } from '../../../server/repository/MusicNodeRepository';
import { musicNodeService } from '../../../server/service/MusicNodeService';

export default function musicNode(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return res.json({ musics: musicNodeRepository.findAll() });
    }
    case 'POST': {
      const { musicId, position } = req.body;
      const musicNode = musicNodeService.createMusicNode(musicId, position);
      return res.json({ musicNode });
    }
  }
}
