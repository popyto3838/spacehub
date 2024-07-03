import React, { useCallback, useEffect } from "react";

function KakaoShareButton({ spaceDetails, children, templateId }) {
  const shareKakao = useCallback(() => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init("87ba8faefcb592f218d770d1aeda4585"); // 실제 JavaScript 키로 변경
      }

      const currentUrl = window.location.href; // 현재 페이지 URL

      window.Kakao.Share.sendCustom({
        templateId: templateId,
        templateArgs: {
          title: spaceDetails.title,
          description: spaceDetails.subTitle,
          imageUrl:
            spaceDetails.images && spaceDetails.images.length > 0
              ? spaceDetails.images[0]
              : "",
          link: currentUrl, // 현재 페이지 URL을 link로 사용
          pageUrl: `${spaceDetails.spaceId}`, // 카카오 템플릿에서 사용할 수 있는 추가 URL 파라미터
        },
      });
    }
  }, [spaceDetails, templateId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.integrity =
      "sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4";
    script.crossOrigin = "anonymous";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div onClick={shareKakao}>{children}</div>;
}

export default KakaoShareButton;
