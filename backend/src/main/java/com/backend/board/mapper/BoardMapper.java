package com.backend.board.mapper;

import com.backend.board.domain.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO BOARD (MEMBER_ID, TITLE, CONTENT, CATEGORY)
            VALUES (#{memberId}, #{title}, #{content}, #{category})
            """)
    int insert(Board board);

    @Select("""
            SELECT *
            FROM BOARD
            """)
    List<Board> selectAll();

    @Select("""
            SELECT *
            FROM BOARD
            WHERE BOARD_ID = #{boardId}
            """)
    Board selectByBoardId(Integer boardId);

    @Update("""
            UPDATE BOARD
            SET TITLE = #{title},
                CONTENT = #{content}
            WHERE BOARD_ID = #{boardId}
            """)
    int update(Board board);

    @Delete("""
            DELETE FROM BOARD
            WHERE BOARD_ID = #{boardId}
            """)
    int deleteByBoardId(Integer boardId);

    @Update("""
            UPDATE BOARD
            SET VIEWS = VIEWS + 1
            WHERE BOARD_ID = #{boardId}
            """)
    int updateViews(Integer boardId);


    @Select("""
            <script>
            SELECT *
            FROM BOARD
                <trim prefix="WHERE" prefixOverrides="OR">
                    <if test="searchType != null">
                        <bind name="pattern" value="'%' + searchKeyword + '%'" />
                        <if test="searchType == 'titleContent'">
                            OR TITLE LIKE #{pattern}
                            OR CONTENT LIKE #{pattern}
                        </if>
                        <if test="searchType == 'title'">
                            OR TITLE LIKE #{pattern}
                        </if>
                        <if test="searchType == 'content'">
                            OR CONTENT LIKE #{pattern}
                        </if>
                        <if test="searchType == 'nickname'">
                            OR NICKNAME LIKE #{pattern}
                        </if>
                    </if>
                </trim>
            ORDER BY BOARD_ID DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectAllPaging(Integer offset, String searchType, String searchKeyword);

    @Select("""
            SELECT COUNT(*)
            FROM BOARD
            """)
    Integer countAll();

    @Select("""
            <script>
            SELECT COUNT(BOARD_ID)
            FROM BOARD
                <trim prefix="WHERE" prefixOverrides="OR">
                    <if test="searchType != null">
                        <bind name="pattern" value="'%' + searchKeyword + '%'" />
                        <if test="searchType == 'titleContent'">
                            OR TITLE LIKE #{pattern}
                            OR CONTENT LIKE #{pattern}
                        </if>
                        <if test="searchType == 'title'">
                            OR TITLE LIKE #{pattern}
                        </if>
                        <if test="searchType == 'content'">
                            OR CONTENT LIKE #{pattern}
                        </if>
                        <if test="searchType == 'nickname'">
                            OR NICKNAME LIKE #{pattern}
                        </if>
                    </if>
                </trim>
            </script>
            """)
    Integer countAllWithSearch(String searchType, String searchKeyword);
}
