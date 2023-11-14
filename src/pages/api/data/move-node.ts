import { NextApiRequest, NextApiResponse } from 'next';
import { QueryDocumentSnapshot, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicNodeDbRef, getUserDbRef } from '../../../utils/db';
import { db } from '../../../../firebase/firestore';
import { XYPosition } from 'reactflow';

export default async function moveMusicNode(req: NextApiRequest, res: NextApiResponse) {
  const { id } = await authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      const { nodeMoves } = req.body;

      let cnt = 0;

      const musicNodeDbRef = getMusicNodeDbRef(getUserDbRef(id));

      const batch = writeBatch(db);

      const nodes: [QueryDocumentSnapshot, XYPosition][] = await Promise.all(
        nodeMoves.map(async ({ id, position }) => {
          const q = query(musicNodeDbRef, where('id', '==', id));
          const node = (await getDocs(q)).docs[0];
          return [node, position];
        })
      );

      nodes.forEach(([node, position]) => {
        batch.set(node.ref, { ...node.data(), position });
        cnt++;
      });

      batch.commit();

      return res.json({ count: cnt });
    }
    default: {
      return res.status(405).end();
    }
  }
}
