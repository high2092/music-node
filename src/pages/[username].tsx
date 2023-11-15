import { parse, serialize } from 'cookie';
import Home from '.';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { http } from '../utils/api';
import { HOST } from '../constants/auth';

interface OtherPageProps {
  username: string;
}

function Other({ username }: OtherPageProps) {
  return <Home username={username} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<OtherPageProps>> {
  const username = context.params.username as string;

  const { token } = parse(context.req.headers?.cookie ?? '');

  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 60,
  });

  const authResponse = await http.get(`${HOST}/api/auth`, {
    credentials: 'include',
    headers: {
      Cookie: cookie,
    },
  });

  const { username: myName } = authResponse.status === 200 ? await authResponse.json() : { username: undefined };

  if (username === myName) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: { username } };
}

export default Other;
