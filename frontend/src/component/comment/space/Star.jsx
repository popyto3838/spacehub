import { useState } from "react";
import { HStack, Image, Text } from "@chakra-ui/react";

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
    <HStack spacing={2} align="center">
      {[1, 2, 3, 4, 5].map((starNumber) => (
        <Image
          key={starNumber}
          w={8}
          h={8}
          onClick={() => clickStar(starNumber)}
          src={`${s3BaseUrl}/ic-star-${icList[eval(`star${starNumber}`).toString()]}.png`}
          alt={`star ${starNumber}`}
          cursor="pointer"
          _hover={{ transform: "scale(1.1)" }}
          transition="transform 0.2s"
        />
      ))}
      <Text fontSize="lg" fontWeight="bold" ml={2}>
        {rateScore}점
      </Text>
    </HStack>
  );
}
