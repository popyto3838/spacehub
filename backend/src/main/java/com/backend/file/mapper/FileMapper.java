package com.backend.file.mapper;

import com.backend.file.domain.File;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface FileMapper {

    @Insert("""
            INSERT INTO FILE 
                (PARENT_ID, DIVISION, FILE_NAME) 
            VALUES 
                (#{parentId}, #{division}, #{fileName})
            """)
    void insertFile(File file);

    @Select("""
            SELECT f.PARENT_ID, f.DIVISION, f.FILE_NAME
                    FROM FILE f
                    WHERE f.DIVISION = 'SPACE'
                      AND f.FILE_ID = (
                          SELECT MIN(f2.FILE_ID)
                          FROM FILE f2
                          WHERE f2.PARENT_ID = f.PARENT_ID
                            AND f2.DIVISION = 'SPACE'
                      )
            """)
    List<File> selectAllOfSpaces();

    @Select("""
            SELECT *
            FROM FILE
            WHERE PARENT_ID = #{parentId}
            AND DIVISION = #{division}
            """)
    File selectFileByParentIdAndDivision(int parentId, String division);
}
