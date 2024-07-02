import { useState } from "react";
import { Box, Image, Wrap, WrapItem } from "@chakra-ui/react";

export function Star({ setRateScore, rateScore }) {
  // 별점
  const [star1, setStar1] = useState(false);
  const [star2, setStar2] = useState(false);
  const [star3, setStar3] = useState(false);
  const [star4, setStar4] = useState(false);
  const [star5, setStar5] = useState(false);

  const icList = {
    true: "on",
    false: "off",
  };

  // aws 설정
  const s3BaseUrl = "https://studysanta.s3.ap-northeast-2.amazonaws.com/prj3";

  const clickStar = (starScore) => {
    if (starScore === 1) {
      setRateScore(1);
      setStar1(true);
      setStar2(false);
      setStar3(false);
      setStar4(false);
      setStar5(false);
    } else if (starScore === 2) {
      setRateScore(2);
      setStar1(true);
      setStar2(true);
      setStar3(false);
      setStar4(false);
      setStar5(false);
    } else if (starScore === 3) {
      setRateScore(3);
      setStar1(true);
      setStar2(true);
      setStar3(true);
      setStar4(false);
      setStar5(false);
    } else if (starScore === 4) {
      setRateScore(4);
      setStar1(true);
      setStar2(true);
      setStar3(true);
      setStar4(true);
      setStar5(false);
    } else if (starScore === 5) {
      setRateScore(5);
      setStar1(true);
      setStar2(true);
      setStar3(true);
      setStar4(true);
      setStar5(true);
    }
  };

  return (
    <Wrap>
      <WrapItem>
        <Image
          w={10}
          onClick={() => clickStar(1)}
          className={"star"}
          src={`${s3BaseUrl}/ic-star-${icList[star1.toString()]}.png`}
          alt={"star"}
          cursor={"pointer"}
        />
      </WrapItem>
      <WrapItem>
        <Image
          w={10}
          onClick={() => clickStar(2)}
          className={"star"}
          src={`${s3BaseUrl}/ic-star-${icList[star2.toString()]}.png`}
          alt={"star"}
          cursor={"pointer"}
        />
      </WrapItem>
      <WrapItem>
        <Image
          w={10}
          onClick={() => clickStar(3)}
          className={"star"}
          src={`${s3BaseUrl}/ic-star-${icList[star3.toString()]}.png`}
          alt={"star"}
          cursor={"pointer"}
        />
      </WrapItem>
      <WrapItem>
        <Image
          w={10}
          onClick={() => clickStar(4)}
          className={"star"}
          src={`${s3BaseUrl}/ic-star-${icList[star4.toString()]}.png`}
          alt={"star"}
          cursor={"pointer"}
        />
      </WrapItem>
      <WrapItem>
        <Image
          w={10}
          onClick={() => clickStar(5)}
          className={"star"}
          src={`${s3BaseUrl}/ic-star-${icList[star5.toString()]}.png`}
          alt={"star"}
          cursor={"pointer"}
        />
      </WrapItem>
      <WrapItem>
        <Box>{rateScore}점</Box>
      </WrapItem>
    </Wrap>
  );
}
