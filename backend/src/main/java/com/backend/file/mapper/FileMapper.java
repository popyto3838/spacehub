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
            SELECT f.PARENT_ID, f.DIVISION, f.FILE_NAME
                    FROM FILE f
                    WHERE f.DIVISION = 'TYPE'
                      AND f.FILE_ID = (
                          SELECT MIN(f2.FILE_ID)
                          FROM FILE f2
                          WHERE f2.PARENT_ID = f.PARENT_ID
                            AND f2.DIVISION = 'TYPE'
                      )
            """)
    List<File> selectAllOfTypes();
}
