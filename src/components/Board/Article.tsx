import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import oc from 'open-color';
import { BoardDetailDataProps } from 'interfaces/Board.interface';
import { StringProps } from 'interfaces/User.interface';

const Tr = styled.tr``;

interface TdProps {
  accent?: string;
}

const Td = styled.td<TdProps>`
  cursor: pointer;

  ${(props) =>
    (props.accent === 'notice' || props.accent === 'result') &&
    css`
      color: ${oc.indigo[7]};
      font-weight: 600;
    `}
`;

const TitleTd = styled.td`
  cursor: pointer;
`;

const postCate: StringProps = {
  notice: '공지',
  data: '자료',
  result: '취합',
  etc: '자유',
};

interface ArticleProps {
  post: BoardDetailDataProps;
  idx: string;
  type: string;
}

const Article = ({ post, idx, type }: ArticleProps) => {
  const navigate = useNavigate();
  console.log(post);
  const { category, author, createdAt, views, title } = post;

  const onClick = () => {
    navigate(process.env.PUBLIC_URL + `/${type}Board/${post._id}`);
  };

  return (
    <Tr>
      <Td>{idx}</Td>
      <Td accent={category}>{postCate[category]}</Td>
      <Td>{author.substr(0, 6)}</Td>
      <TitleTd onClick={onClick}>{title}</TitleTd>
      <Td>{createdAt.substr(0, 16).replace('T', ' ')}</Td>
      <Td>{views}</Td>
    </Tr>
  );
};

export default Article;
