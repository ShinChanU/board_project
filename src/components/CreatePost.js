import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 70%;
  font-size: 30px;
  display: flex;
  flex-direction: column;
`;
const Div = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0px;
`;

const Input = styled.input`
  font-size: 20px;
  width: 50%;
`;

const TextArea = styled.textarea`
  font-size: 20px;
  width: 50%;
`;

const Button = styled.button`
  font-size: 40px;
  border-radius: 20px;
  cursor: pointer;
`;

const CreatePost = ({ createPostData, data, open }) => {
  const [input, setInput] = useState({
    title: '',
    contents: '',
  });
  const [status, setStatus] = useState('new');

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (data !== null) {
      const { title, contents } = data;
      setInput({
        title,
        contents,
      });
      setStatus('update');
    } else {
      setInput({
        title: '',
        contents: '',
      });
      setStatus('new');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Div>
        <div>제목</div>
        <Input name="title" value={input.title} onChange={onChange} />
      </Div>
      <Div>
        자세한 내용
        <TextArea name="contents" value={input.contents} onChange={onChange} />
      </Div>
      <Button onClick={() => createPostData(input, data)}>
        {status === 'update' ? '수정' : '저장'}
      </Button>
    </Container>
  );
};

export default CreatePost;
