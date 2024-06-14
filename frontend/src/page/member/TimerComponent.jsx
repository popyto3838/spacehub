
import React, { useState, useEffect } from 'react';
import {Box} from "@chakra-ui/react";

const TimerComponent = ({ expirationTime }) => {
  const calculateTimeLeft = () => {
    const difference = expirationTime - Date.now();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expirationTime]);

  return (
    <div>
      {timeLeft.minutes !== undefined ? (
        <Box>
          남은 시간: {timeLeft.minutes}분 {timeLeft.seconds}초
        </Box>
      ) : (
        <p>인증 시간이 만료되었습니다.</p>
      )}
    </div>
  );
};

export default TimerComponent;