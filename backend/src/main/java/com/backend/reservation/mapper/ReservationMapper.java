package com.backend.reservation.mapper;

import com.backend.reservation.domain.Reservation;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ReservationMapper {

    @Insert("""
                    INSERT INTO RESERVATION 
                    (       SPACE_ID
                    ,       MEMBER_ID
                    ,       START_DATE
                    ,       END_DATE
                    ,       START_TIME
                    ,       END_TIME
                    ,       STATUS
                    ) VALUES 
                    (       #{spaceId}
                    ,       #{memberId}
                    ,       #{startDate}
                    ,       #{endDate}
                    ,       #{startTime}
                    ,       #{endTime}
                    ,       #{status}
                    )
            """)
    @Options(useGeneratedKeys = true, keyProperty = "reservationId")
    int insert(Reservation reservation);


    @Select("""
            SELECT *
            FROM RESERVATION
            """)
    List<Reservation> selectAll();


    @Select("""
            SELECT *
            FROM RESERVATION
            WHERE RESERVATION_ID = #{reservationId}
            """)
    Reservation selectByReservationId(Integer reservationId);

    @Update("""
            UPDATE RESERVATION 
            SET     START_DATE      = #{startDate}
            ,       END_DATE        = #{endDate}
            ,       START_TIME      = #{startTime}
            ,       END_TIME        = #{endTime}
            ,       UPDATE_DT       = CURRENT_TIMESTAMP
            WHERE   RESERVATION_ID  = #{reservationId}
            """)
    int update(Reservation reservation);


    @Delete("""
            DELETE  FROM 
            RESERVATION WHERE RESERVATION_ID = #{reservationId}
            """)
    int deleteByReservationId(Integer reservationId);

    @Update("""
            UPDATE RESERVATION 
            SET     STATUS          = 'COMPLETE_PAYMENT'
            ,       UPDATE_DT       = CURRENT_TIMESTAMP
            WHERE   RESERVATION_ID  = #{reservationId}
            """)
    int completePament(Integer reservationId);
}
