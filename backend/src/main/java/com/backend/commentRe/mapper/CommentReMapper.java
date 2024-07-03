package com.backend.comment.mapper;

import com.backend.commentRe.domain.CommentRe;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentReMapper {

    @Insert("""
            INSERT INTO COMMENT_RE 
            (       MEMBER_ID
            ,       TARGET_ID
            ,       COMMENT_ID
            ,       CONTENT
            ) VALUES 
            (       #{memberId}
            ,       #{targetId}
            ,       #{commentId}
            ,       #{content}
            )
            """)
    @Options(useGeneratedKeys = true, keyProperty = "commentReId")
    int insert(CommentRe commentRe);

    @Select("""
            SELECT  CR.*
            ,       TM.NICKNAME AS TARGET_NAME
            ,       M.NICKNAME
            FROM    COMMENT_RE CR
            JOIN    MEMBER TM ON CR.TARGET_ID = TM.MEMBER_ID
            JOIN    MEMBER M ON CR.MEMBER_ID = M.MEMBER_ID
            WHERE   CR.COMMENT_ID = #{commentId}
            """)
    List<CommentRe> selectAllByCommentId(Integer commentId);

    @Select("""
            SELECT  *
            FROM    COMMENT_RE
            WHERE   COMMENT_RE_ID = #{commentReId}
            """)
    CommentRe selectByCommentReId(Integer commentReId);

    @Update("""
            UPDATE  COMMENT_RE 
            SET     CONTENT   = #{content}
            ,       UPDATE_DT = CURRENT_TIMESTAMP
            WHERE   COMMENT_RE_ID = #{commentReId}
            """)
    int update(CommentRe commentRe);

    @Delete("""
            DELETE  FROM COMMENT_RE 
            WHERE   COMMENT_RE_ID = #{commentReId}
            """)
    int deleteByCommentReId(Integer commentReId);

    @Delete("""
            DELETE  FROM COMMENT_RE 
            WHERE   COMMENT_ID = #{commentId}
            """)
    int deleteByCommentId(Integer commentId);
}