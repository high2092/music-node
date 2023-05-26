import { NextApiRequest, NextApiResponse } from 'next';
import { decodeV1 } from '../../utils/encoding';
import { musicNodeRepository } from '../../server/repository/MusicNodeRepository';
import { musicRepository } from '../../server/repository/MusicRepository';

export default function load(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body;
  const { musics, musicNodes } = JSON.parse(decodeV1(code));

  musicRepository.load(musics);
  musicNodeRepository.load(musicNodes);

  return res.json({ musics, musicNodes });
}
