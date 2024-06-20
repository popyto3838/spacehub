package com.backend.fileList.mapper;

import com.backend.fileList.domain.FileList;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FileListMapper {

    @Insert("""
            INSERT INTO FILE_LIST 
                (PARENT_ID, DIVISION, FILE_NAME) 
            VALUES 
                (#{parentId}, #{division}, #{fileName})
            """)
    void insertFile(FileList fileList);

}
