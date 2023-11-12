import { NextApiRequest, NextApiResponse } from 'next';
import { deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicNodeDbRef, getUserDbRef } from '../../../utils/db';

// INFO: DELETE body undefined 이슈로 인해 POST 메소드를 사용함
export default async function deleteMusicNode(req: NextApiRequest, res: NextApiResponse) {
  const id = authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      const { nodes } = req.body;

      let cnt = 0;

      const musicNodeDbRef = getMusicNodeDbRef(getUserDbRef(id));

      for (const nodeId of nodes) {
        const q = query(musicNodeDbRef, where('id', '==', nodeId));
        const node = (await getDocs(q)).docs[0];

        if (node) {
          deleteDoc(node.ref);
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
