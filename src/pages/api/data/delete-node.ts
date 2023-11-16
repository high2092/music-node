import { NextApiRequest, NextApiResponse } from 'next';
import { QueryDocumentSnapshot, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicNodeDbRef, getUserDbRef } from '../../../utils/db';
import { db } from '../../../../firebase/firestore';

// INFO: DELETE body undefined 이슈로 인해 POST 메소드를 사용함
export default async function deleteMusicNode(req: NextApiRequest, res: NextApiResponse) {
  const { id } = await authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      const { nodes: nodeIdList } = req.body;

      let cnt = 0;

      const musicNodeDbRef = getMusicNodeDbRef(getUserDbRef(id));

      const batch = writeBatch(db);

      const prevs: QueryDocumentSnapshot[] = (
        await Promise.all(
          nodeIdList.map(async (nodeId: number) => {
            const q = query(musicNodeDbRef, where('next', '==', nodeId));
            const node = (await getDocs(q)).docs[0];
            return node;
          })
        )
      ).filter((node) => node);

      prevs.forEach((prev) => batch.set(prev.ref, { ...prev.data(), next: null }));

      const nodes: QueryDocumentSnapshot[] = await Promise.all(
        nodeIdList.map(async (nodeId: number) => {
          const q = query(musicNodeDbRef, where('id', '==', nodeId));
          const node = (await getDocs(q)).docs[0];
          return node;
        })
      );

      nodes.forEach((node) => batch.delete(node.ref));

      batch.commit();

      return res.json({ count: cnt });
    }
    default: {
      return res.status(405).end();
    }
  }
}
