import styled from 'styled-components';
import oc from 'open-color';
import { postStore } from 'lib/zustand/postStore';
// import { postStore } from 'lib/zustand/postStore.js';

const Container = styled.div`
  max-width: 1300px;
  width: 100%;
  margin: 20px auto;
  padding: 0px 20px;
`;

const FlexBox = styled.div`
  width: 100%;
  background: ${oc.indigo[0]};
  border-radius: 10px;
  box-shadow: 2px 2px 2px 2px ${oc.indigo[3]};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 30px;
`;

const FlexHeader = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  justify-content: center;
  button {
    position: absolute;
    top: 0;
    right: 0;
    background: ${oc.indigo[5]};
    color: white;
    border: none;
    border-radius: 5px;
    margin-bottom: 20px;
    width: 120px;
    font-size: 17px;
    font-weight: 550;
    padding: 10px 0px;
    cursor: pointer;
  }
`;

const Header = styled.h1`
  margin: 0;
  margin-bottom: 20px;
`;

const BoardTemplate = ({
  children,
  type,
  isWrite,
  onChangeWrite,
  user,
}: any) => {
  const { postCate } = postStore();

  return (
    <Container>
      <FlexBox>
        <FlexHeader>
          <Header>{postCate[type]}</Header>
          {/* 글쓰기 권한 */}
          {user && (
            <>
              {user.userType === 'admin' && (
                <button onClick={onChangeWrite}>
                  {isWrite ? '목록' : '글쓰기'}
                </button>
              )}
              {user.userType === 'top' && type !== 'notice' && (
                <button onClick={onChangeWrite}>
                  {isWrite ? '목록' : '글쓰기'}
                </button>
              )}
              {user.userType === 'user' && type === 'etc' && (
                <button onClick={onChangeWrite}>
                  {isWrite ? '목록' : '글쓰기'}
                </button>
              )}
            </>
          )}
        </FlexHeader>
        {children}
      </FlexBox>
    </Container>
  );
};

export default BoardTemplate;
