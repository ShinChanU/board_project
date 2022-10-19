import axios from 'axios';

export const getNewsEPL = async () => {
  try {
    const res = await axios.get('/search/news.json?query="epl"', {
      headers: {
        'X-Naver-Client-Id': String(process.env.REACT_APP_NAVER_CLIENT_ID),
        'X-Naver-Client-Secret': String(
          process.env.REACT_APP_NAVER_CLIENT_SECRET,
        ),
      },
    });
    return res.data.items;
  } catch (e) {
    return e;
  }
};
