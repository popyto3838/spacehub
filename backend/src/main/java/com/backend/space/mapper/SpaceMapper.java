package com.backend.space.mapper;

import com.backend.dto.OptionListDTO;
import com.backend.space.domain.FindResponseSpaceMemberIdDto;
import com.backend.space.domain.Space;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SpaceMapper {

    @Insert("""
            INSERT INTO SPACE
            (       MEMBER_ID
            ,       TYPE_LIST_ID
            ,       TITLE
            ,       SUB_TITLE
            ,       ZONECODE
            ,       ADDRESS
            ,       DETAIL_ADDRESS
            ,       EXTRA_ADDRESS
            ,       LATITUDE
            ,       LONGITUDE
            ,       INTRODUCE
            ,       FACILITY
            ,       NOTICE
            ,       PRICE
            ,       CAPACITY
            ,       FLOOR
            ,       PARKING_SPACE)
            VALUES
            (       #{memberId}
            ,       #{typeListId}
            ,       #{title}
            ,       #{subTitle}
            ,       #{zonecode}
            ,       #{address}
            ,       #{detailAddress}
            ,       #{extraAddress}
            ,       #{latitude}
            ,       #{longitude}
            ,       #{introduce}
            ,       #{facility}
            ,       #{notice}
            ,       #{price}
            ,       #{capacity}
            ,       #{floor}
            ,       #{parkingSpace})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "spaceId")
    int insert(Space space);

    @Select("""
            SELECT *
            FROM SPACE
            ORDER BY SPACE_ID DESC
            """)
    List<Space> selectAll();

    @Select("""
            SELECT * 
            FROM SPACE 
            WHERE SPACE_ID = #{spaceId}
            """)
    Space selectBySpaceId(Integer spaceId);

    @Insert("""
            INSERT INTO SPACE_CONFIG
            (SPACE_ID, OPTION_ID)
            VALUES 
            (#{spaceId}, #{optionId})
            """)
    int insertSpaceConfig(int spaceId, Integer optionId);

    @Select("""
            SELECT O.OPTION_LIST_ID, O.NAME, O.IS_ACTIVE, F.FILE_NAME
            FROM OPTION_LIST O
            INNER JOIN SPACE_CONFIG SC ON O.OPTION_LIST_ID = SC.OPTION_ID
            LEFT JOIN FILE F ON O.OPTION_LIST_ID = F.PARENT_ID AND F.DIVISION = 'OPTION'
            WHERE SC.SPACE_ID = #{spaceId}
            """)
    List<OptionListDTO> selectOptionListBySpaceId(Integer spaceId);

    @Select("""
            SELECT  *
            FROM SPACE
            WHERE MEMBER_ID = #{memberId}
            """)
    List<FindResponseSpaceMemberIdDto> selectAllByMemberId(Integer memberId);

    @Update("""
            UPDATE SPACE
            SET MEMBER_ID = #{space.memberId},
                TYPE_LIST_ID = #{space.typeListId},
                TITLE = #{space.title},
                SUB_TITLE = #{space.subTitle},
                ZONECODE = #{space.zonecode},
                ADDRESS = #{space.address},
                DETAIL_ADDRESS = #{space.detailAddress},
                EXTRA_ADDRESS = #{space.extraAddress},
                LATITUDE = #{space.latitude},
                LONGITUDE = #{space.longitude},
                INTRODUCE = #{space.introduce},
                FACILITY = #{space.facility},
                NOTICE = #{space.notice},
                PRICE = #{space.price},
                CAPACITY = #{space.capacity},
                FLOOR = #{space.floor},
                PARKING_SPACE = #{space.parkingSpace}
            WHERE SPACE_ID = #{spaceId}
            """)
    int updateSpace(Integer spaceId, Space space);

    @Delete("""
            DELETE FROM SPACE_CONFIG
            WHERE SPACE_ID = #{spaceId}
            """)
    int deleteSpaceConfigBySpaceId(Integer spaceId);
}
