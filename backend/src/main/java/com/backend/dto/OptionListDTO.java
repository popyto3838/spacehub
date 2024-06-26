package com.backend.dto;

import lombok.Data;

@Data
public class OptionListDTO {
    private int optionListId;
    private String name;
    private boolean isActive;

    private String fileName;
}
