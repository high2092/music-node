import Home from '.';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Music } from '../types/music';
import { MusicNode } from '../types/musicNode';
import { parse, serialize } from 'cookie';
import { HOST } from '../constants/auth';
import { http } from '../utils/api';

interface OtherPageProps {
  readonly: boolean;
  musics: Record<number, Music>;
  musicNodes: Record<number, MusicNode>;
}

function Other({ readonly, musics, musicNodes }: OtherPageProps) {
  return <Home readonly={readonly} musics={musics} musicNodes={musicNodes} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<OtherPageProps>> {
  const { token } = parse(context.req.headers.cookie);

  const cookie = serialize('token', token, {
    httpOnly: true,
    maxAge: 60,
  });

  const authResponse = await http.get(`${HOST}/api/auth`, {
    credentials: 'include',
    headers: {
      Cookie: cookie,
    },
  });

  const { username } = await authResponse.json();

  if (context.params.username === username) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const response = await http.get(`${HOST}/api/data/user/${context.params.username}`, {
    credentials: 'include',
    headers: {
      Cookie: cookie,
    },
  });

  if (response.status !== 200) {
    return {
      props: {
        readonly: true,
        musics: {},
        musicNodes: {},
      },
    };
  }

  const { musics: musicList, musicNodes: musicNodeList } = await response.json();

  const musics = Object.fromEntries(musicList.map((music: Music) => [music.id, music]));
  const musicNodes = Object.fromEntries(musicNodeList.map((musicNode: MusicNode) => [musicNode.id, musicNode]));

  return {
    props: {
      readonly: true,
      musics,
      musicNodes,
    },
  };
}

export default Other;
