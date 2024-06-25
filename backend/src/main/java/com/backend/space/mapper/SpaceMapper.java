package com.backend.space.mapper;

import com.backend.space.domain.Space;
import com.backend.dto.OptionListDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

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
            SELECT O.OPTION_LIST_ID, O.NAME, F.FILE_NAME
                    FROM OPTION_LIST O
                    LEFT JOIN FILE F ON O.OPTION_LIST_ID = F.PARENT_ID AND F.DIVISION = 'OPTION'
                    WHERE O.OPTION_LIST_ID IN (
                        SELECT OPTION_LIST_ID
                        FROM SPACE_CONFIG
                        WHERE SPACE_ID = #{spaceId}
                    )
            """)
    List<OptionListDTO> selectOptionListBySpaceId(Integer spaceId);
}
