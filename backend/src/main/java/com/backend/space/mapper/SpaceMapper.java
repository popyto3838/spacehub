package com.backend.space.mapper;

import com.backend.space.domain.Space;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface SpaceMapper {

    @Insert("""
            INSERT INTO SPACE
            (       HOST_ID
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
        (           1
        ,           #{typeId}
        ,           #{title}
        ,           #{subTitle}
        ,           #{zonecode}
        ,           #{address}
        ,           #{detailAddress}
        ,           #{extraAddress}
        ,           #{latitude}
        ,           #{longitude}
        ,           #{introduce}
        ,           #{facility}
        ,           #{notice}
        ,           #{price}
        ,           #{capacity}
        ,           #{floor}
        ,           #{parkingSpace})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "spaceId")
    int insert(Space space);
}
