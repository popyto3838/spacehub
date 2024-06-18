import React, { useEffect } from 'react';
const { kakao } = window;

const KakaoMap = ({ address }) => {
  useEffect(() => {
    const container = document.getElementById('map'); // 지도를 담은 영역의 DOM 레퍼런스
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 초기 지도 중심 좌표
      level: 3, // 초기 지도 확대 레벨
    };
    const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 관리

    const geocoder = new kakao.maps.services.Geocoder();

    // 마커 생성
    const marker = new kakao.maps.Marker({
      map: map,
      position: options.center,
    });

    const updateMap = (address) => {
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          map.setCenter(coords);
          marker.setPosition(coords); // 마커 위치 변경
        }
      });
    };

    // 초기 주소 설정
    if (address) {
      updateMap(address);
    }

    // 주소 변경 이벤트 리스너
    const handleUpdateMap = (event) => {
      updateMap(event.detail);
    };

    window.addEventListener('updateMap', handleUpdateMap);

    // 클린업 이벤트 리스너
    return () => {
      window.removeEventListener('updateMap', handleUpdateMap);
    };
  }, [address]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default KakaoMap;
