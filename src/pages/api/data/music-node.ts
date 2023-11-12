import { NextApiRequest, NextApiResponse } from 'next';
import { XYPosition } from 'reactflow';
import { MusicNode } from '../../../types/musicNode';
import { Music } from '../../../types/music';
import { doc, getDocs, query, runTransaction, where } from 'firebase/firestore';
import { db } from '../../../../firebase/firestore';
import { authenticateToken } from '../../../utils/auth';
import { HOST } from '../../../constants/auth';
import { getMusicDbRef, getMusicNodeDbRef, getMusicNodeSequenceDbRef, getMusicSequenceDbRef, getUserDbRef } from '../../../utils/db';

type VideoId = string;

interface PostMusicNodeWithAnchorRequest extends NextApiRequest {
  body: {
    name?: string;
    musicId?: number;
    videoId?: VideoId;
    position: XYPosition;
  };
}

interface PostMusicNodeWithAnchorResponse extends NextApiResponse {
  json: (body: { music: Music; musicNode: MusicNode }) => void;
}

export default async function postMusicNodeWithAnchor(req: PostMusicNodeWithAnchorRequest, res: PostMusicNodeWithAnchorResponse) {
  const id = authenticateToken(req.cookies.token);

  switch (req.method) {
    case 'POST': {
      let { musicId, name, videoId, position } = req.body;

      if (!musicId && videoId) {
        const response = await fetch(`${HOST}/api/video-title?videoId=${videoId}`);
        const { title } = await response.json();
        name = title;
      }

      let musicNode: MusicNode;

      const userDbRef = getUserDbRef(id);
      const musicSequenceDbRef = getMusicSequenceDbRef(userDbRef);
      const musicNodeSequenceDbRef = getMusicNodeSequenceDbRef(userDbRef);
      const musicDbRef = getMusicDbRef(userDbRef);
      const musicNodeDbRef = getMusicNodeDbRef(userDbRef);

      const q = query(musicDbRef, musicId ? where('id', '==', musicId) : where('videoId', '==', videoId));
      const music = (await getDocs(q)).docs[0];
      let musicData: Music = music?.data() as Music;

      await runTransaction(db, async (transaction) => {
        if (!music) {
          const { music_sequence } = (await transaction.get(musicSequenceDbRef)).data();
          musicData = { id: music_sequence, name, videoId };
        }

        const { node_sequence } = (await transaction.get(musicNodeSequenceDbRef)).data();
        musicNode = { id: node_sequence, musicId: musicData.id, position };

        if (!music) {
          transaction.set(musicSequenceDbRef, { music_sequence: musicData.id + 1 });
          transaction.set(doc(musicDbRef), musicData);
        }
        transaction.set(musicNodeSequenceDbRef, { node_sequence: node_sequence + 1 });
        transaction.set(doc(musicNodeDbRef), musicNode);
      });

      return res.json({ music: musicData, musicNode });
    }
    default: {
      return res.status(405).end();
    }
  }
}
