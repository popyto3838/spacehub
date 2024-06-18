package com.backend.paid.mapper;

import com.backend.paid.domain.Paid;
import com.backend.reservation.domain.Reservation;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PaidMapper {

    @Insert("""
                INSERT INTO PAID
                (       SPACE_ID
                ,       RESERVATION_ID
                ,       MEMBER_ID
                ,       TOTAL_PRICE
                ) VALUES
                (       #{spaceId}
                ,       #{reservationId}
                ,       #{memberId}
                ,       #{totalPrice}
                )
        """)
    int insert(Paid paid);

    @Select("""
                SELECT *
                FROM PAID
        """)
    List<Paid> selectAll();

    @Select("""
                SELECT *
                FROM PAID
                WHERE PAID_ID = #{paidId}
        """)
    Paid selectByPaidId(@Param("paidId") Integer paidId);

    @Update("""
                UPDATE PAID
                SET     TOTAL_PRICE = #{totalPrice}
                ,       UPDATE_DT   = CURRENT_TIMESTAMP
                WHERE   PAID_ID     = #{paidId}
        """)
    int update(Paid paid);

    @Delete("""
                DELETE
                FROM PAID
                WHERE PAID_ID = #{paidId}
        """)
    int deleteByPaidId(@Param("paidId") Integer paidId);
}
