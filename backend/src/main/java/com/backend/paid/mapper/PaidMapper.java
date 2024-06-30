package com.backend.paid.mapper;

import com.backend.paid.domain.Paid;
import com.backend.paid.domain.PaymentCancelRequestDTO;
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
                    ,       IMP_UID
                    ,       STATUS
                    ) VALUES
                    (       #{spaceId}
                    ,       #{reservationId}
                    ,       #{memberId}
                    ,       #{totalPrice}
                    ,       #{impUid}
                    ,       #{status}
                    )
            """)
    int insert(Paid paid);

    @Select("""
                    SELECT  P.*
                    ,       S.TITLE
                    FROM PAID P
                    LEFT JOIN SPACE S ON S.SPACE_ID = P.SPACE_ID
                    WHERE P.MEMBER_ID = #{memberId}
                    
            """)
    List<Paid> selectAllByMemberId(Integer memberId);

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

    @Update("""
                    UPDATE PAID
                    SET     STATUS      = #{status}
                    ,       UPDATE_DT   = CURRENT_TIMESTAMP
                    WHERE   PAID_ID     = #{paidId}
            """)
    int paymentRefund(PaymentCancelRequestDTO refundDTO);
}
