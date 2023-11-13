import { NextApiRequest, NextApiResponse } from 'next';
import { getDocs, query, runTransaction, setDoc, where, writeBatch } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicNodeDbRef, getUserDbRef } from '../../../utils/db';
import { db } from '../../../../firebase/firestore';

export default async function disconnectNode(req: NextApiRequest, res: NextApiResponse) {
  const { id } = authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      const { sources } = req.body;

      const musicNodeDbRef = getMusicNodeDbRef(getUserDbRef(id));

      const nodes = await Promise.all(
        sources.map(async (source: number) => {
          const q = query(musicNodeDbRef, where('id', '==', source));
          const node = (await getDocs(q)).docs[0];
          return node;
        })
      );

      const batch = writeBatch(db);

      nodes.forEach((node) => {
        batch.set(node.ref, { ...node.data(), next: null });
      });

      batch.commit();

      return res.end();
    }
    default: {
      return res.status(405).end();
    }
  }
}
