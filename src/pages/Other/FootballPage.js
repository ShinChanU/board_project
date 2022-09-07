import axios from 'axios';
import React, { useState } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import ReactPlayer from 'react-player/lazy';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-content: center;

  > button {
    width: 200px;
    font-size: 25px;
    padding: 5px 10px;
    border-radius: 5px;
    background: white;
    border: none;
    margin: 10px auto;
    cursor: pointer;
    :hover {
      background: black;
      color: white;
      transition: 0.2s all linear;
    }
  }
`;

const Loading = styled.div`
  text-align: center;
`;

const VideoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: 1000px) {
    display: block;
  }
`;

const Video = styled.div`
  margin: 20px;

  > div {
  }
`;

const FootballPage = () => {
  const [loading, setLoading] = useState(false);
  const [broadcastData, setBroadcastData] = useState(null);

  const getSportsData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/football/nowMatch');
      if (res.data) {
        setBroadcastData(res.data.data);
      } else {
        console.log('heor');
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Container>
      <button onClick={getSportsData}>채널 불러오기</button>
      {loading && <Loading>로딩중입니다... 약 20초 소요</Loading>}
      {broadcastData && (
        <VideoContainer>
          {broadcastData.links.map((e, i) => (
            <Video>
              <div>{broadcastData.names[i]}</div>
              <ReactPlayer url={e} controls={true} width="100%" height="auto" />
            </Video>
          ))}
        </VideoContainer>
      )}
    </Container>
  );
};

export default FootballPage;
