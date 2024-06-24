package com.backend.space.mapper;

import com.backend.space.domain.Space;
import com.backend.space.domain.FindResponseSpaceJoinDTO;
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
            SELECT  S.*
            ,       T.*
            FROM SPACE S
            JOIN TYPE_LIST T ON S.TYPE_LIST_ID = T.TYPE_LIST_ID
            WHERE S.SPACE_ID = #{spaceId}
            """)
    FindResponseSpaceJoinDTO selectBySpaceId(Integer spaceId);
}
