package com.backend.favorites.mapper;

import com.backend.favorites.domain.Favorites;
import org.apache.ibatis.annotations.*;

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

    @Delete("""
            DELETE  FROM FAVORITES
            WHERE   MEMBER_ID = #{memberId}   
            AND     SPACE_ID = #{spaceId}
            """)
    int delete(Favorites favorites);
}
