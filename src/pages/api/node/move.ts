import { NextApiRequest, NextApiResponse } from 'next';
import { musicNodeService } from '../../../server/service/MusicNodeService';

export default function moveNode(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { nodeMoves } = req.body;
      musicNodeService.moveNode(nodeMoves);
      return res.json({ count: nodeMoves.length });
    }
  }
}
