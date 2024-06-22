package com.backend.dto;

import com.backend.file.domain.File;
import com.backend.typeList.domain.TypeList;
import lombok.Data;

@Data
public class TypeListResponseDto {

    private int typeListId;
    private String name;
    private boolean isActive;
    private File iconFile;

}
