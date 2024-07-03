// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import "/public/css/component/DatePicker.css";
import axios from "axios";
import { LoginContext } from "./LoginProvider.jsx";
import { Button, useToast } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

const Calendar = (props) => {
  const account = useContext(LoginContext);
  const toast = useToast();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentDate, setCurrentDate] = useState(today);
  const [reservations, setReservations] = useState([]);
  const [selectedHours, setSelectedHours] = useState([]);
  const { spaceId } = useParams();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`/api/reservation/listAll/${spaceId}`);
      console.log(response.data);
      const formattedReservations = response.data.map((reservation) => ({
        ...reservation,
        startDate: new Date(reservation.startDate),
        endDate: new Date(reservation.endDate),
        startTime: reservation.startTime.substring(0, 5), // "HH:MM" 형식으로 변
        endTime: reservation.endTime.substring(0, 5), // "HH:MM" 형식으로 변경
      }));
      setReservations(formattedReservations);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
    );
  };

  const handleDateClick = (date) => {
    const selectedDateObj = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date,
    );
    setSelectedDate(selectedDateObj);

    const year = selectedDateObj.getFullYear();
    const month = selectedDateObj.getMonth() + 1;
    const day = selectedDateObj.getDate();

    console.log(`선택한 날짜: ${year}년 ${month}월 ${day}일`);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`prev-${i}`} className="calendar-day empty"></div>,
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = selectedDate
        ? i === selectedDate.getDate() &&
          month === selectedDate.getMonth() &&
          year === selectedDate.getFullYear()
        : i === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear();
      const isToday =
        year === today.getFullYear() &&
        month === today.getMonth() &&
        i === today.getDate();
      const isPast = new Date(year, month, i) < today;

      calendarDays.push(
        <div
          key={`curr-${i}`}
          className={`calendar-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""} ${isPast ? "past" : ""}`}
          onClick={() => {
            if (!isPast) {
              handleDateClick(i);
            }
          }}
        >
          {i}
        </div>,
      );
    }

    const remainingDays = 42 - (firstDay + daysInMonth);
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push(
        <div key={`next-${i}`} className="calendar-day empty"></div>,
      );
    }

    return calendarDays;
  };

  const handleHourChange = (hour) => {
    if (selectedHours.includes(hour)) {
      const newSelectedHours = selectedHours.filter((h) => h !== hour);
      if (
        newSelectedHours.length === 0 ||
        areHoursContinuous(newSelectedHours)
      ) {
        setSelectedHours(newSelectedHours);
      } else {
        toast({
          status: "error",
          description: "연속된 시간만 선택 가능합니다.",
          position: "top",
          duration: 1000,
        });
      }
    } else {
      const newSelectedHours = [...selectedHours, hour].sort((a, b) => a - b);
      if (areHoursContinuous(newSelectedHours)) {
        setSelectedHours(newSelectedHours);
      } else {
        toast({
          status: "error",
          description: "연속된 시간만 선택 가능합니다.",
          position: "top",
          duration: 1000,
        });
      }
    }
  };

  const areHoursContinuous = (hours) => {
    if (hours.length <= 1) return true;
    hours.sort((a, b) => a - b);
    for (let i = 1; i < hours.length; i++) {
      if (hours[i] - hours[i - 1] !== 1) return false;
    }
    return true;
  };
  const isTimeSlotReserved = (date, hour) => {
    return reservations.some((reservation) => {
      const reservationStartDate = new Date(reservation.startDate);
      const selectedDate = new Date(date);

      const isSameDate =
        selectedDate.getFullYear() === reservationStartDate.getFullYear() &&
        selectedDate.getMonth() === reservationStartDate.getMonth() &&
        selectedDate.getDate() === reservationStartDate.getDate();

      if (!isSameDate) return false;

      const reservationStartHour = parseInt(
        reservation.startTime.split(":")[0],
      );
      const reservationEndHour = parseInt(reservation.endTime.split(":")[0]);
      return hour >= reservationStartHour && hour <= reservationEndHour;
    });
  };

  const renderHourCheckboxes = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return hours.map((hour) => {
      const isReserved = isTimeSlotReserved(selectedDate, hour);

      return (
        <button
          key={hour}
          className={`hour-button ${selectedHours.includes(hour) ? "selected" : ""} ${isReserved ? "reserved" : ""}`}
          onClick={() => handleHourChange(hour)}
          disabled={isReserved}
        >
          {hour < 10 ? `0${hour}:00` : `${hour}:00`}
        </button>
      );
    });
  };

  const handleReservation = () => {
    if (selectedDate && selectedHours.length >= 2) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const startHour = String(selectedHours[0]).padStart(2, "0");
      const endHour = String(selectedHours[selectedHours.length - 1]).padStart(
        2,
        "0",
      );
      const startTime = `${startHour}:00`;
      const endTime = `${endHour}:00`;
      const totalPrice = props.price * selectedHours.length;

      axios
        .post("/api/reservation/write", {
          spaceId: props.spaceId,
          memberId: account.id,
          startDate: formattedDate,
          endDate: formattedDate,
          startTime: startTime,
          endTime: endTime,
          totalPrice: totalPrice, // totalPrice 추가
        })
        .then((res) => {
          toast({
            status: "success",
            description: "예약을 신청하였습니다.",
            position: "top",
            duration: 1000,
          });
          navigate("/member/myReservationList/" + account.id);
        })
        .catch((error) => {
          toast({
            status: "error",
            description: "예약을 실패하였습니다.",
            position: "top",
            duration: 1000,
          });
        });
    } else {
      toast({
        status: "error",
        description: "최소 2시간 이상 선택해야 합니다.",
        position: "top",
        duration: 1000,
      });
    }
  };

  const totalPrice = (props.price * selectedHours.length)?.toLocaleString();

  return (
    <div>
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="prev-month" onClick={handlePrevMonth}>
            &lt;
          </button>
          <div className="current-date">
            {currentDate.getFullYear()}년 {months[currentDate.getMonth()]}
          </div>
          <button className="next-month" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>
        <div className="calendar-body">
          <div className="weekdays">
            {weekdays.map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar-days">{renderCalendar()}</div>
        </div>
        <div className="hour-button-container">{renderHourCheckboxes()}</div>
      </div>
      <div className="priceArea">
        <p className="totalPrice">₩ {totalPrice}</p>
      </div>
      <div className="buttonArea">
        <Button
          className="reservationBtn"
          colorScheme="purple"
          onClick={handleReservation}
          height="60px"
        >
          예약하기
        </Button>
      </div>
    </div>
  );
};

export default Calendar;
