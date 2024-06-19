import React, { useEffect, useRef } from 'react';

const { kakao } = window;

const KakaoMap = ({ address, latitude, longitude }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 초기 지도 중심 좌표 (필요에 따라 변경)
        level: 3, // 초기 지도 확대 레벨
      };
      const map = new kakao.maps.Map(container, options);
      mapRef.current = map;

      // 마커 생성
      const markerPosition = new kakao.maps.LatLng(33.450701, 126.570667); // 마커를 표시할 위치
      const marker = new kakao.maps.Marker({
        position: markerPosition
      });
      marker.setMap(map);
      markerRef.current = marker;
    }
  }, []);

  useEffect(() => {
    if (!address) {
      // 주소가 없을 때는 마커를 숨깁니다.
      markerRef.current.setMap(null);
      return;
    }

    // 주소 또는 좌표가 있을 때만 마커를 표시하고 지도 중심을 설정합니다.
    if (latitude && longitude) {
      const coords = new kakao.maps.LatLng(latitude, longitude);
      mapRef.current.setCenter(coords);
      markerRef.current.setPosition(coords); // 마커 위치 변경
      markerRef.current.setMap(mapRef.current); // 마커 다시 표시
    } else {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          mapRef.current.setCenter(coords);
          markerRef.current.setPosition(coords); // 마커 위치 변경
          markerRef.current.setMap(mapRef.current); // 마커 다시 표시
        }
      });
    }
  }, [address, latitude, longitude]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default KakaoMap;
