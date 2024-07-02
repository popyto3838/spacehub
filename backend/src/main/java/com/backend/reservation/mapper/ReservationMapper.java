package com.backend.reservation.mapper;

import com.backend.reservation.domain.FindResponseHostReservationList;
import com.backend.reservation.domain.FindResponseReservationListDTO;
import com.backend.reservation.domain.Reservation;
import com.backend.reservation.domain.UpdateStatusRequestDTO;
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
                    ,       TOTAL_PRICE
                    ) VALUES 
                    (       #{spaceId}
                    ,       #{memberId}
                    ,       #{startDate}
                    ,       #{endDate}
                    ,       #{startTime}
                    ,       #{endTime}
                    ,       #{status}
                    ,       #{totalPrice}
                    )
            """)
    @Options(useGeneratedKeys = true, keyProperty = "reservationId")
    int insert(Reservation reservation);

    @Select("""
            SELECT  *
            FROM    RESERVATION
            WHERE   SPACE_ID=#{spaceId}
            """)
    List<Reservation> selectAll(Integer spaceId);


    @Select("""
            SELECT  R.*
            ,       S.TITLE
            ,       S.ADDRESS
            FROM    RESERVATION R
            LEFT JOIN SPACE S ON R.SPACE_ID = S.SPACE_ID
            WHERE   R.MEMBER_ID = #{memberId}
            """)
    List<FindResponseReservationListDTO> selectAllByMemberId(Integer memberId);

    @Select("""
            SELECT  R.*
            ,       S.TITLE
            ,       M.NICKNAME
            FROM    RESERVATION R
            JOIN    MEMBER M ON M.MEMBER_ID = R.MEMBER_ID
            JOIN    SPACE S ON S.SPACE_ID = R.SPACE_ID
            WHERE   R.SPACE_ID = #{spaceId}
            """)
    List<FindResponseHostReservationList> selectAllBySpaceId(Integer spaceId);


    @Select("""
            SELECT *
            FROM RESERVATION
            WHERE RESERVATION_ID = #{reservationId}
            """)
    Reservation selectByReservationId(Integer reservationId);

    @Update("""
            UPDATE RESERVATION 
            SET     TOTAL_PRICE     = #{totalPrice}
            ,       START_DATE      = #{startDate}
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


    @Update("""
            UPDATE RESERVATION 
            SET     STATUS          = #{status}
            ,       UPDATE_DT       = CURRENT_TIMESTAMP
            WHERE   RESERVATION_ID  = #{reservationId}
            """)
    int updateStatus(UpdateStatusRequestDTO requestDTO);

}
