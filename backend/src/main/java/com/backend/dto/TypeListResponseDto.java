package com.backend.dto;

import com.backend.file.domain.File;
import lombok.Data;

@Data
public class TypeListResponseDto {

    private int typeListId;
    private String name;
    private boolean isActive;
    private File iconFile;

}
