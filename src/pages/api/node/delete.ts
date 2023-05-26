import { NextApiRequest, NextApiResponse } from 'next';
import { musicNodeService } from '../../../server/service/MusicNodeService';

export default function _delete(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { nodeIdList } = req.body;
      musicNodeService.deleteMusicNodes(nodeIdList);
      return res.json({});
    }
  }
}
