import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useNewsQueryHook = () => {
  return useQuery(['getNews'], async () => {
    const res = await axios.get('/search/news.json?query="epl"', {
      headers: {
        'X-Naver-Client-Id': String(process.env.REACT_APP_NAVER_CLIENT_ID),
        'X-Naver-Client-Secret': String(
          process.env.REACT_APP_NAVER_CLIENT_SECRET,
        ),
      },
    });
    console.log(res);
    return res;
  });
};
