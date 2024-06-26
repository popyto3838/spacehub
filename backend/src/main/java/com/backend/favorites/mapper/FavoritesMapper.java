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
            WHERE   FAVORITES_ID = #{favoritesId}
            """)
    Favorites selectByFavoritesId(Integer favoritesId);

    @Select("""
            SELECT  *
            FROM    FAVORITES
            """)
    List<Favorites> selectAll();

    @Update("""
            UPDATE  FAVORITES
            SET     MEMBER_ID       = #{memberId}
            ,       SPACE_ID        = #{spaceId}
            ,       UPDATE_DT       = CURRENT_TIMESTAMP
            WHERE   FAVORITES_ID    = #{favoritesId}
            """)
    int update(Favorites favorites);

    @Delete("""
            DELETE  FROM FAVORITES
            WHERE   FAVORITES_ID = #{favoritesId}
            """)
    int deleteByFavoritesId(Integer favoritesId);
}
