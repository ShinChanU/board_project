import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { NewsItemProps } from 'interfaces/News.interface';
import { getNewsEPL } from 'lib/api/news';
import { useNewsQueryHook } from 'lib/api/useNewsQueryHook';

const NewsPage = () => {
  useNewsQueryHook();
  const { data, isLoading, isError } = useQuery<NewsItemProps[]>(
    ['allNews'],
    () => getNewsEPL(),
  );

  if (isLoading) return <>loading..</>;
  if (isError) return <>에러 발생</>;

  return (
    <div>
      <ul>
        {data?.map((item: NewsItemProps) => (
          <li>
            <div
              style={{ color: 'red', fontWeight: '600' }}
              dangerouslySetInnerHTML={{ __html: item.title }}
            ></div>
            <div>네이버뉴스 : {item.link}</div>
            <div>원본: {item.originallink}</div>
            <div>발행날짜 : {item.pubDate}</div>
            <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsPage;
