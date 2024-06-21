package com.backend.file.mapper;

import com.backend.file.domain.File;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FileMapper {

    @Insert("""
            INSERT INTO FILE 
                (PARENT_ID, DIVISION, FILE_NAME) 
            VALUES 
                (#{parentId}, #{division}, #{fileName})
            """)
    void insertFile(File file);

}
