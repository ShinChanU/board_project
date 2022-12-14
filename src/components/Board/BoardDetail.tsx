import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  BoardDetailDataProps,
  BoardUserTypeProps,
} from 'interfaces/Board.interface';
import { postStore } from 'lib/zustand/postStore';
import BoardTemplate from './BoardTemplate';
import oc from 'open-color';
import * as XLSX from 'xlsx';
import WriteBoard from './WriteBoard';

const Container = styled.div`
  width: 100%;
  background: white;
  border: 2px solid ${oc.indigo[1]};
  border-radius: 10px;

  margin: 20px 0px;
  > div {
    padding: 0px 40px;
  }
`;

const Title = styled.div`
  margin: 20px 0px;
  font-size: 24px;
  font-weight: 550;
  text-align: center;
`;

const Sub = styled.div`
  font-weight: 400;
  font-size: 13px;
  width: 100%;
  padding: 0px 40px;
  margin: 20px 0px;

  div {
    width: auto;
  }
  span {
    font-weight: 550;
  }
`;

const Body = styled.div`
  width: 100%;
  background: ${oc.indigo[1]};
  margin: 20px 0px;

  > div {
    padding: 20px 20px;
    width: 100%;
    overflow: auto;
  }
`;

const Files = styled.div`
  width: 100%;
  font-size: 20px;
  margin-bottom: 20px;

  button {
    padding: 5px 10px;
    border-radius: 10px;
    background: none;
    font-size: 15px;
    margin-top: 10px;
    cursor: pointer;
    border: 2px solid ${oc.gray[5]};
    :hover {
      background: ${oc.indigo[7]};
      color: white;
      border-color: ${oc.indigo[7]};
      transition: 0.1s linear;
    }
    :active {
      transform: translateY(5px);
    }
  }
`;

const FlexDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const Button = styled.button<any>`
  background: ${oc.indigo[5]};
  color: white;
  border: none;
  border-radius: 5px;
  width: 100px;
  font-size: 17px;
  font-weight: 550;
  padding: 10px 0px;
  margin-left: 10px;
  cursor: pointer;
`;

const BoardDetail = ({ user, type }: BoardUserTypeProps) => {
  const { id } = useParams();
  const { getDetailPost, removePost, postPosts } = postStore();
  const [post, setPost] = useState<BoardDetailDataProps | null>(null);
  const [isWrite, setIsWrite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      (async () => {
        let res = await getDetailPost('notice', id);
        setPost(res);
      })();
    }
  }, [getDetailPost, id, isWrite]);

  const downLoadFile = async (fileName: string, fileId: string) => {
    let res;
    if (fileName === fileId) {
      let resultDate;
      let [year, monCycle] = fileName.split(' ')[0].split('???_');
      let secDate;
      if (monCycle.includes('???')) {
        secDate = monCycle.split('???')[0];
        resultDate = `${year}_${secDate}-mon`;
      }
      res = await axios.get(`/posts/download/result/${resultDate}`);
    } else {
      res = await axios.get(`/posts/download/${fileId}`);
    }
    if (res) {
      if (res.status === 200) {
        const worksheet = XLSX.utils.json_to_sheet(res.data.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}`);
      } else {
        alert('?????? ????????? ??????????????????.');
      }
    } else {
      console.log('res??????');
    }
  };

  const onClickDelPost = async () => {
    if (id) {
      let res = await removePost(type, id);
      if (res) {
        alert('???????????? ?????????????????????.');
        navigate(-1);
      } else {
        alert('?????? ??????!');
      }
    } else alert('???????????? id??? ????????????.');
  };

  const onChangeWrite = () => {
    setIsWrite(!isWrite);
  };

  const delSaveFile = (i: number) => {
    if (post) {
      let tmpOrgNames = post.orgFileName.slice();
      let tmpSaveNames = post.saveFileName.slice();
      tmpOrgNames.splice(i, 1);
      tmpSaveNames.splice(i, 1);
      setPost({
        ...post,
        orgFileName: tmpOrgNames,
        saveFileName: tmpSaveNames,
      });
    }
  };

  return (
    <BoardTemplate type={type}>
      {isWrite && (
        <WriteBoard
          close={onChangeWrite}
          postPosts={postPosts}
          user={user}
          id={post?._id}
          postData={post}
          deleteFile={delSaveFile}
        />
      )}
      {!isWrite && post && (
        <Container>
          <Title>{post.title}</Title>
          <Sub>
            <div>
              <span>?????????</span> {post.author}
            </div>
            {post.author !== 'admin' && (
              <div>
                <span>????????????</span> {post.companyCode}
              </div>
            )}
            <div>
              <span>?????????</span>
              {post.createdAt.substr(0, 16).replace('T', ' ')}
            </div>
            {post.updatedAt && (
              <div>
                <span>?????? ?????????</span>
                {post.updatedAt.substr(0, 16).replace('T', ' ')}
              </div>
            )}
            <div>
              <span>?????????</span> {post.views}
            </div>
          </Sub>
          {post.body && (
            <Body>
              <div dangerouslySetInnerHTML={{ __html: post.body }} />
            </Body>
          )}
          {!!post.orgFileName.length && (
            <Files>
              ????????????(????????????)
              {post.orgFileName.map((file, i) => (
                <div key={i}>
                  <button
                    onClick={() => downLoadFile(file, post.saveFileName[i])}
                  >
                    ???? {file}
                  </button>
                </div>
              ))}
            </Files>
          )}
        </Container>
      )}
      {!post && <>Loading...</>}
      {!isWrite && post && (
        <FlexDiv>
          {post.author === user?.username && (
            <Button onClick={onChangeWrite}>????????????</Button>
          )}
          {(post.author === user?.username || user?.username === 'admin') && (
            <Button del onClick={onClickDelPost}>
              ????????????
            </Button>
          )}
        </FlexDiv>
      )}
    </BoardTemplate>
  );
};

export default BoardDetail;
