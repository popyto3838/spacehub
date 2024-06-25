package com.backend.dto;

import lombok.Data;

@Data
public class OptionListDTO {
    private int optionListId;
    private String optionListName;
    private boolean isActive;

    private String fileName;
}
