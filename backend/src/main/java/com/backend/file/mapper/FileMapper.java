package com.backend.file.mapper;

import com.backend.file.domain.File;
import org.apache.ibatis.annotations.*;
import retrofit2.http.DELETE;

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
    List<File> selectFileByDivisionAndParentId(String division, int parentId);

    @Select("""
            SELECT *
            FROM FILE
            WHERE FILE_NAME = #{fullPath}
            """)
    File findFileByFullPath(String fullPath);

    @Update("""
            UPDATE FILE 
            SET FILE_NAME = #{fileName} 
            WHERE FILE_ID = #{fileId}
            """)
    void updateFile(File existingFile);

    @Delete("""
            DELETE FROM FILE
            WHERE FILE_NAME = #{fullPath}
            """)
    void deleteFileByFullPath(String fullPath);

    @Select("""
            SELECT *
            FROM FILE
            WHERE FILE_ID = #{fileId}
            """)
    File selectFileById(int fileId);

    @Delete("""
            DELETE FROM FILE
            WHERE FILE_ID = #{fileId}
            """)
    void deleteFileById(int fileId);

    @Select("""
            SELECT O.OPTION_LIST_ID, O.NAME, F.FILE_NAME
            FROM OPTION_LIST O
            LEFT JOIN FILE F ON O.OPTION_LIST_ID = F.PARENT_ID AND F.DIVISION = 'OPTION'
            WHERE O.OPTION_LIST_ID IN 
                (SELECT OPTION_LIST_ID
                FROM SPACE_CONFIG
                WHERE SPACE_ID = #{spaceId})
            """)
    List<File> selectAllOfTypes();
}
