package com.backend.board.mapper;

import com.backend.board.domain.Board;
import com.backend.board.domain.Category;
import com.backend.fileList.domain.FileList;
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

    // 게시물 파일 첨부(게시물의 categoryId를 참고해서 division 삽입, parentId? boardId?)
    @Insert("""
            <script>
            INSERT INTO FILE_LIST(PARENT_ID, DIVISION, FILE_NAME)
            VALUES (#{parentId},
                    <choose>
                        <when test="categoryId == 1"> 'NOTICE' </when>
                        <when test="categoryId == 2"> 'FAQ' </when>
                    </choose>,
                    #{fileName})
            </script>
            """)
    int insertFileList(Integer parentId, String fileName, Integer categoryId);

    // 게시물 목록 조회
    @Select("""
            <script>
            SELECT B.BOARD_ID, B.VIEWS, B.TITLE, B.INPUT_DT, B.UPDATE_DT,
                   C.CATEGORY_NAME, C.CATEGORY_ID,
                   CASE WHEN M.WITHDRAWN = 'Y' THEN '탈퇴한 회원입니다.' ELSE M.NICKNAME END AS WRITER,
                   COUNT(DISTINCT SUBQUERY_TABLE.FILE_NAME) number_of_images,
                   COUNT(DISTINCT D.COMMENT_ID) number_of_comments,
                   COUNT(DISTINCT L.MEMBER_ID) number_of_likes
            FROM BOARD B LEFT JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
                         LEFT JOIN CATEGORY C ON B.CATEGORY_ID = C.CATEGORY_ID
                         LEFT JOIN (SELECT PARENT_ID, FILE_NAME FROM FILE_LIST) AS SUBQUERY_TABLE ON B.BOARD_ID = SUBQUERY_TABLE.PARENT_ID
                         LEFT JOIN (SELECT COMMENT_ID, PARENT_ID FROM COMMENT) AS D ON B.BOARD_ID = D.PARENT_ID
                         LEFT JOIN LIKES L ON B.BOARD_ID = L.BOARD_ID
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
                            OR M.NICKNAME LIKE #{pattern}
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

    // 하나의 게시물 조회(M.MEBER_ID -> B.MEMBER_ID, WHERE에 B.BOARD_ID)
    @Select("""
            SELECT B.BOARD_ID, B.TITLE, B.CONTENT, B.INPUT_DT, B.UPDATE_DT, B.CATEGORY_ID,
                   CASE WHEN M.WITHDRAWN = 'Y' THEN '탈퇴한 회원입니다.' ELSE M.NICKNAME END AS WRITER,
                   B.MEMBER_ID
            FROM BOARD B JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
            WHERE B.BOARD_ID = #{boardId}
            """)
    Board selectByBoardId(Integer boardId);

    // 하나의 게시물에서 파일 이름 조회(2개 테스트)
    @Select("""
            SELECT F.FILE_NAME, F.PARENT_ID, F.FILE_LIST_ID, B.BOARD_ID
            FROM FILE_LIST F
            JOIN BOARD B ON F.PARENT_ID = B.BOARD_ID
            WHERE PARENT_ID = #{parentId}
            """)
    List<String> selectByFileNameByBoardId(Integer parentId);

    /*@Select("""
            SELECT F.FILE_NAME, F.PARENT_ID, F.FILE_LIST_ID, F.DIVISION, B.BOARD_ID, B.CATEGORY_ID
            FROM FILE_LIST F
            JOIN (SELECT BOARD_ID, CATEGORY_ID FROM BOARD) AS B ON F.PARENT_ID = B.BOARD_ID
            WHERE PARENT_ID = #{parentId}
            """)
    List<String> selectByFileNameByBoardId(Integer parentId);*/

    // 게시물 파일 이름 조회2
    @Select("""
            SELECT F.FILE_NAME, F.PARENT_ID, F.FILE_LIST_ID, F.DIVISION, B.BOARD_ID
            FROM FILE_LIST F
            JOIN BOARD B ON F.PARENT_ID = B.BOARD_ID
            WHERE B.BOARD_ID = #{boardId}
                        """)
    List<FileList> selectByFileNameByBoardIdForUpdate(Integer boardId);


    // 게시물 수정
    @Update("""
            UPDATE BOARD
            SET TITLE = #{title},
                CONTENT = #{content}
            WHERE BOARD_ID = #{boardId}
            """)
    int update(Board board);

    // 게시물 수정시 첨부된 파일 삭제(#{}에 parentId, boardId)
    @Delete("""
            DELETE FROM FILE_LIST
            WHERE PARENT_ID = #{parentId}
              AND FILE_NAME = #{fileName}
            """)
    int deleteByBoardIdAndName(Integer parentId, String fileName);

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
            SELECT COUNT(BOARD_ID), M.NICKNAME
            FROM BOARD B LEFT JOIN MEMBER M ON B.MEMBER_ID = M.MEMBER_ID
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
                            OR M.NICKNAME LIKE #{pattern}
                        </if>
                    </if>
                </trim>
            </script>
            """)
    Integer countAllWithSearch(String searchType, String searchKeyword);


    @Select("""
            SELECT B.BOARD_ID
            FROM BOARD B JOIN COMMENT C ON B.BOARD_ID = C.PARENT_ID
            WHERE B.BOARD_ID = #{boardId}
            """)
    Integer selectByBoardIdForComment(Integer boardId);

    // 좋아요 삭제
    @Delete("""
            DELETE FROM LIKES
            WHERE BOARD_ID = #{boardId}
              AND MEMBER_ID = #{memberId}
            """)
    int deleteLikeByBoardIdAndMemberId(Integer boardId, Integer memberId);

    // 좋아요
    @Insert("""
            INSERT INTO LIKES (BOARD_ID, MEMBER_ID)
            VALUES (#{boardId}, #{memberId})
            """)
    int insertLikeByBoardIdAndMemberId(Integer boardId, Integer memberId);

    // 좋아요 카운트
    @Select("""
            SELECT COUNT(*)
            FROM LIKES
            WHERE BOARD_ID = #{boardId}
            """)
    int selectCountLikeByBoardId(Integer boardId);

    // 좋아요 했으면 count가 1, 아니면 0
    @Select("""
            SELECT COUNT(*)
            FROM LIKES
            WHERE BOARD_ID = #{boardId}
              AND MEMBER_ID = #{memberId}
            """)
    int selectLikeByBoardIdAndMemberId(Integer boardId, String memberId);

    // 게시물 삭제시 좋아요 먼저 삭제
    @Delete("""
            DELETE FROM LIKES
            WHERE BOARD_ID = #{boardId}
            """)
    int deleteLikeByBoardId(Integer boardId);

    // 회원탈퇴시 좋아요 먼저 삭제
    @Delete("""
            DELETE FROM LIKES
            WHERE MEMBER_ID = #{memberId}
            """)
    int deleteLikeByMemberId(Integer memberId);
}
