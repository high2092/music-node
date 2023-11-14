import { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDocs, writeBatch } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicDbRef, getMusicNodeDbRef, getMusicNodeSequenceDbRef, getMusicSequenceDbRef, getUserDbRef } from '../../../utils/db';
import { db } from '../../../../firebase/firestore';

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function set(req: NextApiRequest, res: NextApiResponse) {
  const { id } = await authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      const { musics, musicNodes } = req.body;

      const userDbRef = getUserDbRef(id);
      const musicDbRef = getMusicDbRef(userDbRef);
      const musicNodeDbRef = getMusicNodeDbRef(userDbRef);
      const musicSequenceDbRef = getMusicSequenceDbRef(userDbRef);
      const musicNodeSequenceDbRef = getMusicNodeSequenceDbRef(userDbRef);

      const music = (await getDocs(musicDbRef)).docs[0];
      if (music) return res.status(409).end();

      let music_sequence = 1;
      let node_sequence = 1;

      const batch = writeBatch(db);

      for (const music of musics) {
        batch.set(doc(musicDbRef), music);
        music_sequence = Math.max(music.id, music_sequence + 1);
      }

      for (const node of musicNodes) {
        batch.set(doc(musicNodeDbRef), node);
        node_sequence = Math.max(node.id, node_sequence + 1);
      }

      batch.set(musicSequenceDbRef, { music_sequence });
      batch.set(musicNodeSequenceDbRef, { node_sequence });

      await batch.commit();

      return res.end();
    }
    default: {
      return res.status(405).end();
    }
  }
}
