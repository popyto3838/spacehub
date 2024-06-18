package com.backend.board.mapper;

import com.backend.board.domain.Board;
import com.backend.board.domain.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    // 게시물 작성
    @Insert("""
            INSERT INTO BOARD (TITLE, CONTENT, MEMBER_ID, CATEGORY_ID, VIEWS)
            VALUES (#{title}, #{content}, #{memberId} , #{categoryId}, 1)
            """)
    /* 파일 첨부를 위해 insert 되면 pk를 boardId에 세팅 */
    @Options(useGeneratedKeys = true, keyProperty = "boardId")
    int insert(Board board);

    // 게시물 파일 첨부
    @Insert("""
            INSERT INTO FILE_LIST(PARENT_ID, DIVISION, FILE_NAME)
            VALUES (#{parentId}, 'BOARD', #{fileName})
            """)
    int insertFileList(Integer parentId, String fileName);

    // 게시물 목록 조회
    @Select("""
            <script>
            SELECT B.BOARD_ID, B.VIEWS, B.TITLE, B.INPUT_DT, B.UPDATE_DT,
                   C.CATEGORY_NAME, C.CATEGORY_ID,
                   M.NICKNAME,
                   COUNT(SUBQUERY_TABLE.FILE_NAME) number_of_images
            FROM BOARD B LEFT JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
                         LEFT JOIN CATEGORY C ON B.CATEGORY_ID = C.CATEGORY_ID
                         LEFT JOIN (SELECT PARENT_ID, FILE_NAME FROM FILE_LIST) AS SUBQUERY_TABLE ON B.BOARD_ID = SUBQUERY_TABLE.PARENT_ID
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
            GROUP BY B.BOARD_ID
            ORDER BY BOARD_ID DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectAllPaging(Integer offset, String searchType, String searchKeyword);

    // 게시물 목록 카테고리 조회
    @Select("""
            SELECT *
            FROM CATEGORY
            """)
    List<Category> selectAllPagingForCategory(Integer offset, String searchType, String searchKeyword);

    // 하나의 게시물 조회
    @Select("""
            SELECT B.BOARD_ID, B.TITLE, B.CONTENT, B.INPUT_DT, B.UPDATE_DT, M.NICKNAME, M.MEMBER_ID
            FROM BOARD B JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
            WHERE BOARD_ID = #{boardId}
            """)
    Board selectByBoardId(Integer boardId);

    // 게시물의 파일 이름 조회
    @Select("""
            SELECT FILE_NAME
            FROM FILE_LIST
            WHERE PARENT_ID = #{parentId}
            """)
    List<String> selectByFileNameByBoardId(Integer parentId);


    // 게시물 수정
    @Update("""
            UPDATE BOARD
            SET TITLE = #{title},
                CONTENT = #{content}
            WHERE BOARD_ID = #{boardId}
            """)
    int update(Board board);

    // 게시물 삭제
    @Delete("""
            DELETE FROM BOARD
            WHERE BOARD_ID = #{boardId}
            """)
    int deleteByBoardId(Integer boardId);

    @Delete("""
            DELETE FROM FILE_LIST
            WHERE PARENT_ID = #{parentId}
            """)
    int deleteFileByBoardId(Integer parentId);

    // 게시물 클릭시 조회수 업데이트
    @Update("""
            UPDATE BOARD
            SET VIEWS = VIEWS + 1
            WHERE BOARD_ID = #{boardId}
            """)
    int updateViews(Integer boardId);

    // 게시물 목록에서 총 게시물 개수 조회
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
