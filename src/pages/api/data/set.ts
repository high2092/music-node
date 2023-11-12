import { NextApiRequest, NextApiResponse } from 'next';
import { addDoc, deleteDoc, getDocs, setDoc } from 'firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { getMusicDbRef, getMusicNodeDbRef, getMusicNodeSequenceDbRef, getMusicSequenceDbRef, getUserDbRef } from '../../../utils/db';

export default async function set(req: NextApiRequest, res: NextApiResponse) {
  const id = authenticateToken(req.cookies.token);

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

      deleteDoc(userDbRef);

      let music_sequence = 1;
      let node_sequence = 1;

      for (const music of musics) {
        addDoc(musicDbRef, music);
        music_sequence = Math.max(music.id, music_sequence + 1);
      }

      for (const node of musicNodes) {
        addDoc(musicNodeDbRef, node);
        node_sequence = Math.max(node.id, node_sequence + 1);
      }

      setDoc(musicSequenceDbRef, { music_sequence });
      setDoc(musicNodeSequenceDbRef, { node_sequence });

      return res.end();
    }
    default: {
      return res.status(405).end();
    }
  }
}
