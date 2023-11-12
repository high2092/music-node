import { NextApiRequest, NextApiResponse } from 'next';
import { addDoc, runTransaction } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicNodeDbRef, getMusicNodeSequenceDbRef, getUserDbRef } from '../../../utils/db';
import { db } from '../../../../firebase/firestore';

export default async function postMusicNode(req: NextApiRequest, res: NextApiResponse) {
  const id = authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      const { musicId, position } = req.body;

      const userDbRef = getUserDbRef(id);
      const musicNodeSequenceDbRef = getMusicNodeSequenceDbRef(userDbRef);
      const musicNodeDbRef = getMusicNodeDbRef(userDbRef);

      let musicNode = { id: undefined, musicId, position };
      await runTransaction(db, async (transaction) => {
        const { node_sequence } = (await transaction.get(musicNodeSequenceDbRef)).data();
        musicNode.id = node_sequence;

        transaction.set(musicNodeSequenceDbRef, { node_sequence: node_sequence + 1 });
        addDoc(musicNodeDbRef, musicNode);
      });

      return res.json({ musicNode });
    }
    default: {
      return res.status(405).end();
    }
  }
}
