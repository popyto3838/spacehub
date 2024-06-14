package com.backend.mapper.board;

import com.backend.domain.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO BOARD (MEMBER_ID, TITLE, CONTENT, CATEGORY)
            VALUES (1, #{title}, #{content}, #{category})
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
            SELECT TITLLE, CONTENT, VIEWS, CATEGORY
            FORM BOARD
            ORDER BY BOARD_ID DESC
            LIMIT #{offset}, 10
            """)
    List<Board> selectAllPaging(Integer offset);

    @Select("""
            SELECT COUNT(*)
            FROM BOARD
            """)
    Integer countAll();
}
