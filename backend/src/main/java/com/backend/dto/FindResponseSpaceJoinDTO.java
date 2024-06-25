package com.backend.dto;

import com.backend.file.domain.File;
import com.backend.space.domain.Space;
import com.backend.typeList.domain.TypeList;
import lombok.Data;

import java.util.List;

@Data
public class FindResponseSpaceJoinDTO {

    private TypeList typeList;
    private Space space;

    // Space 이미지 FILE 테이블
    private List<File> spaceImgFiles;
    // Option 이미지 FILE 테이블과 OPTION_LIST 테이블
    private List<OptionListDTO> optionList;
}
