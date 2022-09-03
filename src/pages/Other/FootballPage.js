import React from 'react';
import ReactHlsPlayer from 'react-hls-player';

const FootballPage = () => {
  return (
    <>
      ch1
      <ReactHlsPlayer
        src="https://ch06-livecdn.spotvnow.co.kr/ch06/spt06.smil/chunklist_b3692000.m3u8"
        autoPlay={false}
        controls={true}
        width="auto%"
        height="500px"
      />
      ch1
      <ReactHlsPlayer
        src="https://ch14-livecdn.spotvnow.co.kr/ch14/ch14.smil/chunklist_b3692000.m3u8"
        autoPlay={false}
        controls={true}
        width="auto%"
        height="500px"
      />
      ch2
      <ReactHlsPlayer
        src="https://ch13-livecdn.spotvnow.co.kr/ch13/ch13.smil/chunklist_b3692000.m3u8"
        autoPlay={false}
        controls={true}
        width="auto%"
        height="500px"
      />{' '}
    </>
  );
};

export default FootballPage;
