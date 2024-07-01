package com.backend.favorites.mapper;

import com.backend.favorites.domain.Favorites;
import org.apache.ibatis.annotations.*;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.List;

@Mapper
public interface FavoritesMapper {

    @Insert("""
            INSERT INTO FAVORITES
            (       MEMBER_ID
            ,       SPACE_ID
            )
            VALUES
            (       #{memberId}
            ,       #{spaceId}
            )
            """)
    @Options(useGeneratedKeys = true, keyProperty = "favoritesId")
    int insert(Favorites favorites);


    @Select("""
            SELECT  *
            FROM    FAVORITES
            WHERE   MEMBER_ID = #{memberId}   
            AND     SPACE_ID = #{spaceId}
            """)
    Favorites selectByMemberIdAndSpaceID(Favorites favorites);

    @Select("""
            SELECT  F.*
            ,       S.TITLE
            ,       S.ADDRESS
            ,       S.PRICE
            FROM    FAVORITES F
            LEFT    JOIN SPACE S ON F.SPACE_ID = S.SPACE_ID
            WHERE   F.MEMBER_ID = #{memberId}   
            """)
    List<Favorites> selectAllByMemberId(Integer memberId);

    @Delete("""
            DELETE  FROM FAVORITES
            WHERE   MEMBER_ID = #{memberId}   
            AND     SPACE_ID = #{spaceId}
            """)
    int delete(Favorites favorites);
}
