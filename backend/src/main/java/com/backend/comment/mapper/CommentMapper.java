package com.backend.comment.mapper;

import com.backend.comment.domain.Comment;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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


    @Select("""
            SELECT C.COMMENT_ID, C.CONTENT, C.INPUT_DT, C.UPDATE_DT, M.NICKNAME, C.PARENT_ID
            FROM COMMENT C JOIN MEMBER M ON C.MEMBER_ID = M.MEMBER_ID
            WHERE PARENT_ID = #{boardId}
            ORDER BY COMMENT_ID
            """)
    List<Comment> selectAllByBoardId(Integer boardId);

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
}


