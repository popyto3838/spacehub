package com.backend.typeList.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TypeList {

    private int typeListId;
    private String name;
    private boolean isActive;
}
