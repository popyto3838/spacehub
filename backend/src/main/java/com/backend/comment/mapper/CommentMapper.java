package com.backend.comment.mapper;

import com.backend.comment.domain.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            <script>
            INSERT INTO COMMENT(MEMBER_ID, PARENT_ID, DIVISION, CONTENT)
            VALUES (#{memberId}, #{boardId},
                    <choose>
                        <when test="categoryId == 1"> 'NOTICE' </when>
                        <when test="categoryId == 2"> 'FAQ' </when>
                    </choose>,
                    #{content})
            </script>
            """)
    int insert(Comment comment);


    // WITHDRAWN이 Y이면 탈퇴한 회원입니다로 뜨게
    @Select("""
            SELECT C.COMMENT_ID, C.CONTENT, C.INPUT_DT, C.UPDATE_DT, C.PARENT_ID, C.MEMBER_ID,
                   CASE WHEN M.WITHDRAWN = 'Y' THEN '탈퇴한 회원입니다.' ELSE M.NICKNAME END AS NICKNAME
            FROM COMMENT C JOIN MEMBER M ON C.MEMBER_ID = M.MEMBER_ID
            WHERE PARENT_ID = #{boardId}
            ORDER BY COMMENT_ID
            """)
    List<Comment> selectAllByBoardId(Integer parentId);

    @Delete("""
            DELETE FROM COMMENT
            WHERE COMMENT_ID = #{commentId}
            """)
    int deleteById(Integer commentId);

    // 권한을 조회하기 위해서
    @Select("""
            SELECT *
            FROM COMMENT
            WHERE COMMENT_ID = #{commentId}
            """)
    Comment selectById(Integer commentId);

    @Update("""
            UPDATE COMMENT
            SET CONTENT = #{content}
            WHERE COMMENT_ID = #{commentId}
            """)
    int update(Comment comment);


    // space의 review
    @Insert("""
            INSERT INTO COMMENT(MEMBER_ID, PARENT_ID, DIVISION, CONTENT, RATE_SCORE)
            VALUES (#{memberId}, #{spaceId},'REVIEW', #{content}, #{rateScore})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "commentId")
    int insertReview(Comment comment);

    @Insert("""
            INSERT INTO FILE(PARENT_ID, DIVISION, FILE_NAME)
            VALUES (#{parentId}, 'REVIEW', #{fileName})
            """)
    int insertFileList(Integer parentId, String fileName);

    @Select("""
            SELECT C.COMMENT_ID, C.CONTENT, C.INPUT_DT, C.UPDATE_DT, C.PARENT_ID, C.MEMBER_ID,C.RATE_SCORE,
                   (SELECT AVG(RATE_SCORE) FROM COMMENT WHERE DIVISION = 'REVIEW') rate_score_avg,
                   CASE WHEN M.WITHDRAWN = 'Y' THEN '탈퇴한 회원입니다.' ELSE M.NICKNAME END AS NICKNAME
            FROM COMMENT C JOIN MEMBER M ON C.MEMBER_ID = M.MEMBER_ID
            WHERE C.PARENT_ID = #{parentId}
              AND C.DIVISION = 'REVIEW'
            ORDER BY C.COMMENT_ID
            """)
    List<Comment> selectAllBySpaceIdForReview(Integer spaceId);
    /* SUM(C.RATE_SCORE) / COUNT(C.COMMENT_ID) rate_score_avg, */

    @Select("""
            SELECT C.COMMENT_ID, C.CONTENT, C.INPUT_DT, C.UPDATE_DT, C.PARENT_ID, C.MEMBER_ID,C.RATE_SCORE,
                   SUM(C.RATE_SCORE) / COUNT(C.COMMENT_ID) AS rate_score_avg,
                   CASE WHEN M.WITHDRAWN = 'Y' THEN '탈퇴한 회원입니다.' ELSE M.NICKNAME END AS NICKNAME
            FROM COMMENT C JOIN MEMBER M ON C.MEMBER_ID = M.MEMBER_ID
            WHERE C.PARENT_ID = #{parentId}
            GROUP BY C.COMMENT_ID
            ORDER BY COMMENT_ID
            """)
    List<Comment> selectAllBySpaceId(Integer parentId);
    /*F.FILE_NAME, F.PARENT_ID*/
    /*LEFT JOIN (SELECT FILE_NAME, PARENT_ID FROM FILE) AS F ON C.PARENT_ID = F.PARENT_ID*/

    @Delete("""
            DELETE FROM COMMENT
            WHERE COMMENT_ID = #{commentId}
            """)
    int deleteByCommentId(Comment comment);

    @Select("""
            SELECT S.*, CASE WHEN M.WITHDRAWN = 'Y' THEN '탈퇴한 회원입니다.' ELSE M.NICKNAME END
            FROM SPACE S JOIN MEMBER M ON S.MEMBER_ID = M.MEMBER_ID
            WHERE S.SPACE_ID = #{spaceId}
            """)
    Comment selectBySpaceId(Integer spaceId);

    @Select("""
            SELECT F.FILE_NAME, F.PARENT_ID, F.FILE_ID, S.SPACE_ID
            FROM FILE F JOIN SPACE S ON F.PARENT_ID = S.SPACE_ID
            WHERE PARENT_ID = #{parentId}
            """)
    List<String> selectByFileNameBySpaceId(Integer parentId);

    @Update("""
            UPDATE COMMENT
            SET CONTENT = #{content},
                RATE_SCORE = #{rateScore}
            WHERE COMMENT_ID = #{commentId}
            """)
    int updateByCommentId(Comment comment);


    // space의 qna
    @Insert("""
            INSERT INTO COMMENT(MEMBER_ID, PARENT_ID, DIVISION, CONTENT)
            VALUES (#{memberId}, #{spaceId},'QNA', #{content})

            """)
    @Options(useGeneratedKeys = true, keyProperty = "commentId")
    int insertQna(Comment comment);

    @Select("""
            SELECT C.COMMENT_ID, C.CONTENT, C.INPUT_DT, C.UPDATE_DT, C.PARENT_ID, C.MEMBER_ID,C.RATE_SCORE,
                   CASE WHEN M.WITHDRAWN = 'Y' THEN '탈퇴한 회원입니다.' ELSE M.NICKNAME END AS NICKNAME
            FROM COMMENT C JOIN MEMBER M ON C.MEMBER_ID = M.MEMBER_ID
            WHERE C.PARENT_ID = #{parentId}
              AND C.DIVISION = 'QNA'
            ORDER BY COMMENT_ID
            """)
    List<Comment> selectAllBySpaceIdForQNA(Integer spaceId);

    @Select("""
            SELECT FILE_NAME, PARENT_ID
            FROM FILE
            WHERE PARENT_ID = #{parentId}
            """)
    List<String> selectByFileNameByCommentId(Integer parentId);

    // 코멘트의 file 삭제
    @Delete("""
            DELETE FROM FILE
            WHERE PARENT_ID = #{parentId}
            """)
    int deleteByCommentIdForFile(Integer parentId);

    // 코멘트 수정 페이지에서 첨부된 파일 삭제
    @Delete("""
            DELETE FROM FILE
            WHERE PARENT_ID = #{parentId}
              AND FILE_NAME = #{fileName}
            """)
    int deleteByCommentIdAndName(Integer parentId, String fileName);


}