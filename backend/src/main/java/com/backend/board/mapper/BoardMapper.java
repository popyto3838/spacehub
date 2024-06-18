package com.backend.board.mapper;

import com.backend.board.domain.Board;
import com.backend.board.domain.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO BOARD (TITLE, CONTENT, MEMBER_ID, CATEGORY_ID, VIEWS)
            VALUES (#{title}, #{content}, #{memberId} , #{categoryId}, 1)
            """)
//    @Options(useGeneratedKeys = true, keyProperty = "memberId")
    int insert(Board board);

    @Select("""
            <script>
            SELECT B.BOARD_ID, B.VIEWS, B.TITLE, C.CATEGORY_NAME, M.NICKNAME, B.INPUT_DT, B.UPDATE_DT, C.CATEGORY_ID
            FROM BOARD B LEFT JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
                         LEFT JOIN CATEGORY C ON B.CATEGORY_ID = C.CATEGORY_ID
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
            SELECT *
            FROM CATEGORY
            """)
    List<Category> selectAllPagingForCategory(Integer offset, String searchType, String searchKeyword);

    @Select("""
            SELECT B.BOARD_ID, B.TITLE, B.CONTENT, B.INPUT_DT, B.UPDATE_DT, M.NICKNAME, M.MEMBER_ID
            FROM BOARD B JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
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
