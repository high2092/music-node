import { NextApiRequest, NextApiResponse } from 'next';

async function getVideoTitle(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.API_KEY;
  const videoId = req.query.videoId as string;

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`);

  if (!response.ok) {
    console.error(response.statusText);
    return;
  }

  const { items } = await response.json();
  return res.json({ title: items[0].snippet.title });
}

export default getVideoTitle;
