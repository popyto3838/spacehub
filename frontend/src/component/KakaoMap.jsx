// src/components/KakaoMap.js
import React, {useEffect} from 'react';

/*
스크립트로 kakao maps api를 심어서 가져오면 window전역 객체에 들어가게 됩니다.
그런데 함수형 컴포넌트에서는 이를 바로 인식하지 못한다고 합니다.
그렇기 때문에 코드 상단에 const { kakao } = window를 작성하여 함수형 컴포넌트에 인지 시키고 window에서 kakao객체를 뽑아서 사용
*/
const {kakao} = window;

const KakaoMap = () => {

  useEffect(() => {
    const container = document.getElementById('map'); // 지도를 담은 영역의 DOM 레퍼런스
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3
    };
    const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 관리
  }, []);

  return <div id="map" style={{width: '500px', height: '400px'}}></div>;
};

export default KakaoMap;
