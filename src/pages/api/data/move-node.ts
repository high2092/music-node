import { NextApiRequest, NextApiResponse } from 'next';
import { getDocs, query, setDoc, where } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicNodeDbRef, getUserDbRef } from '../../../utils/db';

export default async function moveMusicNode(req: NextApiRequest, res: NextApiResponse) {
  const id = authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      const { nodeMoves } = req.body;

      let cnt = 0;

      const musicNodeDbRef = getMusicNodeDbRef(getUserDbRef(id));

      for (const { id: nodeId, position } of nodeMoves) {
        const q = query(musicNodeDbRef, where('id', '==', nodeId));
        const node = (await getDocs(q)).docs[0];

        if (node) {
          setDoc(node.ref, { ...node.data(), position });
          cnt++;
        }
      }

      return res.json({ count: cnt });
    }
    default: {
      return res.status(405).end();
    }
  }
}
