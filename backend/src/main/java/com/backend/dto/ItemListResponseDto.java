package com.backend.dto;

import com.backend.file.domain.File;
import lombok.Data;

@Data
public class ItemListResponseDto {

    private int itemId;
    private String name;
    private boolean isActive;
    private File iconFile;

}
