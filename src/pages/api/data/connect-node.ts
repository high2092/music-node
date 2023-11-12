import { NextApiRequest, NextApiResponse } from 'next';
import { getDocs, query, setDoc, where } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicNodeDbRef, getUserDbRef } from '../../../utils/db';

export default async function connectNode(req: NextApiRequest, res: NextApiResponse) {
  const id = authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      const { source, target } = req.body;

      const musicNodeDbRef = getMusicNodeDbRef(getUserDbRef(id));

      const q = query(musicNodeDbRef, where('id', '==', source));
      const musicNode = (await getDocs(q)).docs[0];

      if (musicNode) {
        setDoc(musicNode.ref, { ...musicNode.data(), next: target });
      }

      return res.end();
    }
    default: {
      return res.status(405).end();
    }
  }
}
