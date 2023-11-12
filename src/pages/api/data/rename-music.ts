import { NextApiRequest, NextApiResponse } from 'next';
import { getDocs, query, setDoc, where } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicDbRef, getUserDbRef } from '../../../utils/db';

export default async function renameMusic(req: NextApiRequest, res: NextApiResponse) {
  const id = authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      const { id: musicId, name } = req.body;

      const musicDbRef = getMusicDbRef(getUserDbRef(id));

      const q = query(musicDbRef, where('id', '==', musicId));
      const music = (await getDocs(q)).docs[0];

      if (music) {
        setDoc(music.ref, { ...music.data(), name });
      }

      return res.end();
    }
    default: {
      return res.status(405).end();
    }
  }
}
